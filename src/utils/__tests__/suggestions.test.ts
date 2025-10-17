import { describe, expect, it, vi } from 'vitest'
import { ROTATION_INTERVAL_MS, getSuggestedQuestions, subscribeToSuggestions } from '../../utils/suggestions'

describe('suggestions utilities', () => {
  it('returns three questions based on seed', () => {
    const suggestions = getSuggestedQuestions(1)
    expect(suggestions).toHaveLength(3)
    const next = getSuggestedQuestions(2)
    expect(next).not.toEqual(suggestions)
  })

  it('invokes callback immediately and on interval', () => {
    vi.useFakeTimers()
    const spy = vi.fn()

    const originalWindow = globalThis.window
    // Minimal window shim so subscribeToSuggestions uses interval path in Node tests
    globalThis.window = {
      setInterval: (...args: Parameters<typeof setInterval>) => setInterval(...args),
      clearInterval: (...args: Parameters<typeof clearInterval>) => clearInterval(...args),
    } as unknown as Window & typeof globalThis

    const unsubscribe = subscribeToSuggestions(spy)

    expect(spy).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(ROTATION_INTERVAL_MS)
    vi.runOnlyPendingTimers()
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2)

    unsubscribe()
    globalThis.window = originalWindow
    vi.useRealTimers()
  })
})
