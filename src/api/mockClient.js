// Mock API client — used while the ML models are still being trained.
// Activated when VITE_USE_MOCK === "true" (see ./index.js).
// Mirrors the exact function signatures of ./client.js so swapping is invisible
// to the rest of the app.

export const startSession = async () => ({ session_id: 'mock-session-' + Date.now() })

export const sendMessage = async (sessionId, message, lang, simplified) => {
  await new Promise((r) => setTimeout(r, 1200)) // simulate network latency

  // Demo trigger for the safety-classifier fallback path.
  if (message.toLowerCase().includes('force') || message.toLowerCase().includes('minor')) {
    return {
      response: null,
      safe: false,
      topic: null,
      lang,
      fallback: true,
      fallback_message:
        lang === 'rw'
          ? "Ntabwo nshobora gufasha muri icyo kibazo. Nyamuneka vugana n'umujyanama w'ubuzima."
          : "I'm not able to help with that. Please contact a health worker.",
      referral: {
        text: lang === 'rw' ? "Inzira y'ubuzima: 114" : 'Rwanda Health Hotline: 114',
      },
    }
  }

  return {
    response:
      lang === 'rw'
        ? "Iki ni igisubizo cy'icyitegererezo cy'ikibazo cyawe."
        : 'This is a placeholder response to your health question.',
    safe: true,
    topic: 'general_srh',
    lang,
    fallback: false,
  }
}

export const checkHealth = async () => ({ status: 'ok' })
