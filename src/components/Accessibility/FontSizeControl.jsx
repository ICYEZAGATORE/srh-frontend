import { useSession } from '../../contexts/SessionContext'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Three text-size choices. Writes to SessionContext.fontSize; the App root div
 * maps the value to text-base / text-lg / text-xl.
 */
const OPTIONS = [
  { value: 'default', labelKey: 'settings_font_default' },
  { value: 'large', labelKey: 'settings_font_large' },
  { value: 'xl', labelKey: 'settings_font_xl' },
]

export default function FontSizeControl() {
  const { fontSize, setFontSize } = useSession()
  const { t } = useLanguage()

  return (
    <div>
      <p
        id="font-size-label"
        className="text-xs font-bold uppercase tracking-wider text-[var(--clr-text-secondary)] mb-3"
      >
        {t('settings_font_size')}
      </p>
      <div role="group" aria-labelledby="font-size-label" className="flex gap-2">
        {OPTIONS.map((opt) => {
          const active = fontSize === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFontSize(opt.value)}
              aria-pressed={active}
              aria-label={t(opt.labelKey)}
              className={`px-4 py-2 rounded-xl border font-semibold text-sm transition-colors ${
                active
                  ? 'bg-[var(--clr-primary)] text-white border-transparent'
                  : 'bg-[var(--clr-primary-light)] text-[var(--clr-primary)] border-[var(--clr-border)]'
              }`}
            >
              {t(opt.labelKey)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
