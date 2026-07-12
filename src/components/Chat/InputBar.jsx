import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

/**
 * Message composer: text input + optional voice input + send button. Enter
 * submits. Disabled while a response is loading. Input and buttons carry
 * aria-labels.
 *
 * Voice input is ADDITIVE — typing is unchanged. A microphone button sits in the
 * same input row and populates the text field for review/edit (never auto-sends).
 * Browser speech recognition is English-only, so in Kinyarwanda the mic is shown
 * disabled with an honest explanation rather than silently mistranscribing.
 *
 * Props: onSend(text), disabled (bool)
 */
export default function InputBar({ onSend, disabled }) {
  const { t, lang } = useLanguage()
  const [value, setValue] = useState('')
  // Transient explanation for the disabled-in-Kinyarwanda case (announced + shown).
  const [notice, setNotice] = useState('')
  const textareaRef = useRef(null)

  const voice = useSpeechRecognition({
    lang: 'en', // browser recognition is only reliable for English
    onResult: (text) => {
      // Populate the field for the user to review/edit — do NOT auto-send.
      setValue((prev) => (prev.trim() ? `${prev.trimEnd()} ${text}` : text))
      // Return focus so the user can edit before sending.
      requestAnimationFrame(() => textareaRef.current?.focus())
    },
  })

  // Voice recognition is English-only; stop if the user switches to Kinyarwanda.
  const { listening: voiceListening, stop: voiceStop } = voice
  useEffect(() => {
    if (lang !== 'en' && voiceListening) voiceStop()
  }, [lang, voiceListening, voiceStop])

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function handleChange(e) {
    setValue(e.target.value)
    // Clear any stale voice notice/error once the user edits the field.
    if (notice) setNotice('')
    if (voice.error) voice.clearError()
  }

  const micActive = lang === 'en' // browser voice available (English only)

  function toggleVoice() {
    if (!micActive) {
      // Honest, explicit feedback — never a silent no-op.
      setNotice(t('voice_unavailable_rw'))
      return
    }
    if (voice.listening) voice.stop()
    else voice.start()
  }

  // Single aria-live message: listening state > recognition error > notice.
  let liveMessage = ''
  if (voice.listening) liveMessage = t('voice_listening')
  else if (voice.error === 'permission') liveMessage = t('voice_error_permission')
  else if (voice.error === 'no-speech') liveMessage = t('voice_error_no_speech')
  else if (voice.error) liveMessage = t('voice_error_generic')
  else if (notice) liveMessage = notice

  const micLabel = !micActive
    ? t('voice_unavailable_rw_label')
    : voice.listening
      ? t('voice_stop')
      : t('voice_start')

  return (
    <div className="bg-[var(--clr-surface)] border-t border-[var(--clr-border)]">
      <form
        className="px-3 py-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          {t('chat_placeholder')}
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('chat_placeholder')}
          aria-label={t('chat_placeholder')}
          className="flex-1 bg-[var(--clr-surface)] border border-[var(--clr-border)] rounded-2xl px-4 py-3 text-sm text-[var(--clr-text-primary)] placeholder:text-[var(--clr-text-secondary)] focus:outline-none focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/25 hover:border-[var(--clr-primary)]/40 resize-none min-h-[48px] max-h-[120px] disabled:opacity-60 transition-colors"
        />

        {/* Voice input (microphone). Hidden entirely when the browser has no
            SpeechRecognition API — there is no capability to offer. In English
            it's an active toggle; in Kinyarwanda it's shown disabled with an
            honest label rather than mistranscribing. */}
        {voice.supported && (
          <button
            type="button"
            data-testid="voice-mic"
            onClick={toggleVoice}
            disabled={disabled}
            aria-disabled={!micActive}
            aria-pressed={micActive ? voice.listening : undefined}
            aria-label={micLabel}
            title={micLabel}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--clr-primary)]/25 disabled:opacity-40 disabled:cursor-not-allowed ${
              !micActive
                ? 'bg-[var(--clr-surface)] border border-[var(--clr-border)] text-[var(--clr-text-secondary)] opacity-60 cursor-not-allowed'
                : voice.listening
                  ? 'bg-[var(--clr-primary)] text-[var(--clr-on-primary)] mic-listening'
                  : 'bg-[var(--clr-surface)] border border-[var(--clr-border)] text-[var(--clr-primary)] hover:border-[var(--clr-primary)]/60'
            }`}
          >
            {voice.listening ? (
              // Stop icon while listening (paired with the pulsing ring + colour).
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              // Microphone icon.
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            )}
          </button>
        )}

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label={t('chat_send')}
          className="bg-[var(--clr-accent)] text-[var(--clr-on-accent)] w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft hover:bg-[var(--clr-accent-strong)] active:scale-95 transition-[background-color,transform] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M2 12L22 2L12 22L10 13L2 12Z" />
          </svg>
        </button>
      </form>

      {/* Voice status/error announcements — always in the DOM so screen readers
          announce changes; visually hidden until there is something to say, so
          the idle input row is unchanged. */}
      <p
        role="status"
        aria-live="polite"
        className={liveMessage ? 'px-4 pb-2 -mt-1 text-xs text-[var(--clr-text-secondary)]' : 'sr-only'}
      >
        {liveMessage}
      </p>
    </div>
  )
}
