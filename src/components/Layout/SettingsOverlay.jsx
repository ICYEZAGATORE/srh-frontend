import { useEffect, useRef } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSession } from '../../contexts/SessionContext'
import FontSizeControl from '../Accessibility/FontSizeControl'
import ContrastToggle from '../Accessibility/ContrastToggle'

/**
 * Accessibility settings overlay (bottom-sheet modal dialog). Contains
 * FontSizeControl, ContrastToggle and the simplified-language toggle. Fully
 * keyboard operable: Escape closes, focus moves into the dialog on open.
 */
export default function SettingsOverlay({ open, onClose }) {
  const { t } = useLanguage()
  const { simplified, setSimplified } = useSession()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-[var(--clr-text-primary)]/40 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('settings_title')}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-[var(--clr-surface)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--clr-text-primary)]">{t('settings_title')}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('settings_close')}
            className="w-10 h-10 rounded-xl text-[var(--clr-text-secondary)] hover:bg-[var(--clr-primary-light)] flex items-center justify-center transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <FontSizeControl />
        <ContrastToggle />

        {/* Simplified language toggle */}
        <div>
          <p
            id="simplified-label"
            className="text-xs font-bold uppercase tracking-wider text-[var(--clr-text-secondary)] mb-3"
          >
            {t('settings_simplified')}
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={simplified}
            aria-labelledby="simplified-label"
            onClick={() => setSimplified(!simplified)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              simplified ? 'bg-[var(--clr-primary)]' : 'bg-[var(--clr-border)]'
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                simplified ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
