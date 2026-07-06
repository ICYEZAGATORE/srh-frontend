import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import WelcomeIllustration from './WelcomeIllustration'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Scrollable list of messages. Auto-scrolls to the bottom on new messages and
 * announces new content to screen readers via aria-live="polite". Shows a
 * welcoming illustration when empty, and an animated loading indicator while
 * waiting for a response.
 *
 * Props: messages (array), isLoading (bool)
 */
export default function ChatWindow({ messages, isLoading }) {
  const { t, lang } = useLanguage()
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading])

  const empty = messages.length === 0

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--clr-bg)]">
      <div className="mx-auto max-w-2xl px-4 py-3">
        {empty && !isLoading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <WelcomeIllustration />
          </div>
        ) : null}

        <ul aria-live="polite" className="flex flex-col gap-3 list-none p-0 m-0">
          {messages.map((m) => (
            <li key={m.id} className="flex flex-col">
              <MessageBubble
                role={m.role}
                text={m.text}
                isFallback={m.isFallback}
                referral={m.referral}
                lang={lang}
              />
            </li>
          ))}

          {isLoading && (
            <li className="flex flex-col">
              <div className="self-start max-w-[78%]">
                <div
                  className="rounded-2xl rounded-bl-md bg-[var(--clr-surface)] border border-[var(--clr-border)] shadow-sm px-4 py-3"
                  role="status"
                  aria-label={t('chat_loading')}
                >
                  <span className="sr-only">{t('chat_loading')}</span>
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="dot-bounce w-2 h-2 rounded-full bg-[var(--clr-primary)]" style={{ animationDelay: '0ms' }} />
                    <span className="dot-bounce w-2 h-2 rounded-full bg-[var(--clr-primary)]" style={{ animationDelay: '150ms' }} />
                    <span className="dot-bounce w-2 h-2 rounded-full bg-[var(--clr-primary)]" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            </li>
          )}
        </ul>

        <div ref={endRef} />
      </div>
    </div>
  )
}
