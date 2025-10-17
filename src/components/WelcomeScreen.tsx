import { Send } from 'lucide-react'

interface WelcomeScreenProps {
  input: string
  setInput: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
  suggestions: string[]
  onSuggestionSelected: (value: string) => void
}

export function WelcomeScreen({
  input,
  setInput,
  handleSubmit,
  isLoading,
  suggestions,
  onSuggestionSelected,
}: WelcomeScreenProps) {
  return (
    <div className="flex items-center justify-center flex-1 px-4">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="mb-4 text-6xl font-bold text-transparent uppercase bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text">
          chatFGC
        </h1>
        <p className="w-2/3 mx-auto mb-6 text-lg text-gray-400">
          Master your matches faster—chatFGC can break down matchups, training plans, and tournament prep with FGC-focused insight.
        </p>

        {suggestions.length > 0 && (
          <div className="grid gap-3 pb-8 mt-8 text-left sm:grid-cols-3">
            {suggestions.map(question => (
              <button
                key={question}
                type="button"
                onClick={() => onSuggestionSelected(question)}
                className="h-full p-4 text-sm transition border rounded-lg bg-gray-800/40 border-orange-500/20 hover:border-orange-400/70 hover:bg-gray-800/70 text-gray-200 text-left"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative max-w-xl mx-auto">
            <textarea
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void handleSubmit(event)
                }
              }}
              placeholder="Ask me about matchup prep, lab work, or tournament nerves..."
              className="w-full py-3 pl-4 pr-12 overflow-hidden text-sm text-white placeholder-gray-400 border rounded-lg resize-none border-orange-500/20 bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              rows={1}
              style={{ minHeight: '88px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute p-2 text-orange-500 transition-colors -translate-y-1/2 right-2 top-1/2 hover:text-orange-400 disabled:text-gray-500 focus:outline-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}