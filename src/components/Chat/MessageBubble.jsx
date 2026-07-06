import TTSButton from '../Accessibility/TTSButton'
import FallbackCard from './FallbackCard'

/**
 * A single chat message. Rendered inside a flex-col list item.
 * Props: role ("user"|"assistant"), text, isFallback (bool), referral (object), lang
 * - user: right-aligned teal bubble, white text
 * - assistant: left-aligned white bubble, dark text, border + soft shadow
 * - fallback: left-aligned warm yellow card (never red), via FallbackCard
 * - assistant + not fallback: TTSButton shown next to the message
 */
export default function MessageBubble({ role, text, isFallback, referral, lang }) {
  const isUser = role === 'user'

  if (isFallback) {
    return (
      <div className="self-start max-w-[88%]">
        <FallbackCard fallbackMessage={text} referral={referral} />
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="self-end max-w-[78%] bg-[var(--clr-primary)] text-white rounded-2xl rounded-br-md px-4 py-3 font-medium text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </div>
    )
  }

  // Assistant (safe) message — bubble + listen button
  return (
    <div className="self-start max-w-[78%] flex items-end gap-2">
      <div className="bg-[var(--clr-surface)] text-[var(--clr-text-primary)] rounded-2xl rounded-bl-md px-4 py-3 border border-[var(--clr-border)] shadow-sm font-normal text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </div>
      <TTSButton text={text} lang={lang} />
    </div>
  )
}
