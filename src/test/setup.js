import '@testing-library/jest-dom'
import { expect, vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'

// jest-axe matcher for asserting no accessibility violations.
expect.extend(toHaveNoViolations)

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  localStorage.clear()
})

// ── jsdom polyfills ─────────────────────────────────────────────────────────
// jsdom lacks a number of browser APIs that our components (and Radix Dialog)
// touch. Stub them so tests exercise real component logic without crashing.

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}

if (!('scrollIntoView' in Element.prototype)) {
  Element.prototype.scrollIntoView = vi.fn()
} else {
  Element.prototype.scrollIntoView = vi.fn()
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// Radix Dialog / focus-scope use these pointer-capture APIs.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {}
}

// Note: window.speechSynthesis is intentionally left undefined so useTTS reports
// TTS as unsupported in tests (TTSButton then renders nothing), matching a
// headless environment.
