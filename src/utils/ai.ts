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

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        let errorMessage = 'Failed to get AI response'
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please check your API key.'
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }

        return new Response(JSON.stringify({
          error: errorMessage,
          status: response.status,
          details: errorText
        }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Handle streaming response
      if (response.body) {
        const encoder = new TextEncoder()
        const transformedStream = new ReadableStream({
          async start(controller) {
            try {
              const reader = response.body!.getReader()
              const decoder = new TextDecoder()
              let buffer = ''

              while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                
                // Handle different streaming formats
                // This assumes Server-Sent Events (SSE) format, adjust as needed for your API
                const lines = buffer.split('\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                  if (line.trim() === '') continue
                  
                  // Handle SSE format: data: {...}
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6)
                    if (data === '[DONE]') {
                      controller.close()
                      return
                    }
                    
                    try {
                      const parsed = JSON.parse(data)
                      
                      // Transform to match expected client format
                      // Adjust this based on your API's response structure
                      let textContent = ''
                      
                      // Your API uses OpenAI-compatible format: choices[index].delta.content
                      if (parsed.choices?.[0]?.delta?.content) {
                        // Your API's format (matches OpenAI spec)
                        textContent = parsed.choices[0].delta.content
                      } else if (parsed.content) {
                        // Fallback for simple format
                        textContent = parsed.content
                      } else if (parsed.text) {
                        // Another fallback format
                        textContent = parsed.text
                      }
                      
                      if (textContent) {
                        const chunk = {
                          type: 'content_block_delta',
                          delta: {
                            type: 'text_delta',
                            text: textContent,
                          },
                        }
                        controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
                      }
                    } catch (e) {
                      console.warn('Failed to parse streaming data:', data, e)
                    }
                  }
                }
              }
              
              controller.close()
            } catch (error) {
              console.error('Stream processing error:', error)
              controller.error(error)
            }
          },
        })

        return new Response(transformedStream, {
          headers: {
            'Content-Type': 'application/x-ndjson',
          },
        })
      } else {
        // Fallback for non-streaming responses
        const responseData = await response.json()
        
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
      console.error('Error in genAIResponse:', error)
      
      let errorMessage = 'Failed to get AI response'
      let statusCode = 500
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and API URL.'
          statusCode = 503
        } else {
          errorMessage = error.message
        }
      }
      
      return new Response(JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.name : undefined
      }), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  })