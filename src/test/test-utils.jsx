import { render } from '@testing-library/react'
import { LanguageProvider } from '../contexts/LanguageContext'
import { SessionProvider } from '../contexts/SessionContext'

/**
 * Renders a component wrapped in the app's global providers (language + session)
 * so context-dependent components work in isolation.
 */
export function renderWithProviders(ui, options) {
  return render(
    <LanguageProvider>
      <SessionProvider>{ui}</SessionProvider>
    </LanguageProvider>,
    options,
  )
}

export * from '@testing-library/react'
