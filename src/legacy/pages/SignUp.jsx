import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, signIn } from '../services/api'
import { saveSession } from '../services/auth'

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    age_group: '16-19',
    disability_type: 'none',
    language_preference: 'en',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(form)
      // Auto sign-in after successful signup
      const session = await signIn(form.email, form.password)
      saveSession(session)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Create your account</h1>
        <p className="text-sm text-slate-500 mb-6">
          Get private, judgment-free SRH information in English or Kinyarwanda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email" type="email" required className="input"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password" type="password" required minLength={8} className="input"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete="new-password"
            />
            <p className="text-xs text-slate-500 mt-1">Minimum 8 characters.</p>
          </div>

          <div>
            <label className="label" htmlFor="age_group">Age group</label>
            <select
              id="age_group" className="input"
              value={form.age_group}
              onChange={(e) => update('age_group', e.target.value)}
            >
              <option value="13-15">13–15</option>
              <option value="16-19">16–19</option>
              <option value="20+">20+</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="label" htmlFor="disability_type">Disability (optional)</label>
            <select
              id="disability_type" className="input"
              value={form.disability_type}
              onChange={(e) => update('disability_type', e.target.value)}
            >
              <option value="none">None</option>
              <option value="visual">Visual</option>
              <option value="hearing">Hearing</option>
              <option value="physical">Physical</option>
              <option value="cognitive">Cognitive</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="label" htmlFor="language_preference">Preferred language</label>
            <select
              id="language_preference" className="input"
              value={form.language_preference}
              onChange={(e) => update('language_preference', e.target.value)}
            >
              <option value="en">English</option>
              <option value="rw">Kinyarwanda</option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-brand-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
