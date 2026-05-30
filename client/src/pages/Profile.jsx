import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { User, Mail, DollarSign, Bell, Save } from 'lucide-react'

const CURRENCIES = ['USD', 'EUR', 'INR']

const Profile = () => {
  const { user, updateUser, loading } = useAuth()
  const { currency, setCurrency } = useCurrency()

  const [form, setForm] = useState({
    name: user?.name || '',
    currency: currency || user?.currency || 'USD',
    budgetLimit: user?.budgetLimit || 0,
    emailReminders: user?.emailReminders || false,
  })

 // Only sync currency from context, don't reset other fields
useEffect(() => {
  setForm(prev => ({ ...prev, currency }))
}, [currency])

const handleSubmit = async (e) => {
  e.preventDefault()
  const updateData = {
    name: form.name,
    currency: form.currency,
    budgetLimit: Number(form.budgetLimit),
    emailReminders: form.emailReminders,
  }
  const success = await updateUser(updateData)
  if (success) {
    setCurrency(form.currency)
  }
}
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      {/* Avatar Card */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
          <span className="text-primary-600 dark:text-primary-400 font-display font-bold text-2xl">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-white text-lg">{user?.name}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Personal Info */}
        <div className="card space-y-4">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <User size={16} className="text-primary-600" /> Personal Info
          </h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <input className="input" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-9 opacity-60 cursor-not-allowed" value={user?.email} disabled />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="card space-y-4">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <DollarSign size={16} className="text-primary-600" /> Preferences
          </h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
            <select className="input" value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-xs text-slate-400 mt-1">Save changes to apply currency across the app</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Monthly Budget Limit
            </label>
            <input type="number" className="input" value={form.budgetLimit}
              onChange={e => setForm({ ...form, budgetLimit: e.target.value })}
              placeholder="0 = no limit" min="0" />
            <p className="text-xs text-slate-400 mt-1">Get warned when expenses approach this limit</p>
          </div>

          {/* Email Reminders Toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Bell size={15} className="text-primary-600" /> Email Reminders
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Weekly digest of recurring transactions</p>
            </div>
            <div
              onClick={() => setForm({ ...form, emailReminders: !form.emailReminders })}
              className={`relative flex-shrink-0 w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                form.emailReminders ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-transform duration-200 ${
                form.emailReminders ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
          {loading
            ? <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</>
            : <><Save size={16} /> Save Changes</>
          }
        </button>
      </form>
    </div>
  )
}

export default Profile