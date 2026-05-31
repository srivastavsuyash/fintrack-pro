import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Eye, EyeOff, Wallet, Mail, Lock, User, Phone, Check, X } from 'lucide-react'

const getStrength = (password) => {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabel = ['', 'Weak', 'Fair', 'Medium', 'Strong', 'Very Strong']
const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500']
const strengthText = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-emerald-500']

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const strength = getStrength(formData.password)

  const rules = [
    { label: 'Minimum 8 characters', pass: formData.password.length >= 8 },
    { label: 'One uppercase letter', pass: /[A-Z]/.test(formData.password) },
    { label: 'One lowercase letter', pass: /[a-z]/.test(formData.password) },
    { label: 'One number', pass: /[0-9]/.test(formData.password) },
    { label: 'One special character', pass: /[^A-Za-z0-9]/.test(formData.password) },
  ]

  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword
  const passwordsMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must contain an uppercase letter'
    if (!/[0-9]/.test(formData.password)) newErrors.password = 'Password must contain a number'
    if (!/[^A-Za-z0-9]/.test(formData.password)) newErrors.password = 'Password must contain a special character'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined
    })
    if (success) navigate('/dashboard')
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
          <p className="text-slate-500 dark:text-slate-400 mt-1">Join us today — it's free!</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="John Doe" className={`input pl-9 ${errors.name ? 'border-red-400' : ''}`} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@example.com" className={`input pl-9 ${errors.email ? 'border-red-400' : ''}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone - Optional */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Mobile Number
                <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className="input pl-9" />
              </div>
              <p className="text-xs text-slate-400 mt-1">For future WhatsApp & SMS alerts</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Min. 8 characters" className={`input pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

              {/* Strength Bar */}
              {formData.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strengthText[strength]}`}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}

              {/* Password Rules */}
              {formData.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {rule.pass
                        ? <Check size={12} className="text-emerald-500 flex-shrink-0" />
                        : <X size={12} className="text-red-400 flex-shrink-0" />
                      }
                      <span className={`text-xs ${rule.pass ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`input pl-9 pr-10 ${passwordsMismatch ? 'border-red-400' : passwordsMatch ? 'border-emerald-400' : ''}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordsMatch && (
                <p className="text-emerald-500 text-xs mt-1 flex items-center gap-1">
                  <Check size={12} /> Passwords match
                </p>
              )}
              {passwordsMismatch && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X size={12} /> Passwords do not match
                </p>
              )}
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
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">Made with ❤️ by Suyash Srivastava</p>
      </div>
    </div>
  )
}

export default Register