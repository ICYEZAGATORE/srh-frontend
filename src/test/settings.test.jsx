import { describe, it, expect, vi } from 'vitest'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import SettingsOverlay from '../components/Layout/SettingsOverlay'

describe('Accessibility settings overlay', () => {
  it('renders an accessible modal dialog with no axe violations', async () => {
    renderWithProviders(<SettingsOverlay open onClose={() => {}} />)
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()
    // Run axe on the whole document because Radix portals the dialog to <body>.
    expect(await axe(document.body)).toHaveNoViolations()
  })

  it('exposes all three accessibility toggles as switches', async () => {
    renderWithProviders(<SettingsOverlay open onClose={() => {}} />)
    await screen.findByRole('dialog')
    // High contrast + simplified language are role="switch".
    expect(screen.getAllByRole('switch').length).toBeGreaterThanOrEqual(2)
    // Three font-size options are pressable buttons.
    expect(screen.getByRole('button', { name: 'Large' })).toBeInTheDocument()
  })

  it('toggles high-contrast state on activation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SettingsOverlay open onClose={() => {}} />)
    await screen.findByRole('dialog')

    const [contrastSwitch] = screen.getAllByRole('switch')
    expect(contrastSwitch).toHaveAttribute('aria-checked', 'false')
    await user.click(contrastSwitch)
    expect(contrastSwitch).toHaveAttribute('aria-checked', 'true')
  })

  it('closes on Escape (Radix focus-managed dialog)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderWithProviders(<SettingsOverlay open onClose={onClose} />)
    await screen.findByRole('dialog')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })
})
