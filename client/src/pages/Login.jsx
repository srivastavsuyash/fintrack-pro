import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Eye, EyeOff, Wallet, Mail, Lock } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { login, loading } = useAuth()
  const timerRef = useRef(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

 const handleSubmit = async (e) => {
  e.preventDefault()
  if (!formData.email || !formData.password) return
  
  if (timerRef.current) clearTimeout(timerRef.current)
  setErrorMsg('')
  
  const success = await login(formData)
  
  if (!success) {
    setErrorMsg('Invalid email or password. Please try again.')
    timerRef.current = setTimeout(() => {
      setErrorMsg('')
    }, 10000)
  } else {
    navigate('/dashboard')
  }
}

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) return
    setForgotLoading(true)
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      setForgotSent(true)
    } catch {
      setForgotSent(true)
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-200">
            <Wallet size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white">FinTrack Pro</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Sign in to continue</p>
        </div>

        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              {!forgotSent ? (
                <>
                  <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-1">Forgot Password?</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Enter your email and we'll send a reset link.</p>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" placeholder="your@email.com" className="input pl-9"
                        value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => { setShowForgot(false); setForgotEmail('') }}
                        className="btn-ghost flex-1 border border-slate-200 dark:border-slate-700">Cancel</button>
                      <button type="submit" disabled={forgotLoading} className="btn-primary flex-1">
                        {forgotLoading ? 'Sending...' : 'Send Link'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">📧</div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">Check your email!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    If an account exists for <strong>{forgotEmail}</strong>, a reset link has been sent.
                  </p>
                  <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail('') }}
                    className="btn-primary w-full">Done</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="text-red-500 text-lg">⚠️</span>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@example.com" className="input pl-9" required />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <button type="button" onClick={() => setShowForgot(true)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password" className="input pl-9 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 cursor-pointer" />
              <label htmlFor="rememberMe" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">Sign Up</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">Made with ❤️ by Suyash Srivastava</p>
      </div>
    </div>
  )
}

export default Login