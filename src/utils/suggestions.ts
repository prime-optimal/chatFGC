const FGC_SUGGESTIONS = [
  'How should I structure a weekly training plan to level up my Street Fighter fundamentals?',
  'What are the key neutral game habits top players use in high-pressure tournaments?',
  'How can I lab specific matchup counters efficiently before a major?',
  'What drills help improve whiff punishing and reaction timing in anime fighters?',
  'How do I build a counter-strategy for a defensive zoner in Mortal Kombat?',
  'What mindset adjustments should I focus on to avoid bracket nerves?'
]

export const ROTATION_INTERVAL_MS = 15000
const SUGGESTION_COUNT = 3

function pickSlice(seed: number) {
  const start = seed % FGC_SUGGESTIONS.length
  const ordered = [...FGC_SUGGESTIONS.slice(start), ...FGC_SUGGESTIONS.slice(0, start)]
  return ordered.slice(0, SUGGESTION_COUNT)
}

export function getSuggestedQuestions(seed: number) {
  return pickSlice(seed)
}

export function subscribeToSuggestions(callback: (suggestions: string[]) => void) {
  if (typeof window === 'undefined') {
    callback(getSuggestedQuestions(Date.now()))
    return () => {}
  }

  let mounted = true
  let tick = 0

  const update = () => {
    if (!mounted) return
    const nowSeed = Date.now() + tick
    callback(getSuggestedQuestions(nowSeed))
    tick += 1
  }

  update()
  const interval = window.setInterval(update, ROTATION_INTERVAL_MS)

  return () => {
    mounted = false
    window.clearInterval(interval)
  }
}
