// api.js — single place that talks to the backend.
// Reads the base URL from VITE_API_BASE_URL so we can switch dev/prod without code changes.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

/** Internal: add Authorization header if a token is stored. */
function authHeader() {
  const token = localStorage.getItem('srh_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Generic JSON request wrapper with error handling. */
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.detail || `Request failed: ${res.status}`)
  }
  return res.json()
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function signUp({ email, password, age_group, disability_type, language_preference }) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, age_group, disability_type, language_preference }),
  })
}

export async function signIn(email, password) {
  // FastAPI's OAuth2PasswordRequestForm expects form-urlencoded, not JSON
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.detail || 'Sign in failed')
  }
  return res.json()
}

export async function getProfile() {
  return request('/auth/me')
}

// ── SRH chat ─────────────────────────────────────────────────────────────────

export async function askQuestion(query, sessionId = null) {
  return request('/ask', {
    method: 'POST',
    body: JSON.stringify({ query, session_id: sessionId, accessibility_mode: 'standard' }),
  })
}

// ── Health ───────────────────────────────────────────────────────────────────

export async function checkHealth() {
  return request('/health')
}
