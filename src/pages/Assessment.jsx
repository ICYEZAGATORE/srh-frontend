import Header from '../components/Layout/Header'
import AltImage from '../components/AltImage'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Placeholder for the future pre/post SRH knowledge quiz. The route exists so
 * the navigation is wired; the component is intentionally a stub for the MVP.
 *
 * It also demonstrates the alt-text pipeline: the illustrative image below is a
 * MEANINGFUL image, so it uses <AltImage> — alt text comes from the Accessibility
 * Services microservice when configured, else the authored fallback.
 */
export default function Assessment() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col min-h-screen bg-[var(--clr-bg)]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-[var(--clr-surface)] border border-[var(--clr-border)]">
          <AltImage
            src="/icon-192.png"
            fallbackAlt="SRH Education Platform logo"
            className="mx-auto w-16 h-16 rounded-3xl mb-4"
          />
          <p className="text-lg font-bold text-[var(--clr-text-primary)]">{t('assessment_placeholder')}</p>
        </div>
      </main>
    </div>
  )
}
