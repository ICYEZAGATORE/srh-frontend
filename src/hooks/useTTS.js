import { useState, useCallback, useEffect, useRef } from 'react'
import { isConfigured as accessibilityConfigured, synthesizeSpeech } from '../api/accessibilityClient'

/**
 * Text-to-speech.
 *
 * Primary path: the independent Accessibility Services microservice
 * (Coqui/Mozilla TTS) via /v1/tts — used when VITE_ACCESSIBILITY_API_URL is set.
 * Fallback path: the browser Web Speech API — used when the service is not
 * configured, is unreachable, or has no model loaded (503). The app therefore
 * always has audio.
 *
 * Exposes: speak(text, lang), stop(), isSpeaking, supported
 */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const webSpeechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  // The button should show if EITHER path can produce audio.
  const supported = webSpeechSupported || accessibilityConfigured()

  const voicesRef = useRef([])
  const audioRef = useRef(null) // HTMLAudioElement for the service path

  // Voices load asynchronously in most browsers.
  useEffect(() => {
    if (!webSpeechSupported) return
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
  }, [webSpeechSupported])

  const pickVoice = useCallback((lang) => {
    const voices = voicesRef.current || []
    if (voices.length === 0) return null
    const wanted = lang === 'rw' ? ['rw', 'rw-RW'] : ['en', 'en-US', 'en-GB']
    const exact = voices.find((v) => wanted.some((w) => v.lang?.toLowerCase().startsWith(w.toLowerCase())))
    // For Kinyarwanda a matching voice rarely exists — fall back to any voice.
    return exact || (lang === 'rw' ? voices[0] : null)
  }, [])

  const stop = useCallback(() => {
    if (webSpeechSupported) {
      try {
        window.speechSynthesis.cancel()
      } catch {
        /* ignore */
      }
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src)
      } catch {
        /* ignore */
      }
      audioRef.current = null
    }
    setIsSpeaking(false)
  }, [webSpeechSupported])

  const speakWithWebSpeech = useCallback(
    (text, lang) => {
      if (!webSpeechSupported) {
        setIsSpeaking(false)
        return
      }
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
    [webSpeechSupported, pickVoice],
  )

  const speak = useCallback(
    async (text, lang = 'en') => {
      if (!text) return
      stop()
      setIsSpeaking(true)

      // Try the real TTS microservice first, if configured.
      if (accessibilityConfigured()) {
        try {
          const blob = await synthesizeSpeech(text, lang)
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audioRef.current = audio
          audio.onended = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            setIsSpeaking(false)
          }
          audio.onerror = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            speakWithWebSpeech(text, lang) // fall back on playback error
          }
          await audio.play()
          return
        } catch {
          // Service unconfigured/unreachable/503 → fall back to Web Speech.
        }
      }

      speakWithWebSpeech(text, lang)
    },
    [stop, speakWithWebSpeech],
  )

  // Stop speech if the component using the hook unmounts.
  useEffect(() => stop, [stop])

  return { speak, stop, isSpeaking, supported }
}

export default useTTS
