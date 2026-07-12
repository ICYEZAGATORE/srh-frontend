import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { LanguageProvider } from '../contexts/LanguageContext'
import { SessionProvider } from '../contexts/SessionContext'
import en from '../i18n/en.json'
import useChat from '../hooks/useChat'

// Mock the API layer so we can drive the session + failure paths deterministically.
// (SessionProvider and useChat both import this default export.)
const startSession = vi.fn()
const sendMessage = vi.fn()
vi.mock('../api', () => ({
  default: {
    startSession: (...a) => startSession(...a),
    sendMessage: (...a) => sendMessage(...a),
    checkHealth: async () => ({ status: 'ok' }),
  },
}))

function wrapper({ children }) {
  return (
    <LanguageProvider>
      <SessionProvider>{children}</SessionProvider>
    </LanguageProvider>
  )
}

beforeEach(() => {
  startSession.mockReset()
  sendMessage.mockReset()
})

describe('useChat — session + failure handling (regression for silent no-answer bug)', () => {
  it('lazily starts a session when none exists, then sends with that session id', async () => {
    // The consent gate can admit the user with no session (e.g. cold-start
    // failure). Sending must (re)start a session rather than post session_id:null.
    startSession.mockResolvedValue({ session_id: 'sess-123' })
    sendMessage.mockResolvedValue({
      response: 'A real answer.',
      safe: true,
      fallback: false,
    })

    const { result } = renderHook(() => useChat(), { wrapper })

    await act(async () => {
      await result.current.sendMessage('What is contraception?')
    })

    expect(startSession).toHaveBeenCalledTimes(1)
    // The chat request must carry the freshly-obtained session id, not null.
    expect(sendMessage).toHaveBeenCalledWith('sess-123', 'What is contraception?', 'en', false)

    const assistant = result.current.messages.find((m) => m.role === 'assistant')
    expect(assistant?.text).toBe('A real answer.')
  })

  it('surfaces an honest error message when the request fails with a non-offline error', async () => {
    // A 422 (e.g. rejected session_id) is NOT an OfflineError. Previously this
    // was swallowed by a prod-noop devLog, leaving the user with no answer and
    // no error. It must now render a visible, non-technical error message.
    startSession.mockResolvedValue({ session_id: 'sess-123' })
    sendMessage.mockRejectedValue(new Error('Request failed: 422'))

    const { result } = renderHook(() => useChat(), { wrapper })

    await act(async () => {
      await result.current.sendMessage('hello')
    })

    await waitFor(() => {
      const assistant = result.current.messages.find((m) => m.role === 'assistant')
      expect(assistant?.text).toBe(en.chat_error)
    })
    // Loading state must not get stuck on after a failure.
    expect(result.current.isLoading).toBe(false)
  })

  it('routes offline errors to onOffline (banner) instead of an inline error bubble', async () => {
    const offlineErr = Object.assign(new Error('offline'), { offline: true })
    startSession.mockResolvedValue({ session_id: 'sess-123' })
    sendMessage.mockRejectedValue(offlineErr)
    const onOffline = vi.fn()

    const { result } = renderHook(() => useChat({ onOffline }), { wrapper })

    await act(async () => {
      await result.current.sendMessage('hello')
    })

    expect(onOffline).toHaveBeenCalledWith(offlineErr)
    // No inline assistant error bubble in the offline case — the banner covers it.
    expect(result.current.messages.some((m) => m.role === 'assistant')).toBe(false)
  })
})
