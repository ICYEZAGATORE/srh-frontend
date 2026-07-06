import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import SettingsOverlay from './SettingsOverlay'

/**
 * App header: brand mark + name, a language toggle (en <-> rw) and an
 * accessibility settings button that opens the SettingsOverlay. Every control
 * has an aria-label. Solid teal bar with a 1px white bottom border.
 */
export default function Header() {
  const { t, lang, setLang } = useLanguage()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const toggleLang = () => setLang(lang === 'en' ? 'rw' : 'en')

  return (
    <header className="sticky top-0 z-20 bg-[var(--clr-primary)] border-b border-white/10">
      <div className="h-[60px] flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo mark: yellow circle with a speech-bubble cut out in white —
              "speaking openly about health". Decorative. */}
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0">
            <circle cx="14" cy="14" r="13" style={{ fill: 'var(--clr-yellow)' }} />
            <path
              d="M8 11a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-4l-3.2 2.6a.5.5 0 0 1-.8-.4V17a3 3 0 0 1-1-2.2z"
              fill="#FFFFFF"
            />
          </svg>
          <span className="text-white font-bold text-lg tracking-tight truncate">{t('app_name')}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Language toggle — label shows the language you can switch TO */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t('lang_toggle')}
            className="inline-flex items-center gap-1.5 border border-white/40 text-white text-sm px-3 py-1 rounded-full hover:bg-white/20 focus:bg-white/20 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
            </svg>
            {t('lang_toggle')}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label={t('settings_open')}
            aria-haspopup="dialog"
            className="w-9 h-9 rounded-full text-white flex items-center justify-center hover:bg-white/20 focus:bg-white/20 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      <SettingsOverlay open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  )
}
