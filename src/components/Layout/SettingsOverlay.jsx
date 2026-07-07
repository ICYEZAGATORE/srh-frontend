import * as Dialog from '@radix-ui/react-dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSession } from '../../contexts/SessionContext'
import FontSizeControl from '../Accessibility/FontSizeControl'
import ContrastToggle from '../Accessibility/ContrastToggle'

/**
 * Accessibility settings overlay (bottom-sheet modal).
 *
 * Built on Radix UI Dialog for correct, tested modal semantics: focus is
 * trapped inside the sheet, focus is restored to the trigger on close, the
 * background is inert (aria-hidden) and scroll-locked, and Escape / outside
 * click close it. This replaces the previous hand-rolled focus/Escape handling.
 */
export default function SettingsOverlay({ open, onClose }) {
  const { t } = useLanguage()
  const { simplified, setSimplified } = useSession()

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 bg-[var(--clr-text-primary)]/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed z-40 inset-x-0 bottom-0 sm:inset-0 sm:m-auto sm:h-fit w-full sm:max-w-md bg-[var(--clr-surface)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-6 focus:outline-none"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold text-[var(--clr-text-primary)]">
              {t('settings_title')}
            </Dialog.Title>
            <Dialog.Close
              aria-label={t('settings_close')}
              className="w-10 h-10 rounded-xl text-[var(--clr-text-secondary)] hover:bg-[var(--clr-primary-light)] flex items-center justify-center transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </Dialog.Close>
          </div>

          <FontSizeControl />
          <ContrastToggle />

          {/* Simplified language toggle */}
          <div>
            <p
              id="simplified-label"
              className="text-xs font-bold uppercase tracking-wider text-[var(--clr-text-secondary)] mb-3"
            >
              {t('settings_simplified')}
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={simplified}
              aria-labelledby="simplified-label"
              onClick={() => setSimplified(!simplified)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                simplified ? 'bg-[var(--clr-primary)]' : 'bg-[var(--clr-border)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  simplified ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
