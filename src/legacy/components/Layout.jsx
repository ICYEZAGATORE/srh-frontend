import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isAuthenticated, clearSession } from '../services/auth'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const loggedIn = isAuthenticated()

  function handleSignOut() {
    clearSession()
    navigate('/signin')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold text-slate-900">SRH AI Platform</span>
          </Link>

          <nav className="flex items-center gap-3">
            {loggedIn ? (
              <>
                <Link
                  to="/"
                  className={`text-sm font-medium ${location.pathname === '/' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Home
                </Link>
                <button onClick={handleSignOut} className="btn-secondary text-sm">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-slate-500 text-center">
          SRH AI Platform · Capstone Project · African Leadership University
        </div>
      </footer>
    </div>
  )
}
