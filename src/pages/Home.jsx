import { useState, useEffect } from 'react'
import { askQuestion, getProfile } from '../services/api'
import { isAuthenticated } from '../services/auth'
import { Link } from 'react-router-dom'

export default function Home() {
  const loggedIn = isAuthenticated()
  const [user, setUser] = useState(null)
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loggedIn) {
      getProfile().then(setUser).catch(() => {})
    }
  }, [loggedIn])

  async function handleAsk(e) {
    e.preventDefault()
    if (!query.trim()) return
    setError(''); setLoading(true); setResponse(null)
    try {
      const result = await askQuestion(query)
      setResponse(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    'How do condoms protect against HIV?',
    'What is the age of consent in Rwanda?',
    'Kondomu ikora ite?',
    'What SRH services are available for persons with disabilities?',
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          {loggedIn ? `Welcome back${user ? `, ${user.email.split('@')[0]}` : ''}.` : 'SRH information you can trust.'}
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Ask any sexual and reproductive health question in English or Kinyarwanda.
          Private, judgment-free, and grounded in WHO and Rwanda Ministry of Health guidance.
        </p>
        {!loggedIn && (
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/signup" className="btn-primary">Create an account</Link>
            <Link to="/signin" className="btn-secondary">Sign in</Link>
          </div>
        )}
      </section>

      {/* Ask box — visible to everyone for demo */}
      <section className="card mb-6">
        <h2 className="font-semibold text-slate-900 mb-3">Ask a question</h2>
        <form onSubmit={handleAsk} className="space-y-3">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question here…"
            rows={3}
            className="input"
            maxLength={500}
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-slate-500">{query.length}/500</span>
            <button type="submit" disabled={loading || !query.trim()} className="btn-primary">
              {loading ? 'Thinking…' : 'Ask'}
            </button>
          </div>
        </form>

        {/* Example chips */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Try one of these</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="card border-red-200 bg-red-50 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Response */}
      {response && (
        <section className="card">
          <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
            <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700">
              {response.language === 'rw' ? 'Kinyarwanda' : 'English'}
            </span>
            {response.predicted_topic && (
              <span className="px-2 py-0.5 rounded bg-slate-100">
                Topic: {response.predicted_topic}
              </span>
            )}
            <span className="ml-auto">{response.latency_ms} ms</span>
          </div>

          {response.safe ? (
            <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{response.response}</p>
          ) : (
            <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              {response.response}
            </div>
          )}

          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
            {response.disclaimer}
          </p>
        </section>
      )}
    </div>
  )
}
