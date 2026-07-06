// auth.js — token management in localStorage.
// Single source of truth for "am I logged in" and "who am I".

const TOKEN_KEY = 'srh_token'
const USER_KEY = 'srh_user'

export function saveSession({ access_token, user_id, language_preference }) {
  localStorage.setItem(TOKEN_KEY, access_token)
  localStorage.setItem(USER_KEY, JSON.stringify({ user_id, language_preference }))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return Boolean(getToken())
}
