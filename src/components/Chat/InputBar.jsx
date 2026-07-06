import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Message composer: text input + send button. Enter submits. Disabled while a
 * response is loading. Input and button both carry aria-labels.
 *
 * Props: onSend(text), disabled (bool)
 */
export default function InputBar({ onSend, disabled }) {
  const { t } = useLanguage()
  const [value, setValue] = useState('')

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form
      className="bg-[var(--clr-surface)] border-t border-[var(--clr-border)] px-3 py-3 flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label htmlFor="chat-input" className="sr-only">
        {t('chat_placeholder')}
      </label>
      <textarea
        id="chat-input"
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('chat_placeholder')}
        aria-label={t('chat_placeholder')}
        className="flex-1 bg-[var(--clr-primary-light)] border border-[var(--clr-border)] rounded-2xl px-4 py-3 text-sm text-[var(--clr-text-primary)] placeholder:text-[var(--clr-text-secondary)] focus:outline-none focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 resize-none min-h-[48px] max-h-[120px] disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label={t('chat_send')}
        className="bg-[var(--clr-accent)] text-white w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M2 12L22 2L12 22L10 13L2 12Z" />
        </svg>
      </button>
    </form>
  )
}
