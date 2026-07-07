import { describe, it, expect, beforeEach } from 'vitest'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import Home from '../pages/Home'

// Home shows the consent gate until consent is recorded; pre-set it so these
// tests exercise the chat experience directly.
beforeEach(() => {
  sessionStorage.setItem('consent_given', 'true')
})

describe('Chat experience', () => {
  it('has no axe accessibility violations', async () => {
    const { container } = renderWithProviders(<Home />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('exposes a labelled chat input and an aria-live message region', () => {
    renderWithProviders(<Home />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    // The message list announces new messages politely.
    const live = document.querySelector('[aria-live="polite"]')
    expect(live).toBeTruthy()
  })

  it('lets a keyboard-only user type and submit the chat form with Enter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Home />)

    const input = screen.getByRole('textbox')
    input.focus()
    expect(input).toHaveFocus()

    await user.keyboard('How can I stay safe?{Enter}')

    // The user's message is rendered immediately (before the mocked AI reply).
    await waitFor(() =>
      expect(screen.getByText('How can I stay safe?')).toBeInTheDocument(),
    )
  })

  it('sends a predefined question when its card is activated (PWD flow)', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Home />)

    // Cards are labelled "Ask: <question>"; activating one sends that question.
    const [firstCard] = screen.getAllByRole('button', { name: /^Ask: / })
    const questionText = firstCard.textContent
    await user.click(firstCard)

    await waitFor(() => {
      // Text now appears both on the card and as a sent user message.
      expect(screen.getAllByText(questionText).length).toBeGreaterThan(1)
    })
  })
})
