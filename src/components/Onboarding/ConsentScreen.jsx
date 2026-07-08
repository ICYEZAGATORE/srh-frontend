import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSession } from '../../contexts/SessionContext'
import Header from '../Layout/Header'
import ReadAloudButton from '../Accessibility/ReadAloudButton'

/**
 * Consent / onboarding gate shown before the chat.
 * Two checkboxes (age + anonymity) must both be checked before Continue enables.
 * On confirm: starts an anonymous session, records consent in sessionStorage,
 * and notifies the parent so the chat can be shown.
 *
 * The gating behaviour is unchanged; only the presentation was refreshed and
 * accessibility affordances (landmark, read-aloud, back link) were added.
 *
 * Props: onConsent() — called after a successful session start.
 */
export default function ConsentScreen({ onConsent }) {
  const { t } = useLanguage()
  const { startSession } = useSession()
  const [ageOk, setAgeOk] = useState(false)
  const [anonOk, setAnonOk] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const ready = ageOk && anonOk && !submitting

  async function handleContinue() {
    if (!ready) return
    setSubmitting(true)
    try {
      await startSession()
      sessionStorage.setItem('consent_given', 'true')
      onConsent?.()
    } catch {
      // Even if session start fails (backend down), let the user proceed — the
      // chat will surface the calm offline banner. Never block access to help.
      sessionStorage.setItem('consent_given', 'true')
      onConsent?.()
    } finally {
      setSubmitting(false)
    }
  }

  const readText = () =>
    [t('consent_title'), t('consent_body'), t('consent_age_confirm'), t('consent_anonymous_confirm')].join('. ')

  const checkboxRow = (checked, onChange, label) => (
    <label className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--clr-surface)] border border-[var(--clr-border)] mb-3 cursor-pointer transition-colors hover:border-[var(--clr-primary)]/50">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`mt-0.5 h-6 w-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--clr-accent)] ${
          checked ? 'bg-[var(--clr-primary)] border-[var(--clr-primary)]' : 'bg-[var(--clr-surface)] border-[var(--clr-border)]'
        }`}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" aria-hidden="true">
            <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="font-medium text-sm text-[var(--clr-text-primary)]">{label}</span>
    </label>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex items-center justify-center px-4 py-8 focus:outline-none"
      >
        <div className="w-full max-w-md">
          {/* Hero illustration — meaningful, so it is described (aria-label) and
              NOT aria-hidden. Two teenagers talking, one with a white cane. */}
          <svg
            viewBox="0 0 320 180"
            role="img"
            aria-label="Two young people talking openly about health"
            className="w-full max-w-[340px] mx-auto"
          >
            <path d="M0 128 Q160 104 320 128 L320 180 L0 180 Z" style={{ fill: 'var(--clr-primary-light)' }} />
            <rect x="70" y="112" width="48" height="56" rx="20" style={{ fill: 'var(--clr-accent)' }} />
            <circle cx="94" cy="92" r="22" fill="#6B3A2A" />
            <path d="M85 98 Q94 106 103 98" fill="none" stroke="#3A2017" strokeWidth="2.4" strokeLinecap="round" />
            <rect x="202" y="112" width="48" height="56" rx="20" style={{ fill: 'var(--clr-primary)' }} />
            <circle cx="226" cy="92" r="22" fill="#8B4E35" />
            <path d="M217 98 Q226 106 235 98" fill="none" stroke="#3A2017" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="252" y1="120" x2="270" y2="170" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="252" cy="120" r="3" fill="#FFFFFF" />
            <g>
              <path
                d="M128 18h64a14 14 0 0 1 14 14v18a14 14 0 0 1-14 14h-30l-12 12v-12h-22a14 14 0 0 1-14-14V32a14 14 0 0 1 14-14z"
                fill="#FFFFFF"
                stroke="var(--clr-primary)"
                strokeWidth="2.5"
              />
              <path d="M160 50c-5-6-15-4-15 4 0 6 9 11 15 16 6-5 15-10 15-16 0-8-10-10-15-4z" style={{ fill: 'var(--clr-accent)' }} />
            </g>
          </svg>

          <div className="mt-2">
            <h1 className="font-display font-bold text-2xl text-[var(--clr-text-primary)] text-center mb-2">
              Your health questions, answered safely.
            </h1>
            <p className="text-sm text-[var(--clr-text-secondary)] text-center mb-4">{t('consent_body')}</p>

            <div className="flex justify-center mb-6">
              <ReadAloudButton text={readText} variant="ghost" />
            </div>

            <fieldset>
              <legend className="sr-only">{t('consent_title')}</legend>
              {checkboxRow(ageOk, setAgeOk, t('consent_age_confirm'))}
              {checkboxRow(anonOk, setAnonOk, t('consent_anonymous_confirm'))}
            </fieldset>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!ready}
              aria-label={t('consent_confirm')}
              className="mt-3 w-full bg-[var(--clr-accent)] text-[var(--clr-on-accent)] font-display font-bold text-base px-6 py-4 rounded-2xl shadow-soft hover:bg-[var(--clr-accent-strong)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-[background-color,transform]"
            >
              {submitting ? (
                <span className="flex justify-center gap-1.5" aria-hidden="true">
                  <span className="dot-bounce w-2 h-2 rounded-full bg-[var(--clr-on-accent)]" style={{ animationDelay: '0ms' }} />
                  <span className="dot-bounce w-2 h-2 rounded-full bg-[var(--clr-on-accent)]" style={{ animationDelay: '150ms' }} />
                  <span className="dot-bounce w-2 h-2 rounded-full bg-[var(--clr-on-accent)]" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                t('consent_confirm')
              )}
            </button>

            <div className="mt-4 text-center">
              <Link to="/" className="font-ui text-sm font-semibold text-[var(--clr-primary)] underline">
                {t('chat_back_home')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
