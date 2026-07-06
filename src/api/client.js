// Real API client — talks to SRH-BACKEND-API.
// Mirrors the signatures in ./mockClient.js exactly so the mock/real swap in
// ./index.js requires no component changes.
//
// Base URL comes from VITE_API_BASE_URL (e.g. http://localhost:8000).
// Network failures are normalised into an OfflineError so the UI can show the
// calm offline banner instead of a scary error.

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const BASE = RAW_BASE.replace(/\/+$/, '') // strip trailing slashes

export class OfflineError extends Error {
  constructor(message = 'Backend unreachable') {
    super(message)
    this.name = 'OfflineError'
    this.offline = true
  }
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
  } catch {
    // fetch rejects (TypeError) on DNS / connection failure — treat as offline.
    throw new OfflineError()
  }

  if (!res.ok) {
    // A 5xx from a reachable-but-unhealthy backend is also surfaced as offline,
    // so the user always sees the supportive banner + hotline rather than a code.
    if (res.status >= 500) throw new OfflineError(`Server error ${res.status}`)
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.detail || `Request failed: ${res.status}`)
  }

  return res.json()
}

export const startSession = async () =>
  request('/api/v1/session/start', { method: 'POST', body: JSON.stringify({}) })

export const sendMessage = async (sessionId, message, lang, simplified) =>
  request('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, message, lang, simplified }),
  })

export const checkHealth = async () => request('/api/v1/health', { method: 'GET' })
