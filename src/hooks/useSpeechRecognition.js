import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Speech-to-text via the browser Web Speech API (SpeechRecognition).
 *
 * This is ADDITIVE, optional voice INPUT that sits alongside typing — it never
 * replaces the text field and never auto-sends. Recognised text is handed to
 * `onResult` so the caller can drop it into the input for the user to review
 * and edit.
 *
 * English-only by design. The Web Speech API has no reliable Kinyarwanda (rw)
 * language pack — `rw-RW` either errors or silently mistranscribes — so callers
 * must NOT offer browser voice input for rw (see InputBar's gating). A
 * Kinyarwanda-capable path would need a backend ASR endpoint (Whisper /
 * Mbaza NLP) on the accessibility-service, not this hook.
 *
 * Exposes: { supported, listening, error, start, stop, clearError }
 *   - supported: the browser exposes SpeechRecognition at all.
 *   - error: null | 'permission' | 'no-speech' | 'unsupported-lang' | 'generic'
 */
export function useSpeechRecognition({ lang = 'en', onResult } = {}) {
  const Recognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : undefined
  const supported = Boolean(Recognition)

  const [listening, setListening] = useState(false)
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)
  // Keep the latest callback without re-creating start() on every render.
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult

  const stop = useCallback(() => {
    const rec = recognitionRef.current
    if (rec) {
      try {
        rec.stop()
      } catch {
        /* ignore — already stopped */
      }
    }
  }, [])

  const start = useCallback(() => {
    if (!supported) return
    setError(null)
    // A fresh instance each time: Chrome's recognition is effectively single-use
    // per utterance, and re-using one after `end` is unreliable.
    const rec = new Recognition()
    recognitionRef.current = rec
    rec.lang = lang === 'rw' ? 'rw-RW' : 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.continuous = false

    rec.onresult = (event) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i]
        if (res.isFinal) finalText += res[0].transcript
      }
      finalText = finalText.trim()
      if (finalText && onResultRef.current) onResultRef.current(finalText)
    }
    rec.onerror = (event) => {
      const code = event?.error
      if (code === 'not-allowed' || code === 'service-not-allowed') setError('permission')
      else if (code === 'no-speech') setError('no-speech')
      else if (code === 'language-not-supported') setError('unsupported-lang')
      else if (code === 'aborted') {
        /* user- or unmount-initiated stop — not a real error */
      } else setError('generic')
      setListening(false)
    }
    rec.onend = () => setListening(false)

    try {
      rec.start()
      setListening(true)
    } catch {
      // e.g. start() called while already started.
      setListening(false)
      setError('generic')
    }
  }, [supported, lang, Recognition])

  // Tear down any live recognition when the component unmounts.
  useEffect(
    () => () => {
      const rec = recognitionRef.current
      if (rec) {
        rec.onresult = null
        rec.onerror = null
        rec.onend = null
        try {
          rec.abort()
        } catch {
          /* ignore */
        }
      }
    },
    [],
  )

  const clearError = useCallback(() => setError(null), [])

  return { supported, listening, error, start, stop, clearError }
}

export default useSpeechRecognition
