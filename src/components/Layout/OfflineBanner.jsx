import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Sticky top banner shown when the backend is unreachable. Calm in tone — it
 * always shows the static health hotline so a vulnerable user can still get help
 * regardless of backend status. Announced assertively to screen readers.
 */
export default function OfflineBanner() {
  const { t } = useLanguage()

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-[var(--clr-accent)] text-[var(--clr-on-accent)] px-4 py-3 flex items-start gap-3"
    >
      {/* warning icon — circle with ! inside */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="shrink-0 mt-0.5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6" />
        <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
      <div className="text-sm">
        <p className="font-bold">{t('offline_banner')}</p>
        <p className="mt-0.5">
          {t('health_hotline_label')}:{' '}
          <a href={`tel:${t('health_hotline_number')}`} className="font-extrabold underline">
            {t('health_hotline_number')}
          </a>
        </p>
      </div>
    </div>
  )
}
