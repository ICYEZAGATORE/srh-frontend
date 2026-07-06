import Header from '../components/Layout/Header'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Placeholder for the future pre/post SRH knowledge quiz. The route exists so
 * the navigation is wired; the component is intentionally a stub for the MVP.
 */
export default function Assessment() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col min-h-screen bg-[var(--clr-bg)]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-[var(--clr-surface)] border border-[var(--clr-border)]">
          <div
            aria-hidden="true"
            className="mx-auto w-16 h-16 rounded-3xl bg-[var(--clr-accent)] text-white flex items-center justify-center text-3xl mb-4"
          >
            📝
          </div>
          <p className="text-lg font-bold text-[var(--clr-text-primary)]">{t('assessment_placeholder')}</p>
        </div>
      </main>
    </div>
  )
}
