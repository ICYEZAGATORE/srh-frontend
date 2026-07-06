import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Text-to-speech via the browser Web Speech API.
 * This is the client-side fallback; a backend TTS microservice (Kinyarwanda
 * voice) will replace/augment it later without changing this hook's interface.
 *
 * Exposes: speak(text, lang), stop(), isSpeaking
 */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  const voicesRef = useRef([])

  // Voices load asynchronously in most browsers.
  useEffect(() => {
    if (!supported) return
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => {
      try {
        window.speechSynthesis.onvoiceschanged = null
      } catch {
        /* ignore */
      }
    }
  }, [supported])

  const pickVoice = useCallback((lang) => {
    const voices = voicesRef.current || []
    if (voices.length === 0) return null
    // Prefer an exact rw/en match; otherwise the browser default voice is used.
    const wanted = lang === 'rw' ? ['rw', 'rw-RW'] : ['en', 'en-US', 'en-GB']
    const exact = voices.find((v) => wanted.some((w) => v.lang?.toLowerCase().startsWith(w.toLowerCase())))
    // For Kinyarwanda, a matching voice rarely exists — fall back to any voice
    // so the user still hears the answer read aloud.
    return exact || (lang === 'rw' ? voices[0] : null)
  }, [])

  const stop = useCallback(() => {
    if (!supported) return
    try {
      window.speechSynthesis.cancel()
    } catch {
      /* ignore */
    }
    setIsSpeaking(false)
  }, [supported])

  const speak = useCallback(
    (text, lang = 'en') => {
      if (!supported || !text) return
      // Cancel anything currently playing first.
      window.speechSynthesis.cancel()

      const utter = new window.SpeechSynthesisUtterance(text)
      utter.lang = lang === 'rw' ? 'rw-RW' : 'en-US'
      const voice = pickVoice(lang)
      if (voice) utter.voice = voice
      utter.rate = 0.95
      utter.onend = () => setIsSpeaking(false)
      utter.onerror = () => setIsSpeaking(false)

      setIsSpeaking(true)
      window.speechSynthesis.speak(utter)
    },
    [supported, pickVoice],
  )

  // Stop speech if the component using the hook unmounts.
  useEffect(() => stop, [stop])

  return { speak, stop, isSpeaking, supported }
}

export default useTTS
