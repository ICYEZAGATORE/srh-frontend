import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Layout/Header'
import ReadAloudButton from '../components/Accessibility/ReadAloudButton'
import { useLanguage } from '../contexts/LanguageContext'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Signature motif: a small chat bubble in which a real, first-person question
 * types itself in, cycling through a few examples. Personality here comes from
 * voice + type + motion — not colour. It is placed AFTER the primary action in
 * the DOM so a screen-reader user reaches the action first.
 *
 * Accessibility: the animation is decorative (aria-hidden). A visually hidden,
 * static list of the same questions is exposed to assistive tech instead, so
 * nothing depends on the animation. Under reduced-motion the caret stops and the
 * first question shows statically.
 */
function HeroBubble({ questions, label }) {
  const reduce = prefersReducedMotion()
  const [text, setText] = useState(reduce ? questions[0] : '')

  useEffect(() => {
    if (reduce) return
    let qi = 0
    let ci = 0
    let deleting = false
    let timer

    const tick = () => {
      const current = questions[qi]
      if (!deleting) {
        ci += 1
        setText(current.slice(0, ci))
        if (ci === current.length) {
          deleting = true
          timer = setTimeout(tick, 1600)
          return
        }
      } else {
        ci -= 1
        setText(current.slice(0, ci))
        if (ci === 0) {
          deleting = false
          qi = (qi + 1) % questions.length
        }
      }
      timer = setTimeout(tick, deleting ? 45 : 85)
    }
    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [questions, reduce])

  return (
    <div className="rounded-3xl bg-[var(--clr-surface)] border border-[var(--clr-border)] shadow-soft p-5 max-w-sm">
      <p className="sr-only">
        {label}: {questions.join('. ')}
      </p>
      <div aria-hidden="true">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-full bg-[var(--clr-primary-light)] flex items-center justify-center text-[var(--clr-primary)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <span className="font-ui text-xs font-semibold uppercase tracking-wider text-[var(--clr-text-secondary)]">
            {label}
          </span>
        </div>
        <div className="rounded-2xl rounded-tl-md bg-[var(--clr-primary-light)] px-4 py-3 min-h-[3.25rem] flex items-center">
          <span className="font-display text-lg sm:text-xl font-semibold text-[var(--clr-text-primary)] leading-snug">
            {text}
            <span className="type-caret ml-0.5 inline-block w-[3px] h-[1.1em] align-[-0.15em] bg-[var(--clr-accent)]" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const questions = useMemo(
    () => [t('landing_hero_q1'), t('landing_hero_q2'), t('landing_hero_q3')],
    [t],
  )

  const howSteps = [t('landing_how_1'), t('landing_how_2'), t('landing_how_3'), t('landing_how_4')]

  // Full readable text for the read-aloud control, in reading order (active
  // language, falling back to English via t()). Includes the collapsed content
  // so a listener hears everything without having to expand it manually.
  const pageText = () =>
    [
      t('landing_title'),
      t('landing_who'),
      t('landing_reassure'),
      t('landing_how_title'),
      ...howSteps,
      t('landing_lang_title'),
      t('landing_lang_body'),
      t('landing_access_title'),
      t('landing_access_body'),
      t('landing_private_title'),
      t('landing_private_body'),
      t('landing_safety_title'),
      t('landing_safety_body'),
    ].join('. ')

  const startBtn =
    'inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--clr-accent)] text-[var(--clr-on-accent)] font-display font-bold text-lg px-7 py-4 min-h-[56px] shadow-soft hover:bg-[var(--clr-accent-strong)] active:scale-[0.98] transition-[background-color,transform]'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section aria-labelledby="hero-title" className="mx-auto w-full max-w-2xl px-5 pt-12 pb-14 sm:pt-16">
          <div className="reveal-up">
            {/* What */}
            <h1
              id="hero-title"
              className="font-display font-extrabold text-[var(--clr-text-primary)] text-4xl sm:text-5xl leading-[1.1]"
            >
              {t('landing_title')}
            </h1>

            {/* Who */}
            <p className="mt-4 text-xl text-[var(--clr-text-secondary)] leading-relaxed">
              {t('landing_who')}
            </p>

            {/* One-sentence reassurance (confidentiality + emergency boundary) —
                paired with an icon so the meaning is not carried by colour. */}
            <p className="mt-5 flex items-start gap-2.5 text-base text-[var(--clr-text-primary)] leading-relaxed">
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
                className="mt-0.5 shrink-0 text-[var(--clr-primary)]"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <span>{t('landing_reassure')}</span>
            </p>

            {/* Primary action — the clear visual and reading-order focus. */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link to="/chat" className={startBtn}>
                {t('landing_cta_start')}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <ReadAloudButton text={pageText} variant="ghost" />
            </div>

            {/* Signature motif — after the action in reading order. */}
            <div className="mt-10">
              <HeroBubble questions={questions} label={t('landing_hero_typed_label')} />
            </div>

            {/* Everything else — collapsed by default, but present for everyone. */}
            <div className="mt-10 border-t border-[var(--clr-border)] pt-6">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="learn-more"
                className="w-full flex items-center justify-between gap-3 text-left font-display font-bold text-lg text-[var(--clr-text-primary)] rounded-xl px-1 py-1 hover:text-[var(--clr-primary)] transition-colors"
              >
                <span>{t('landing_learn_more')}</span>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div id="learn-more" hidden={!open} className="mt-6 grid gap-8">
                <section aria-labelledby="how-title">
                  <h2 id="how-title" className="font-display font-bold text-xl text-[var(--clr-text-primary)]">
                    {t('landing_how_title')}
                  </h2>
                  <ol className="mt-3 grid gap-3 list-none p-0 m-0">
                    {howSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="shrink-0 w-7 h-7 rounded-full border-2 border-[var(--clr-primary)] text-[var(--clr-primary)] font-display font-bold text-sm flex items-center justify-center"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <p className="text-base text-[var(--clr-text-primary)] leading-relaxed pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                </section>

                <section aria-labelledby="lang-title">
                  <h2 id="lang-title" className="font-display font-bold text-xl text-[var(--clr-text-primary)]">
                    {t('landing_lang_title')}
                  </h2>
                  <p className="mt-2 text-base text-[var(--clr-text-secondary)] leading-relaxed">
                    {t('landing_lang_body')}
                  </p>
                </section>

                <section aria-labelledby="access-title">
                  <h2 id="access-title" className="font-display font-bold text-xl text-[var(--clr-text-primary)]">
                    {t('landing_access_title')}
                  </h2>
                  <p className="mt-2 text-base text-[var(--clr-text-secondary)] leading-relaxed">
                    {t('landing_access_body')}
                  </p>
                </section>

                <section aria-labelledby="safe-title">
                  <h2 id="safe-title" className="font-display font-bold text-xl text-[var(--clr-text-primary)]">
                    {t('landing_private_title')}
                  </h2>
                  <p className="mt-2 text-base text-[var(--clr-text-secondary)] leading-relaxed">
                    {t('landing_private_body')}
                  </p>
                  <p className="mt-2 text-base text-[var(--clr-text-secondary)] leading-relaxed">
                    {t('landing_safety_body')}
                  </p>
                  <a
                    href={`tel:${t('health_hotline_number')}`}
                    className="mt-3 inline-flex items-center gap-2 font-display font-bold text-[var(--clr-primary)] underline"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {t('health_hotline_label')}: {t('health_hotline_number')}
                  </a>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
