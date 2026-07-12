import { useState, useCallback, useRef } from 'react'
import api from '../api'
import { simplifyText } from '../api/accessibilityClient'
import { useSession } from '../contexts/SessionContext'
import { useLanguage } from '../contexts/LanguageContext'

let nextId = 0
const makeId = () => `m${Date.now()}_${nextId++}`

// Sensitive health messages must never be logged in production.
const devLog = (...args) => {
  if (!import.meta.env.PROD) console.debug(...args)
}

/**
 * Manages the chat message list and the request lifecycle.
 * messages: array of { id, role, text, isFallback, referral }
 */
export function useChat({ onOffline } = {}) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { sessionId, simplified, startSession } = useSession()
  const { lang, t } = useLanguage()

  // Keep latest lang/session without re-creating sendMessage on every change.
  const ctxRef = useRef({ sessionId, simplified, lang, startSession, t })
  ctxRef.current = { sessionId, simplified, lang, startSession, t }

  const clearMessages = useCallback(() => setMessages([]), [])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || '').trim()
      if (!trimmed) return

      const { sessionId, simplified, lang, startSession, t } = ctxRef.current

      const userMsg = {
        id: makeId(),
        role: 'user',
        text: trimmed,
        isFallback: false,
        referral: null,
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      try {
        // Ensure a valid session before sending. The consent gate deliberately
        // lets users into the chat even when the initial session-start failed
        // (e.g. backend cold start), so `sessionId` may still be null here.
        // Sending null makes the backend reject the request with a 422, which
        // is NOT an OfflineError and would otherwise fail silently. Lazily
        // (re)start the session first; if that also fails it throws an
        // OfflineError and is handled as offline below.
        let sid = sessionId
        if (!sid) {
          sid = await startSession()
        }

        const res = await api.sendMessage(sid, trimmed, lang, simplified)
        devLog('[chat] response received', { safe: res.safe, fallback: res.fallback })

        const isFallback = res.fallback === true || res.safe === false
        let text = isFallback ? res.fallback_message || res.response || '' : res.response || ''

        // Simplified-language mode: when enabled, run safe answers through the
        // Accessibility Services /v1/simplify step. This is a no-op (returns the
        // original text) when the service is not configured, so behaviour is
        // unchanged in the mock/demo build. Fallback/referral text is left as-is.
        if (simplified && !isFallback && text) {
          text = await simplifyText(text, lang)
        }

        const assistantMsg = {
          id: makeId(),
          role: 'assistant',
          text,
          isFallback,
          referral: isFallback ? res.referral || null : null,
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch (err) {
        // Offline / network error — surface to the page so it can show the banner.
        if (err && err.offline) {
          onOffline?.(err)
        } else {
          // Any other failure (e.g. a 4xx such as a rejected session_id) must
          // NOT vanish: previously this only devLog'd, which is a no-op in
          // production, so the user saw the message send and then nothing at
          // all. Show an honest, non-technical error message instead.
          devLog('[chat] error', err)
          setMessages((prev) => [
            ...prev,
            {
              id: makeId(),
              role: 'assistant',
              text: t('chat_error'),
              isFallback: false,
              referral: null,
            },
          ])
        }
      } finally {
        setIsLoading(false)
      }
    },
    [onOffline],
  )

  return { messages, isLoading, sendMessage, clearMessages }
}

export default useChat
