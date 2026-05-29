import { useState, useEffect } from 'react'
import { Plus, RefreshCcw, Trash2, Edit3, ToggleLeft, ToggleRight } from 'lucide-react'
import { getRecurring, createRecurring, updateRecurring, deleteRecurring } from '../services/recurringService.js'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { formatDate } from '../utils/dateHelpers.js'
import toast from 'react-hot-toast'

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Salary', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Investment', 'Others']
const emptyForm = { title: '', amount: '', type: 'expense', category: 'Bills', frequency: 'monthly', nextDueDate: '', notes: '' }

const RecurringTransactions = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const { formatAmount } = useCurrency()

  const fetchData = async () => {
    try { const data = await getRecurring(); setItems(data) }
    catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editItem) { await updateRecurring(editItem._id, form); toast.success('Updated!') }
      else { await createRecurring(form); toast.success('Created!') }
      setShowModal(false); setEditItem(null); setForm(emptyForm); fetchData()
    } catch { toast.error('Something went wrong') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recurring transaction?')) return
    try { await deleteRecurring(id); toast.success('Deleted!'); fetchData() }
    catch { toast.error('Delete failed') }
  }

  const toggleActive = async (item) => {
    try {
      await updateRecurring(item._id, { isActive: !item.isActive })
      toast.success(item.isActive ? 'Paused' : 'Activated')
      fetchData()
    } catch { toast.error('Failed') }
  }

  const freqColor = { daily: 'bg-red-50 text-red-600', weekly: 'bg-yellow-50 text-yellow-600', monthly: 'bg-blue-50 text-blue-600', yearly: 'bg-purple-50 text-purple-600' }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Recurring Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Automate your regular income & expenses</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm(emptyForm); setShowModal(true) }}
          className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Recurring
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-16">
          <RefreshCcw size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No recurring transactions</p>
          <p className="text-slate-400 text-sm mt-1">Set up automatic transactions for bills, salary, etc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item._id} className={`card hover:shadow-md transition-all ${!item.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                </div>
                <div className="flex gap-1 items-center">
                  <button onClick={() => toggleActive(item)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    {item.isActive
                      ? <ToggleRight size={20} className="text-emerald-500" />
                      : <ToggleLeft size={20} className="text-slate-400" />}
                  </button>
                  <button onClick={() => { setEditItem(item); setForm({ title: item.title, amount: item.amount, type: item.type, category: item.category, frequency: item.frequency, nextDueDate: item.nextDueDate?.split('T')[0] || '', notes: item.notes || '' }); setShowModal(true) }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Edit3 size={14} className="text-slate-400" />
                  </button>
                  <button onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {item.type === 'income' ? '+' : '-'}{formatAmount(item.amount)}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${freqColor[item.frequency]}`}>
                  {item.frequency}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Next due: {formatDate(item.nextDueDate)}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-4">
              {editItem ? 'Edit Recurring' : 'Add Recurring Transaction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Title (e.g. Netflix, Rent)" className="input" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input type="number" placeholder="Amount" className="input" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} required min="0.01" step="0.01" />
              <div className="grid grid-cols-2 gap-3">
                <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select className="input" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="date" className="input" value={form.nextDueDate}
                onChange={e => setForm({ ...form, nextDueDate: e.target.value })} required />
              <textarea placeholder="Notes (optional)" className="input resize-none" rows={2}
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 border border-slate-200 dark:border-slate-700">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecurringTransactions