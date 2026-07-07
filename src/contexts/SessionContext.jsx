import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import api from '../api'

const SessionContext = createContext(null)

const HC_KEY = 'srh_high_contrast'
const FONT_KEY = 'srh_font_size'
const SIMPLE_KEY = 'srh_simplified'
const TTS_KEY = 'srh_tts_enabled'

function readBool(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : v === 'true'
  } catch {
    return fallback
  }
}

function readFontSize() {
  try {
    const v = localStorage.getItem(FONT_KEY)
    return v === 'large' || v === 'xl' ? v : 'default'
  } catch {
    return 'default'
  }
}

function persist(key, value) {
  try {
    localStorage.setItem(key, String(value))
  } catch {
    /* ignore unavailable storage */
  }
}

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null)

  // Accessibility preferences. High contrast must survive a reload, so it is
  // seeded from localStorage; the others are persisted too for consistency.
  const [fontSize, setFontSizeState] = useState(readFontSize)
  const [highContrast, setHighContrastState] = useState(() => readBool(HC_KEY, false))
  const [simplified, setSimplifiedState] = useState(() => readBool(SIMPLE_KEY, false))
  const [ttsEnabled, setTtsEnabledState] = useState(() => readBool(TTS_KEY, true))

  const startSession = useCallback(async () => {
    // POST /api/v1/session/start — returns { session_id }
    const data = await api.startSession()
    setSessionId(data.session_id)
    return data.session_id
  }, [])

  const setFontSize = useCallback((size) => {
    setFontSizeState(size)
    persist(FONT_KEY, size)
  }, [])

  const setHighContrast = useCallback((on) => {
    setHighContrastState(on)
    persist(HC_KEY, on)
  }, [])

  const setSimplified = useCallback((on) => {
    setSimplifiedState(on)
    persist(SIMPLE_KEY, on)
  }, [])

  const setTtsEnabled = useCallback((on) => {
    setTtsEnabledState(on)
    persist(TTS_KEY, on)
  }, [])

  const value = useMemo(
    () => ({
      sessionId,
      startSession,
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast,
      simplified,
      setSimplified,
      ttsEnabled,
      setTtsEnabled,
    }),
    [
      sessionId,
      startSession,
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast,
      simplified,
      setSimplified,
      ttsEnabled,
      setTtsEnabled,
    ],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}

export default SessionContext
