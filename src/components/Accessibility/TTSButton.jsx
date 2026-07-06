import { useTTS } from '../../hooks/useTTS'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Play/stop button for reading an assistant answer aloud.
 * Uses the Web Speech API via useTTS; if TTS is unavailable the button is hidden.
 * Props: text (string), lang (string)
 */
export default function TTSButton({ text, lang }) {
  const { speak, stop, isSpeaking, supported } = useTTS()
  const { t } = useLanguage()

  if (!supported) return null

  const playing = isSpeaking
  const label = playing ? t('tts_stop') : t('tts_play')

  return (
    <button
      type="button"
      onClick={() => (playing ? stop() : speak(text, lang))}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
        playing
          ? 'bg-[var(--clr-primary)] text-white'
          : 'bg-[var(--clr-primary-light)] text-[var(--clr-primary)]'
      }`}
    >
      {playing ? (
        // Stop icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        // Speaker icon (cone + sound wave)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" />
          <path d="M15.54 8.46A5 5 0 0 1 15.54 15.54" />
        </svg>
      )}
    </button>
  )
}
