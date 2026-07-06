import { useSession } from '../../contexts/SessionContext'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Toggles high-contrast mode. The actual `.high-contrast` class is applied to
 * the app root by App.jsx based on SessionContext.highContrast, and the value
 * persists across reloads via localStorage.
 */
export default function ContrastToggle() {
  const { highContrast, setHighContrast } = useSession()
  const { t } = useLanguage()

  return (
    <div>
      <p
        id="contrast-label"
        className="text-xs font-bold uppercase tracking-wider text-[var(--clr-text-secondary)] mb-3"
      >
        {t('settings_contrast')}
      </p>
      <button
        type="button"
        role="switch"
        aria-checked={highContrast}
        aria-labelledby="contrast-label"
        onClick={() => setHighContrast(!highContrast)}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          highContrast ? 'bg-[var(--clr-primary)]' : 'bg-[var(--clr-border)]'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
            highContrast ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
