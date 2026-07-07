import { describe, it, expect, vi } from 'vitest'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import ConsentScreen from '../components/Onboarding/ConsentScreen'

describe('Onboarding / ConsentScreen', () => {
  it('has no axe accessibility violations', async () => {
    const { container } = renderWithProviders(<ConsentScreen onConsent={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('gates the Continue button behind both consent checkboxes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ConsentScreen onConsent={() => {}} />)

    const cont = screen.getByRole('button', { name: /continue/i })
    expect(cont).toBeDisabled()

    const [ageBox, anonBox] = screen.getAllByRole('checkbox')
    await user.click(ageBox)
    expect(cont).toBeDisabled() // still one unchecked
    await user.click(anonBox)
    expect(cont).toBeEnabled()
  })

  it('starts a session and calls onConsent when confirmed', async () => {
    const user = userEvent.setup()
    const onConsent = vi.fn()
    renderWithProviders(<ConsentScreen onConsent={onConsent} />)

    for (const box of screen.getAllByRole('checkbox')) await user.click(box)
    await user.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(onConsent).toHaveBeenCalled())
    expect(sessionStorage.getItem('consent_given')).toBe('true')
  })

  it('describes the meaningful hero illustration for screen readers', () => {
    renderWithProviders(<ConsentScreen onConsent={() => {}} />)
    // The illustration is meaningful, so it must expose an accessible name.
    expect(screen.getByRole('img', { name: /talking openly about health/i })).toBeInTheDocument()
  })
})
