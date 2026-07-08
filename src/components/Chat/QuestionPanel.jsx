import { useState } from 'react'
import { QUESTION_CATEGORIES } from '../../data/predefinedQuestions'
import { useTTS } from '../../hooks/useTTS'

/*
  Small 16x16 category icons. They use `currentColor` so they inherit each
  pill's text colour automatically (teal when unselected, white when selected).
  Decorative — aria-hidden.
*/
const CATEGORY_ICONS = {
  // shield with a small plus inside
  contraception: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" strokeLinejoin="round" />
      <path d="M12 9v6M9 12h6" strokeLinecap="round" />
    </svg>
  ),
  // medical circle with a cross/plus
  sti_hiv: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  ),
  // stick figure: circle head + line body
  puberty_body: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="6" r="3" />
      <path d="M12 9v8M8 13h8M9 21l3-4 3 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // heart outline
  pregnancy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" strokeLinejoin="round" />
    </svg>
  ),
  // two overlapping circles (mutual consent / connection)
  gbv_consent: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </svg>
  ),
  // simple wheelchair symbol
  disability_srh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="4" r="2" />
      <path d="M9 6v6h6l2 6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="17" r="5" />
    </svg>
  ),
}

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
 * Props: onSelectQuestion(questionText) — sends the question to the chat,
 *        identical to a typed-and-submitted message.
 */
export default function QuestionPanel({ onSelectQuestion }) {
  const [open, setOpen] = useState(true) // open by default on first load
  const [activeId, setActiveId] = useState(QUESTION_CATEGORIES[0].id)
  const { speak } = useTTS()

  const activeCategory = QUESTION_CATEGORIES.find((c) => c.id === activeId) || QUESTION_CATEGORIES[0]

  // Card body pressed: send immediately.
  const ask = (question) => onSelectQuestion?.(question)

  // Speaker pressed: read the question aloud, then send (short delay is fine).
  const speakThenAsk = (question) => {
    speak(question, 'en')
    setTimeout(() => onSelectQuestion?.(question), 300)
  }

  return (
    <div>
      {/* Toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="question-panel-body"
        className="w-full py-3 px-4 flex items-center justify-between bg-[var(--clr-surface)] border-t border-[var(--clr-border)] text-[var(--clr-primary)] font-semibold text-sm hover:bg-[var(--clr-primary-light)] transition-colors"
      >
        Browse Questions
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

      {/* Collapsible body — smooth max-height transition */}
      <div
        id="question-panel-body"
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? 'max-h-[60vh]' : 'max-h-0'
        }`}
      >
        {/* Category tabs — horizontal scroll, no wrap */}
        <div
          role="tablist"
          aria-label="Question categories"
          className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide bg-[var(--clr-surface)] border-b border-[var(--clr-border)]"
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
                    ? 'bg-[var(--clr-primary)] text-white border-transparent'
                    : 'bg-[var(--clr-primary-light)] text-[var(--clr-text-primary)] border-[var(--clr-border)]'
                }`}
              >
                {CATEGORY_ICONS[cat.id]}
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Question grid for the active category — single column for big tap targets */}
        <div
          id="question-grid"
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory.id}`}
          className="grid grid-cols-1 gap-3 p-4 bg-[var(--clr-bg)] overflow-y-auto max-h-[44vh]"
        >
          {activeCategory.questions.map((q) => (
            <div
              key={q}
              className="bg-[var(--clr-surface)] rounded-2xl p-4 border border-[var(--clr-border)] flex items-start justify-between gap-3 transition-colors hover:border-[var(--clr-primary)]/50"
            >
              {/* Card body — press to ask immediately */}
              <button
                type="button"
                onClick={() => ask(q)}
                aria-label={`Ask: ${q}`}
                className="flex-1 text-left text-sm font-medium text-[var(--clr-text-primary)] leading-snug rounded-lg active:bg-[var(--clr-primary-light)] transition-colors"
              >
                {q}
              </button>

              {/* Speaker — read aloud, then ask. Sibling (not nested) button. */}
              <button
                type="button"
                onClick={() => speakThenAsk(q)}
                aria-label={`Read aloud and ask: ${q}`}
                className="w-9 h-9 rounded-xl bg-[var(--clr-primary-light)] flex items-center justify-center flex-shrink-0 text-[var(--clr-primary)] hover:bg-[var(--clr-accent-light)] active:scale-95 transition-[background-color,transform]"
              >
                <SpeakerIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
