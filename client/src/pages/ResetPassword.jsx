import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (res.ok) {
        setDone(true)
        toast.success('Password reset successful!')
      } else {
        toast.error(data.message || 'Reset failed')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Wallet size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white">FinTrack Pro</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Reset your password</p>
        </div>

        <div className="card">
          {!done ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters" className="input pl-9 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password" className="input pl-9" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Password Reset!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your password has been successfully reset.</p>
              <Link to="/login" className="btn-primary w-full block text-center py-2.5">Go to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword