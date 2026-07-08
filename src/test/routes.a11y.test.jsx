import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import App from '../App'
import Landing from '../pages/Landing'
import Assessment from '../pages/Assessment'
import Home from '../pages/Home'

/**
 * Site-wide accessibility coverage (item 1): every route is exercised, not just
 * the chat components. Automated jest-axe cannot replace the manual NVDA /
 * TalkBack audit (docs/ACCESSIBILITY_MANUAL_AUDIT.md) but it does guard the
 * programmatic ARIA / contrast / structure regressions across all pages.
 */

// Collect heading levels in DOM order and assert the hierarchy never skips a
// level (WCAG 1.3.1 / 2.4.6): starts at h1, and each step down is +1 at most.
function assertHeadingHierarchy(container) {
  const levels = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) =>
    Number(h.tagName[1]),
  )
  expect(levels[0]).toBe(1) // first heading on the page is an h1
  expect(levels.filter((l) => l === 1).length).toBe(1) // exactly one h1
  for (let i = 1; i < levels.length; i += 1) {
    expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
  }
}

describe('Landing page (route /)', () => {
  // Force reduced motion so the signature typewriter renders statically and
  // deterministically during the test.
  beforeEach(() => {
    window.matchMedia = (query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })
  })

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithProviders(<Landing />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has a single h1 and a correctly nested heading hierarchy', () => {
    const { container } = renderWithProviders(<Landing />)
    assertHeadingHierarchy(container)
  })

  it('offers a keyboard-reachable primary call-to-action into the chat', () => {
    renderWithProviders(<Landing />)
    const cta = screen.getAllByRole('link', { name: /start a conversation/i })[0]
    expect(cta).toHaveAttribute('href', '/chat')
  })
})

describe('Landing read-aloud on static content', () => {
  let originalSpeech
  let originalUtterance

  beforeEach(() => {
    originalSpeech = window.speechSynthesis
    originalUtterance = window.SpeechSynthesisUtterance
    // Stub the Web Speech API so useTTS reports support and the read-aloud
    // control renders (setup.js leaves it undefined by default).
    window.speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: () => {},
      set onvoiceschanged(_fn) {},
    }
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text
      }
    }
    window.matchMedia = (query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })
  })

  afterEach(() => {
    // Restore exactly — assigning `undefined` would leave the key present, so
    // `'speechSynthesis' in window` would stay true and mislead useTTS in later
    // tests. Delete the keys when they were originally absent.
    if (originalSpeech === undefined) delete window.speechSynthesis
    else window.speechSynthesis = originalSpeech
    if (originalUtterance === undefined) delete window.SpeechSynthesisUtterance
    else window.SpeechSynthesisUtterance = originalUtterance
  })

  it('renders a labelled, operable read-aloud button that reads the page client-side', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Landing />)
    const btn = screen.getByRole('button', { name: /read this page aloud/i })
    expect(btn).toBeInTheDocument()
    // Operable by keyboard/click without a backend response existing.
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Consent gate (route /chat, pre-consent)', () => {
  it('has no axe accessibility violations and a single h1', async () => {
    const { container } = renderWithProviders(<Home />, { route: '/chat' })
    expect(await axe(container)).toHaveNoViolations()
    assertHeadingHierarchy(container)
  })
})

describe('Chat page (route /chat, post-consent)', () => {
  beforeEach(() => {
    sessionStorage.setItem('consent_given', 'true')
  })

  it('has a single h1 and no skipped heading levels (empty state)', () => {
    // Guards the regression where the empty-state WelcomeIllustration <h2> was
    // the first heading with no <h1> above it.
    const { container } = renderWithProviders(<Home />, { route: '/chat' })
    assertHeadingHierarchy(container)
  })
})

describe('Assessment page (route /assessment)', () => {
  it('has no axe accessibility violations and a single h1', async () => {
    const { container } = renderWithProviders(<Assessment />, { route: '/assessment' })
    expect(await axe(container)).toHaveNoViolations()
    assertHeadingHierarchy(container)
  })
})

describe('App shell', () => {
  beforeEach(() => {
    window.matchMedia = (query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })
  })

  it('exposes a skip-to-content link as the first focusable element', async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />, { route: '/' })
    const skip = screen.getByRole('link', { name: /skip to main content/i })
    expect(skip).toHaveAttribute('href', '#main-content')
    // It is the first thing a keyboard user reaches.
    await user.tab()
    expect(skip).toHaveFocus()
    // And it points at a real landmark on the page.
    expect(document.querySelector('#main-content')).toBeTruthy()
  })
})
