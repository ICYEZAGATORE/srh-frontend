#!/usr/bin/env node
/*
  Real frontend → real backend smoke test (item 4).

  Exercises the ACTUAL production API surface the deployed frontend depends on —
  health, session start, and a full chat round trip — and asserts a real,
  non-fallback answer comes back (i.e. NOT mock mode, NOT the offline/safety
  fallback path). It also probes the optional accessibility microservice so a
  partial-failure (one endpoint healthy, another not) is reported rather than
  hidden.

  This guards against the regression class where the frontend silently serves
  mock data or points at a broken backend.

  Usage:
    node scripts/smoke-backend.mjs
    API_BASE_URL=https://srh-backend-api.onrender.com node scripts/smoke-backend.mjs

  Defaults to the production URL in .env.production. Exit code 0 = pass, 1 = fail.
  Note: the free-tier backend may cold-start (~50s) on the first request.
*/

const BASE = (
  process.env.API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  'https://srh-backend-api.onrender.com'
).replace(/\/+$/, '')

const ACCESS_BASE = (process.env.VITE_ACCESSIBILITY_API_URL || '').replace(/\/+$/, '')
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 90000)

let failures = 0
const pass = (m) => console.log(`  [PASS] ${m}`)
const fail = (m) => {
  console.error(`  [FAIL] ${m}`)
  failures += 1
}

async function req(path, options = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    })
    const body = await res.json().catch(() => ({}))
    return { status: res.status, body }
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  console.log(`\nSmoke test against: ${BASE}\n`)

  // 1) Health — all models loaded, DB ok.
  console.log('1. Health')
  try {
    const { status, body } = await req('/api/v1/health')
    if (status === 200 && body.status === 'ok') pass(`health 200, status=ok`)
    else fail(`health returned ${status} ${JSON.stringify(body)}`)
    const models = body?.components?.models || {}
    for (const [name, ok] of Object.entries(models)) {
      ok ? pass(`model "${name}" loaded`) : fail(`model "${name}" NOT loaded`)
    }
  } catch (e) {
    fail(`health request threw: ${e.message}`)
  }

  // 2) Session start.
  console.log('2. Session start')
  let sessionId
  try {
    const { status, body } = await req('/api/v1/session/start', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    sessionId = body?.session_id
    if (status === 200 && sessionId) pass(`session started (${sessionId.slice(0, 8)}…)`)
    else fail(`session start returned ${status} ${JSON.stringify(body)}`)
  } catch (e) {
    fail(`session start threw: ${e.message}`)
  }

  // 3) Chat round trip — must be a REAL grounded answer, not the fallback path.
  console.log('3. Chat round trip')
  try {
    const { status, body } = await req('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        message: 'What is puberty?',
        lang: 'en',
        simplified: false,
      }),
    })
    if (status !== 200) fail(`chat returned ${status} ${JSON.stringify(body)}`)
    else {
      pass('chat 200')
      if (body.fallback === true) fail(`chat hit the FALLBACK path: "${body.fallback_message}"`)
      else pass('chat returned a non-fallback answer')
      if (typeof body.response === 'string' && body.response.trim().length > 40)
        pass(`answer looks real (${body.response.length} chars, topic="${body.topic}")`)
      else fail(`answer too short / empty: ${JSON.stringify(body.response)}`)
    }
  } catch (e) {
    fail(`chat request threw: ${e.message}`)
  }

  // 4) Accessibility microservice (optional) — report partial state, don't fail
  //    the run if it is intentionally unconfigured (frontend falls back to Web
  //    Speech / authored alt text).
  console.log('4. Accessibility microservice (optional)')
  if (!ACCESS_BASE) {
    pass('not configured — frontend uses built-in fallbacks (expected)')
  } else {
    try {
      const res = await fetch(`${ACCESS_BASE}/health`, { method: 'GET' })
      res.ok
        ? pass(`accessibility service healthy (${res.status})`)
        : console.warn(`  [WARN] accessibility service returned ${res.status} — TTS/alt-text fall back client-side`)
    } catch (e) {
      console.warn(`  [WARN] accessibility service unreachable (${e.message}) — client-side fallback in use`)
    }
  }

  console.log('')
  if (failures > 0) {
    console.error(`SMOKE TEST FAILED — ${failures} check(s) failed.\n`)
    process.exit(1)
  }
  console.log('SMOKE TEST PASSED — real frontend → real backend path is healthy.\n')
}

main().catch((e) => {
  console.error(`Smoke test crashed: ${e.stack || e.message}`)
  process.exit(1)
})
