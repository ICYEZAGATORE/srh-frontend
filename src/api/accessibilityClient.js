// Client for the independent Accessibility Services microservice
// (accessibility-service/). Controlled by VITE_ACCESSIBILITY_API_URL:
//   - unset/empty  -> isConfigured() is false; callers use their built-in
//                     fallbacks (Web Speech, authored alt text). The mock demo
//                     therefore makes NO calls to this service.
//   - set          -> real calls to /v1/tts, /v1/alt-text, /v1/simplify.

const BASE = (import.meta.env.VITE_ACCESSIBILITY_API_URL || '').replace(/\/+$/, '')

export const isConfigured = () => BASE.length > 0

/** POST /v1/tts -> WAV audio Blob. Throws if unconfigured or the service 503s. */
export async function synthesizeSpeech(text, lang = 'en') {
  if (!isConfigured()) throw new Error('accessibility service not configured')
  const res = await fetch(`${BASE}/v1/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang }),
  })
  if (!res.ok) throw new Error(`tts ${res.status}`)
  return res.blob()
}

/** POST /v1/alt-text (multipart) -> generated alt string. */
export async function generateAltText(imageUrl, lang = 'en') {
  if (!isConfigured()) throw new Error('accessibility service not configured')
  const imgRes = await fetch(imageUrl)
  const blob = await imgRes.blob()
  const form = new FormData()
  form.append('image', blob, 'image')
  const res = await fetch(`${BASE}/v1/alt-text?lang=${encodeURIComponent(lang)}`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`alt-text ${res.status}`)
  const data = await res.json()
  return data.alt_text || ''
}

/** POST /v1/simplify -> simplified text. Falls back to the original on any error. */
export async function simplifyText(text, lang = 'en') {
  if (!isConfigured()) return text
  try {
    const res = await fetch(`${BASE}/v1/simplify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang }),
    })
    if (!res.ok) return text
    const data = await res.json()
    return data.simplified || text
  } catch {
    return text
  }
}
