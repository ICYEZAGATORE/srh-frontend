import { useState } from 'react'
import { QUESTION_CATEGORIES } from '../../data/predefinedQuestions'
import { useTTS } from '../../hooks/useTTS'
import { useLanguage } from '../../contexts/LanguageContext'

/*
  Small 16x16 category icons. They use `currentColor` so they inherit the badge
  colour. Decorative — aria-hidden.
*/
const CATEGORY_ICONS = {
  contraception: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" strokeLinejoin="round" />
      <path d="M12 9v6M9 12h6" strokeLinecap="round" />
    </svg>
  ),
  sti_hiv: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  ),
  puberty_body: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="6" r="3" />
      <path d="M12 9v8M8 13h8M9 21l3-4 3 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pregnancy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" strokeLinejoin="round" />
    </svg>
  ),
  gbv_consent: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </svg>
  ),
  disability_srh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="4" r="2" />
      <path d="M9 6v6h6l2 6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="17" r="5" />
    </svg>
  ),
}

/*
  A small rotation of soft, muted badge tints pulled from the existing palette's
  lighter stops (light fill + a matching darker — never black, never the raw
  accent at full saturation). Cycled per card so the list has a little visual
  life. The badge is decorative only; the question text is always the label.
*/
const BADGE_TINTS = [
  { bg: 'var(--clr-primary-light)', fg: 'var(--clr-primary)' },
  { bg: 'var(--clr-info-light)', fg: 'var(--clr-info)' },
  { bg: 'var(--clr-success-light)', fg: 'var(--clr-success)' },
  { bg: 'var(--clr-warning-light)', fg: 'var(--clr-warning)' },
  { bg: 'var(--clr-mint-light)', fg: 'var(--clr-text-secondary)' },
]

const SpeakerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" />
    <path d="M15.54 8.46A5 5 0 0 1 15.54 15.54" />
  </svg>
)

/**
 * Predefined question panel — an accessibility feature for users (especially
 * persons with disabilities) who cannot type easily. Large tappable question
 * cards, each with a "read aloud and ask" speaker button.
 *
 * Layout: on mobile it is the collapsible panel below the chat (unchanged). At
 * lg+ it is a complementary side column (~35%) to the right of the chat, with a
 * subtle background tone and a left divider. It never takes over the screen —
 * selecting a question just inserts it into the chat and the panel stays put.
 *
 * Props: onSelectQuestion(questionText) — sends the question to the chat,
 *        identical to a typed-and-submitted message.
 */
export default function QuestionPanel({ onSelectQuestion }) {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(true) // mobile: open by default; ignored at lg+
  const [activeId, setActiveId] = useState(QUESTION_CATEGORIES[0].id)
  const { speak } = useTTS()

  const activeCategory = QUESTION_CATEGORIES.find((c) => c.id === activeId) || QUESTION_CATEGORIES[0]

  // Localised label + question list for the active language (falls back to EN).
  const catLabel = (cat) => (lang === 'rw' && cat.label_rw ? cat.label_rw : cat.label)
  const activeQuestions =
    lang === 'rw' && activeCategory.questions_rw ? activeCategory.questions_rw : activeCategory.questions

  const ask = (question) => onSelectQuestion?.(question)

  const speakThenAsk = (question) => {
    speak(question, lang)
    setTimeout(() => onSelectQuestion?.(question), 300)
  }

  return (
    <aside
      aria-label={t('questions_title')}
      className="lg:w-[35%] lg:flex-none lg:h-full lg:min-h-0 lg:flex lg:flex-col lg:border-l lg:border-[var(--clr-border)] lg:bg-[var(--clr-mint-light)]"
    >
      {/* Mobile-only toggle — unchanged behaviour on narrow viewports. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="question-panel-body"
        className="lg:hidden w-full py-3 px-4 flex items-center justify-between bg-[var(--clr-surface)] border-t border-[var(--clr-border)] text-[var(--clr-primary)] font-semibold text-sm hover:bg-[var(--clr-primary-light)] transition-colors"
      >
        {t('questions_browse')}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          aria-hidden="true"
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Desktop-only header for the side panel. */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-3.5 border-b border-[var(--clr-border)] shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-[var(--clr-primary)]">
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
          <circle cx="12" cy="12" r="9" />
        </svg>
        <h2 className="font-display font-bold text-base text-[var(--clr-text-primary)]">{t('questions_title')}</h2>
      </div>

      {/* Body: mobile uses a max-height transition on `open`; at lg+ it is always
          visible and fills the column with the question list scrolling. */}
      <div
        id="question-panel-body"
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? 'max-h-[60vh]' : 'max-h-0'
        } lg:max-h-none lg:overflow-visible lg:flex-1 lg:min-h-0 lg:flex lg:flex-col`}
      >
        {/* Category tabs — horizontal scroll, no wrap */}
        <div
          role="tablist"
          aria-label={t('questions_categories')}
          className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide bg-[var(--clr-surface)] lg:bg-transparent border-b border-[var(--clr-border)] shrink-0"
        >
          {QUESTION_CATEGORIES.map((cat) => {
            const selected = cat.id === activeId
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={selected}
                aria-controls="question-grid"
                onClick={() => setActiveId(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 border ${
                  selected
                    ? 'bg-[var(--clr-primary)] text-[var(--clr-on-primary)] border-transparent'
                    : 'bg-[var(--clr-surface)] text-[var(--clr-text-primary)] border-[var(--clr-border)]'
                }`}
              >
                {CATEGORY_ICONS[cat.id]}
                {catLabel(cat)}
              </button>
            )
          })}
        </div>

        {/* Question list for the active category — single column, big tap
            targets, scrolls within the panel (never a full-screen takeover). */}
        <div
          id="question-grid"
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory.id}`}
          className="grid grid-cols-1 gap-3 p-4 overflow-y-auto max-h-[44vh] lg:max-h-none lg:flex-1 lg:min-h-0"
        >
          {activeQuestions.map((q, i) => {
            const tint = BADGE_TINTS[i % BADGE_TINTS.length]
            return (
              <div
                key={q}
                className="bg-[var(--clr-surface)] rounded-2xl p-3.5 border border-[var(--clr-border)] flex items-center gap-3 transition-colors hover:border-[var(--clr-primary)]/50"
              >
                {/* Small muted icon badge — decorative; text remains the label. */}
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tint.bg, color: tint.fg }}
                >
                  {CATEGORY_ICONS[activeCategory.id]}
                </span>

                {/* Card body — press to ask immediately */}
                <button
                  type="button"
                  onClick={() => ask(q)}
                  aria-label={`${t('q_ask')} ${q}`}
                  className="flex-1 text-left text-sm font-medium text-[var(--clr-text-primary)] leading-snug rounded-lg active:bg-[var(--clr-primary-light)] transition-colors"
                >
                  {q}
                </button>

                {/* Speaker — read aloud, then ask. Sibling (not nested) button. */}
                <button
                  type="button"
                  onClick={() => speakThenAsk(q)}
                  aria-label={`${t('q_read_ask')} ${q}`}
                  className="w-9 h-9 rounded-xl bg-[var(--clr-primary-light)] flex items-center justify-center flex-shrink-0 text-[var(--clr-primary)] hover:bg-[var(--clr-accent-light)] active:scale-95 transition-[background-color,transform]"
                >
                  <SpeakerIcon />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
