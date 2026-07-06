import { Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { SessionProvider, useSession } from './contexts/SessionContext'
import Home from './pages/Home'
import Assessment from './pages/Assessment'

const FONT_CLASS = {
  default: 'text-base',
  large: 'text-lg',
  xl: 'text-xl',
}

/**
 * Applies the global accessibility classes (font size + high contrast) to the
 * app root, then renders the routes. Must live inside the providers so it can
 * read SessionContext.
 */
function AppShell() {
  const { fontSize, highContrast } = useSession()
  const rootClass = [
    'min-h-screen',
    'bg-[var(--clr-bg)]',
    'text-[var(--clr-text-primary)]',
    FONT_CLASS[fontSize] || FONT_CLASS.default,
    highContrast ? 'high-contrast' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <SessionProvider>
        <AppShell />
      </SessionProvider>
    </LanguageProvider>
  )
}
