import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { act } from '@testing-library/react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import InputBar from '../components/Chat/InputBar'
import en from '../i18n/en.json'
import rw from '../i18n/rw.json'

// ── Mock the Web Speech API (jsdom has no SpeechRecognition) ─────────────────
let instances = []
class MockSpeechRecognition {
  constructor() {
    this.lang = ''
    this.interimResults = false
    this.continuous = false
    this.maxAlternatives = 1
    instances.push(this)
  }
  start() {
    this._started = true
  }
  stop() {
    this.onend && this.onend()
  }
  abort() {}
  // Test helpers to drive recognition callbacks.
  emitResult(transcript) {
    this.onresult &&
      this.onresult({
        resultIndex: 0,
        results: [{ 0: { transcript }, isFinal: true, length: 1 }],
      })
    this.onend && this.onend()
  }
  emitError(code) {
    this.onerror && this.onerror({ error: code })
  }
}

function liveRegion() {
  return document.querySelector('[role="status"][aria-live="polite"]')
}

beforeEach(() => {
  instances = []
  window.SpeechRecognition = MockSpeechRecognition
})

afterEach(() => {
  delete window.SpeechRecognition
  delete window.webkitSpeechRecognition
  localStorage.clear()
})

describe('Voice input (English)', () => {
  it('shows an accessible microphone button and has no axe violations', async () => {
    const { container } = renderWithProviders(<InputBar onSend={() => {}} disabled={false} />)
    const mic = screen.getByRole('button', { name: en.voice_start })
    expect(mic).toBeInTheDocument()
    expect(mic).toHaveAttribute('type', 'button')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('is keyboard reachable and toggles listening, announcing it to screen readers', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<InputBar onSend={() => {}} disabled={false} />)

    // Tab order: textarea -> mic -> send. The mic is reachable by keyboard.
    await user.tab()
    expect(screen.getByRole('textbox')).toHaveFocus()
    await user.tab()
    const mic = screen.getByRole('button', { name: en.voice_start })
    expect(mic).toHaveFocus()

    // Activate with the keyboard.
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: en.voice_stop })).toBeInTheDocument()
    expect(liveRegion()?.textContent).toBe(en.voice_listening)

    // Listening state must still be accessible.
    expect(await axe(container)).toHaveNoViolations()
  })

  it('populates the input with the transcript and does NOT auto-send', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    renderWithProviders(<InputBar onSend={onSend} disabled={false} />)

    await user.click(screen.getByRole('button', { name: en.voice_start }))
    act(() => instances[0].emitResult('How do I stay safe'))

    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('How do I stay safe'))
    // Crucially: transcription never sends on its own — the user reviews first.
    expect(onSend).not.toHaveBeenCalled()
  })

  it('appends the transcript to text the user already typed', async () => {
    const user = userEvent.setup()
    renderWithProviders(<InputBar onSend={() => {}} disabled={false} />)

    const textbox = screen.getByRole('textbox')
    await user.type(textbox, 'I want to ask')
    await user.click(screen.getByRole('button', { name: en.voice_start }))
    act(() => instances[0].emitResult('about contraception'))

    await waitFor(() => expect(textbox).toHaveValue('I want to ask about contraception'))
  })

  it('shows a clear message when the microphone permission is denied', async () => {
    const user = userEvent.setup()
    renderWithProviders(<InputBar onSend={() => {}} disabled={false} />)

    await user.click(screen.getByRole('button', { name: en.voice_start }))
    act(() => instances[0].emitError('not-allowed'))

    await waitFor(() => expect(liveRegion()?.textContent).toBe(en.voice_error_permission))
  })

  it('shows a clear message when no speech is detected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<InputBar onSend={() => {}} disabled={false} />)

    await user.click(screen.getByRole('button', { name: en.voice_start }))
    act(() => instances[0].emitError('no-speech'))

    await waitFor(() => expect(liveRegion()?.textContent).toBe(en.voice_error_no_speech))
  })
})

describe('Voice input (Kinyarwanda)', () => {
  beforeEach(() => {
    localStorage.setItem('srh_lang', 'rw')
  })

  it('shows the mic disabled with an honest label, and explains on activation', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<InputBar onSend={() => {}} disabled={false} />)

    const mic = screen.getByTestId('voice-mic')
    expect(mic).toHaveAttribute('aria-disabled', 'true')
    expect(mic).toHaveAttribute('aria-label', rw.voice_unavailable_rw_label)

    // Tapping it must never be a silent no-op — it explains why.
    await user.click(mic)
    expect(liveRegion()?.textContent).toBe(rw.voice_unavailable_rw)

    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Voice input (browser without SpeechRecognition)', () => {
  it('hides the mic entirely when the API is unavailable, leaving typing intact', () => {
    delete window.SpeechRecognition
    renderWithProviders(<InputBar onSend={() => {}} disabled={false} />)
    expect(screen.queryByTestId('voice-mic')).not.toBeInTheDocument()
    // Typing path is unaffected.
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: en.chat_send })).toBeInTheDocument()
  })
})
