import { useState } from 'react'
import { Mail, MessageSquare, User, FileText, Send, CheckCircle } from 'lucide-react'

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.subject.trim()) newErrors.subject = 'Subject is required'
    if (!form.message.trim()) newErrors.message = 'Message is required'
    else if (form.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters'
    return newErrors
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
      } else {
        setErrors({ submit: data.message || 'Failed to send. Try again.' })
      }
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl">
        <div className="card text-center py-16">
          <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Message Sent!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Thanks for reaching out. We'll get back to you within 24–48 hours.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
            className="btn-primary px-8">
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Contact Us</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      {/* Support Info */}
      <div className="card bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white text-sm">Support Email</p>
            <p className="text-primary-600 dark:text-primary-400 text-sm mt-0.5">support@fintrackpro.com</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Or use the form below — we respond within 24–48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <p className="text-red-600 dark:text-red-400 text-sm">⚠️ {errors.submit}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your full name"
                className={`input pl-9 ${errors.name ? 'border-red-400' : ''}`} />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className={`input pl-9 ${errors.email ? 'border-red-400' : ''}`} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
            <div className="relative">
              <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="subject" value={form.subject} onChange={handleChange}
                placeholder="What's this about?"
                className={`input pl-9 ${errors.subject ? 'border-red-400' : ''}`} />
            </div>
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
            <div className="relative">
              <MessageSquare size={15} className="absolute left-3 top-3 text-slate-400" />
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Write your message here... (min. 20 characters)"
                rows={5} className={`input pl-9 resize-none ${errors.message ? 'border-red-400' : ''}`} />
            </div>
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            <p className="text-xs text-slate-400 mt-1">{form.message.length} characters</p>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? (
              <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Sending...</>
            ) : (
              <><Send size={15} /> Send Message</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactUs