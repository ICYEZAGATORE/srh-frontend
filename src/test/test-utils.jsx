import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../contexts/LanguageContext'
import { SessionProvider } from '../contexts/SessionContext'

/**
 * Renders a component wrapped in the app's global providers (router + language +
 * session) so context-dependent components — including anything that uses
 * react-router <Link>/<Navigate> — work in isolation.
 *
 * options.route sets the initial router entry (defaults to "/").
 */
export function renderWithProviders(ui, options = {}) {
  const { route = '/', ...renderOptions } = options
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <SessionProvider>{ui}</SessionProvider>
      </LanguageProvider>
    </MemoryRouter>,
    renderOptions,
  )
}

export * from '@testing-library/react'
