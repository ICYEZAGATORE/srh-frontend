import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import en from '../i18n/en.json'
import rw from '../i18n/rw.json'

const dictionaries = { en, rw }

const LanguageContext = createContext(null)

const STORAGE_KEY = 'srh_lang'

function getInitialLang() {
  // Persist language choice so a returning user keeps their preference.
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  return stored === 'en' || stored === 'rw' ? stored : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* localStorage may be unavailable (private mode) — ignore */
    }
  }, [])

  // t(key) returns the translated string for the active language.
  // Falls back to the English string, then the raw key, so the UI never breaks.
  const t = useCallback(
    (key) => {
      const dict = dictionaries[lang] || dictionaries.en
      if (key in dict) return dict[key]
      if (key in dictionaries.en) return dictionaries.en[key]
      return key
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

export default LanguageContext
