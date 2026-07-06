import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Calm, supportive card shown when the safety classifier flags a query.
 * Warm yellow — never red, never alarming. Below the message it shows a
 * referral to real-world help in a slightly more prominent style.
 *
 * Props: fallbackMessage (string), referral ({ text } | null)
 */
export default function FallbackCard({ fallbackMessage, referral }) {
  const { t } = useLanguage()

  return (
    <div className="bg-[var(--clr-yellow-light)] border border-[var(--clr-yellow)] rounded-2xl p-5">
      {/* Calming "support" motif — open hand with a small heart above it. Decorative. */}
      <svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true" focusable="false" className="mx-auto mb-3">
        {/* heart above the hand */}
        <path
          d="M40 12c-3-6-13-5-13 3 0 6 7 10 13 14 6-4 13-8 13-14 0-8-10-9-13-3z"
          style={{ fill: 'var(--clr-primary)' }}
        />
        {/* five finger stubs fanning out */}
        <rect x="27" y="34" width="5" height="16" rx="2.5" style={{ fill: 'var(--clr-accent)' }} />
        <rect x="34" y="30" width="5" height="20" rx="2.5" style={{ fill: 'var(--clr-accent)' }} />
        <rect x="41" y="30" width="5" height="20" rx="2.5" style={{ fill: 'var(--clr-accent)' }} />
        <rect x="48" y="34" width="5" height="16" rx="2.5" style={{ fill: 'var(--clr-accent)' }} />
        <rect x="54" y="40" width="5" height="12" rx="2.5" style={{ fill: 'var(--clr-accent)' }} transform="rotate(28 56 46)" />
        {/* palm */}
        <rect x="26" y="48" width="33" height="20" rx="10" style={{ fill: 'var(--clr-accent)' }} />
      </svg>

      <p className="text-[var(--clr-text-primary)] font-medium text-sm leading-relaxed mb-3">
        {fallbackMessage}
      </p>

      {referral?.text && (
        <div className="bg-[var(--clr-surface)] rounded-xl p-3 flex items-center gap-3">
          {/* phone icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ stroke: 'var(--clr-primary)' }}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="sr-only">{t('chat_referral_label')}: </span>
          <span className="font-semibold text-[var(--clr-primary)] text-sm">{referral.text}</span>
        </div>
      )}
    </div>
  )
}
