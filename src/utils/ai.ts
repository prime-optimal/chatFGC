import { createServerFn } from '@tanstack/react-start'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant. Provide clear, concise, and accurate responses to user questions. Use markdown formatting when appropriate to improve readability.`

// Custom API implementation with streaming support
export const genAIResponse = createServerFn({ method: 'POST', response: 'raw' })
  .validator(
    (d: {
      messages: Array<Message>
      systemPrompt?: { value: string; enabled: boolean }
    }) => d,
  )
  .handler(async ({ data }) => {
    const isSocketTermination = (error: unknown): boolean => {
      if (!error) {
        return false
      }

      if (error instanceof Error) {
        const lower = `${error.message} ${error.name}`.toLowerCase()
        if (lower.includes('und_err_socket') || lower.includes('socket') || lower.includes('terminated')) {
          return true
        }

        const anyError = error as { code?: string; cause?: unknown }
        if (anyError.code === 'UND_ERR_SOCKET') {
          return true
        }

        if (anyError.cause && isSocketTermination(anyError.cause)) {
          return true
        }
      }

      if (typeof error === 'object' && 'originalError' in (error as Record<string, unknown>)) {
        return isSocketTermination((error as { originalError?: unknown }).originalError)
      }

      return false
    }

    const mapUpstreamError = (error: unknown) => {
      let errorMessage = 'Failed to get AI response'
      let statusCode = 500
      let details: string | undefined

      if (error instanceof Error) {
        details = error.name

        if (error.name === 'AbortError') {
          errorMessage = 'Streaming request aborted.'
          statusCode = 499
        } else if (error.message.includes('interrupted') || error.message.includes('terminated')) {
          errorMessage = 'Streaming connection interrupted. Please try again.'
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and API URL.'
          statusCode = 503
        } else {
          errorMessage = error.message
        }
      }

      return {
        statusCode,
        payload: {
          error: errorMessage,
          details,
        },
      }
    }

    // Check for API configuration in environment variables
    const apiUrl = process.env.CHAT_API_URL
    const apiKey = process.env.CHAT_API_KEY

    if (!apiUrl) {
      throw new Error(
        'Missing API URL: Please set CHAT_API_URL in your environment variables or .env file.'
      )
    }

    // Filter out error messages and empty messages
    const formattedMessages = data.messages
      .filter(
        (msg) =>
          msg.content.trim() !== '' &&
          !msg.content.startsWith('Sorry, I encountered an error'),
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content.trim(),
      }))

    if (formattedMessages.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid messages to send' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = data.systemPrompt?.enabled
      ? `${DEFAULT_SYSTEM_PROMPT}\n\n${data.systemPrompt.value}`
      : DEFAULT_SYSTEM_PROMPT

    // Prepare request headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add API key if provided
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    // Parse additional headers from environment if provided
    const additionalHeaders = process.env.CHAT_API_HEADERS
    if (additionalHeaders) {
      try {
        const headerPairs = additionalHeaders.split(',')
        for (const pair of headerPairs) {
          const [key, value] = pair.split(':')
          if (key && value) {
            headers[key.trim()] = value.trim()
          }
        }
      } catch (error) {
        console.warn('Failed to parse CHAT_API_HEADERS:', error)
      }
    }

    // Prepare request body - format based on your API's OpenAPI spec
    const requestBody = {
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...formattedMessages,
      ],
      stream: true, // Enable streaming
      max_tokens: 4096,
      temperature: 0.7,
      // Your API supports additional optional parameters
      instruction_override: data.systemPrompt?.enabled ? data.systemPrompt.value : undefined,
      include_functions_info: false,
      include_retrieval_info: false,
      include_guardrails_info: false,
      provide_citations: false,
      stream_options: {
        include_usage: true
      }
    }

    const abortController = new AbortController()
    try {
      const upstream = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      })

      if (!upstream.ok) {
        const errorText = await upstream.text()
        console.error('API Error Response:', errorText)

        let errorMessage = 'Failed to get AI response'
        if (upstream.status === 401) {
          errorMessage = 'Authentication failed. Please check your API key.'
        } else if (upstream.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.'
        } else if (upstream.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }

        return new Response(
          JSON.stringify({
            error: errorMessage,
            status: upstream.status,
            details: errorText,
          }),
          {
            status: upstream.status,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      // Handle streaming response
      if (upstream.body) {
        const encoder = new TextEncoder()
        const reader = upstream.body.getReader()
        const decoder = new TextDecoder()

        const transformedStream = new ReadableStream({
          async start(controller) {
            let buffer = ''
            let streamClosed = false

            const emitText = (textContent: string) => {
              if (!textContent) {
                return
              }

              const chunk = {
                type: 'content_block_delta',
                delta: {
                  type: 'text_delta',
                  text: textContent,
                },
              }

              controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
            }

            const emitErrorChunk = (message: string) => {
              const chunk = {
                type: 'content_block_delta',
                delta: {
                  type: 'text_delta',
                  text: message,
                },
              }

              controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
            }

            try {
              while (true) {
                const { done, value } = await reader.read().catch((readError) => {
                  const mapped = mapUpstreamError(readError)
                  throw Object.assign(mapped, { originalError: readError })
                })
                if (done) {
                  break
                }

                buffer += decoder.decode(value, { stream: true })

                const lines = buffer.split('\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                  if (line.trim() === '') continue

                  if (line.startsWith('data: ')) {
                    const dataLine = line.slice(6)

                    if (dataLine === '[DONE]') {
                      streamClosed = true
                      break
                    }

                    try {
                      const parsed = JSON.parse(dataLine)

                      let textContent = ''
                      if (parsed.choices?.[0]?.delta?.content) {
                        textContent = parsed.choices[0].delta.content
                      } else if (typeof parsed.content === 'string') {
                        textContent = parsed.content
                      } else if (typeof parsed.text === 'string') {
                        textContent = parsed.text
                      }

                      emitText(textContent)
                    } catch (parseError) {
                      console.warn('Failed to parse streaming data:', dataLine, parseError)
                    }
                  }
                }

                if (streamClosed) {
                  break
                }
              }

              if (buffer.trim()) {
                try {
                  const parsed = JSON.parse(buffer.startsWith('data: ') ? buffer.slice(6) : buffer)
                  if (parsed.choices?.[0]?.delta?.content) {
                    emitText(parsed.choices[0].delta.content)
                  } else if (typeof parsed.content === 'string') {
                    emitText(parsed.content)
                  }
                } catch {
                  // Ignore trailing buffer if it's not valid JSON
                }
              }
            } catch (error) {
              if (isSocketTermination(error)) {
                console.warn('Stream terminated by upstream socket:', error)
              } else {
                console.error('Stream processing error:', error)
                if (!streamClosed) {
                  const mapped =
                    typeof error === 'object' && error && 'payload' in error
                      ? (error as { payload: { error: string } }).payload.error
                      : mapUpstreamError(error).payload.error
                  emitErrorChunk(mapped)
                }
              }
            } finally {
              streamClosed = true
              controller.close()
            }
          },
          cancel() {
            abortController.abort()
            reader.cancel().catch(() => {})
          },
        })

        return new Response(transformedStream, {
          headers: {
            'Content-Type': 'application/x-ndjson',
          },
        })
      } else {
        // Fallback for non-streaming responses
        const responseData = await upstream.json()
        
       // Extract content from response - your API uses OpenAI-compatible format
       let content = ''
       if (responseData.choices?.[0]?.message?.content) {
         // Your API's non-streaming format (matches OpenAI spec)
         content = responseData.choices[0].message.content
       } else if (responseData.content) {
         // Fallback for simple format
         content = responseData.content
       } else if (responseData.response) {
         // Another fallback format
         content = responseData.response
       } else {
         content = JSON.stringify(responseData)
       }

        // Convert single response to streaming format for consistency
        const encoder = new TextEncoder()
        const chunk = {
          type: 'content_block_delta',
          delta: {
            type: 'text_delta',
            text: content,
          },
        }

        const transformedStream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
            controller.close()
          },
        })

        return new Response(transformedStream, {
          headers: {
            'Content-Type': 'application/x-ndjson',
          },
        })
      }
    } catch (error) {
      const { statusCode, payload } = mapUpstreamError(error)
      console.error('Error in genAIResponse:', error)

      return new Response(JSON.stringify(payload), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  })