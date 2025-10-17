import { genAIResponse, type Message } from '../ai'

const originalEnv = { ...process.env }
const encoder = new TextEncoder()

function createSSEStream(lines: string[]) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(line))
      }
      controller.close()
    },
  })
}

async function collectStream(response: Response) {
  if (!response.body) return ''

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let output = ''

  while (true) {
    const chunk = await reader.read()
    if (chunk.done) break
    output += decoder.decode(chunk.value)
  }

  return output
}

describe('genAIResponse', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env = {
      ...originalEnv,
      CHAT_API_URL: 'https://example.com/api/chat',
    }

    global.fetch = vi.fn()
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  const baseMessage: Message = {
    id: '1',
    role: 'user',
    content: 'Hello',
  }

  it('streams successful content', async () => {
    const mockResponse = new Response(
      createSSEStream([
        'data: {"choices":[{"delta":{"content":"Hello"}}] }\n',
        'data: {"choices":[{"delta":{"content":" world"}}] }\n',
        'data: [DONE]\n',
      ]),
      {
        headers: { 'Content-Type': 'text/event-stream' },
      },
    )

    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse)

    const result = await genAIResponse({
      data: {
        messages: [baseMessage],
      },
    })

    expect(result.headers.get('Content-Type')).toBe('application/x-ndjson')

    const output = await collectStream(result)
    const messages = output
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line))

    expect(messages).toEqual([
      {
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: 'Hello' },
      },
      {
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: ' world' },
      },
    ])
  })

  it('returns structured error when upstream request fails', async () => {
    const error = new Error('Socket closed')
    vi.mocked(global.fetch).mockRejectedValueOnce(error)

    const result = await genAIResponse({
      data: {
        messages: [baseMessage],
      },
    })

    expect(result.status).toBe(500)
    const payload = await result.json()
    expect(payload.error).toBe('Socket closed')
  })

  it('throws when chat API URL is missing', async () => {
    process.env = {
      ...originalEnv,
      CHAT_API_URL: '',
    }

    await expect(
      genAIResponse({
        data: {
          messages: [baseMessage],
        },
      }),
    ).rejects.toThrow('Missing API URL')
  })
})
