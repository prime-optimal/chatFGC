import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatMessage } from '../ChatMessage'

describe('ChatMessage', () => {
  it('renders markdown tables correctly', () => {
    const content = `| Col A | Col B |
| --- | --- |
| 1 | 2 |
| 3 | 4 |`

    render(
      <ChatMessage
        message={{ id: '1', role: 'assistant', content }}
      />
    )

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    expect(table.querySelectorAll('tr')).toHaveLength(3)
  })
})
