import { useState, useCallback, useRef } from 'react'
import api from '../api'
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
  const { sessionId, simplified } = useSession()
  const { lang } = useLanguage()

  // Keep latest lang/session without re-creating sendMessage on every change.
  const ctxRef = useRef({ sessionId, simplified, lang })
  ctxRef.current = { sessionId, simplified, lang }

  const clearMessages = useCallback(() => setMessages([]), [])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || '').trim()
      if (!trimmed) return

      const { sessionId, simplified, lang } = ctxRef.current

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
        const res = await api.sendMessage(sessionId, trimmed, lang, simplified)
        devLog('[chat] response received', { safe: res.safe, fallback: res.fallback })

        const isFallback = res.fallback === true || res.safe === false
        const assistantMsg = {
          id: makeId(),
          role: 'assistant',
          text: isFallback
            ? res.fallback_message || res.response || ''
            : res.response || '',
          isFallback,
          referral: isFallback ? res.referral || null : null,
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch (err) {
        // Offline / network error — surface to the page so it can show the banner.
        if (err && err.offline) {
          onOffline?.(err)
        } else {
          devLog('[chat] error', err)
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
