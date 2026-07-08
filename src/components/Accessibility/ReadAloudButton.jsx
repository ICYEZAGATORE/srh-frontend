import { useTTS } from '../../hooks/useTTS'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * A visible, labelled "read this content aloud" control for STATIC page content
 * (landing page, info sections, error/empty states) — not tied to a backend
 * response. It reads arbitrary client-side text via useTTS, which uses the
 * accessibility microservice when configured and otherwise falls back to the
 * browser Web Speech API. This is what makes read-aloud available on every
 * page, including pages with no chat answer to read (item 1 requirement).
 *
 * Props:
 *   text      — string OR () => string. A function is resolved at click time so
 *               the latest translated copy is read.
 *   lang      — 'en' | 'rw' (defaults to the active UI language).
 *   variant   — 'solid' (default) | 'ghost'
 *   className — extra classes for layout.
 */
export default function ReadAloudButton({ text, lang, variant = 'solid', className = '' }) {
  const { speak, stop, isSpeaking, supported } = useTTS()
  const { t, lang: uiLang } = useLanguage()

  // If neither the microservice nor Web Speech can produce audio, render nothing
  // rather than a dead control.
  if (!supported) return null

  const readLang = lang || uiLang
  const label = isSpeaking ? t('read_page_stop') : t('read_page_aloud')

  const handleClick = () => {
    if (isSpeaking) {
      stop()
      return
    }
    const resolved = typeof text === 'function' ? text() : text
    if (resolved && resolved.trim()) speak(resolved, readLang)
  }

  const base =
    'inline-flex items-center gap-2 rounded-full font-ui font-semibold text-sm px-4 py-2.5 min-h-[44px] transition-colors active:scale-[0.98]'
  const styles =
    variant === 'ghost'
      ? 'bg-transparent text-[var(--clr-primary)] border-2 border-[var(--clr-primary)] hover:bg-[var(--clr-primary-light)]'
      : isSpeaking
        ? 'bg-[var(--clr-primary)] text-[var(--clr-on-primary)] hover:bg-[var(--clr-primary-strong)]'
        : 'bg-[var(--clr-primary-light)] text-[var(--clr-primary)] hover:bg-[var(--clr-accent-light)]'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isSpeaking}
      className={`${base} ${styles} ${className}`}
    >
      {isSpeaking ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5L6 9H2V15H6L11 19V5Z" />
          <path d="M15.54 8.46A5 5 0 0 1 15.54 15.54" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
      <span>{label}</span>
    </button>
  )
}
