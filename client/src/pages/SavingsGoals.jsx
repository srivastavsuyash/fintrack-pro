import { useState, useEffect } from 'react'
import { Plus, Target, Trash2, Edit3 } from 'lucide-react'
import { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal } from '../services/savingsService.js'
import { useCurrency } from '../context/CurrencyContext.jsx'
import toast from 'react-hot-toast'

const CATEGORIES = ['Emergency Fund', 'Vacation', 'House', 'Car', 'Education', 'Retirement', 'Gadget', 'Wedding', 'Others']
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']
const emptyForm = { title: '', targetAmount: '', currentAmount: '', deadline: '', category: 'Others', color: '#6366f1' }

const SavingsGoals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [addFundsModal, setAddFundsModal] = useState(null)
  const [addAmount, setAddAmount] = useState('')
  const { formatAmount } = useCurrency()

  const fetchGoals = async () => {
    try {
      const data = await getSavingsGoals()
      setGoals(data)
    } catch { toast.error('Failed to load goals') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchGoals() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editItem) {
        await updateSavingsGoal(editItem._id, form)
        toast.success('Goal updated!')
      } else {
        await createSavingsGoal(form)
        toast.success('Goal created!')
      }
      setShowModal(false); setEditItem(null); setForm(emptyForm); fetchGoals()
    } catch { toast.error('Something went wrong') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return
    try { await deleteSavingsGoal(id); toast.success('Deleted!'); fetchGoals() }
    catch { toast.error('Delete failed') }
  }

  const handleAddFunds = async () => {
    if (!addAmount || addAmount <= 0) return
    try {
      const newAmount = Number(addFundsModal.currentAmount) + Number(addAmount)
      await updateSavingsGoal(addFundsModal._id, { currentAmount: newAmount })
      toast.success('Funds added!')
      setAddFundsModal(null); setAddAmount(''); fetchGoals()
    } catch { toast.error('Failed to add funds') }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Savings Goals</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Track your financial targets</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm(emptyForm); setShowModal(true) }}
          className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="card text-center py-16">
          <Target size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No savings goals yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first goal to start saving!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(goal => {
            const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(1)
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
            return (
              <div key={goal._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: goal.color + '20' }}>
                      <Target size={20} style={{ color: goal.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{goal.title}</p>
                      <p className="text-xs text-slate-400">{goal.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditItem(goal); setForm({ title: goal.title, targetAmount: goal.targetAmount, currentAmount: goal.currentAmount, deadline: goal.deadline?.split('T')[0], category: goal.category, color: goal.color }); setShowModal(true) }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Edit3 size={14} className="text-slate-400" />
                    </button>
                    <button onClick={() => handleDelete(goal._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600 dark:text-slate-400">{formatAmount(goal.currentAmount)}</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{formatAmount(goal.targetAmount)}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: goal.color }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pct}% complete</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${daysLeft < 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : daysLeft < 30 ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {daysLeft < 0 ? 'Overdue' : `${daysLeft} days left`}
                  </span>
                  {!goal.isCompleted && (
                    <button onClick={() => setAddFundsModal(goal)}
                      className="text-xs btn-primary py-1 px-3">+ Add Funds</button>
                  )}
                  {goal.isCompleted && (
                    <span className="text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-full">✅ Completed</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-4">
              {editItem ? 'Edit Goal' : 'New Savings Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Goal title" className="input" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input type="number" placeholder="Target amount" className="input" value={form.targetAmount}
                onChange={e => setForm({ ...form, targetAmount: e.target.value })} required min="1" />
              <input type="number" placeholder="Current amount (optional)" className="input" value={form.currentAmount}
                onChange={e => setForm({ ...form, currentAmount: e.target.value })} min="0" />
              <input type="date" className="input" value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })} required />
              <select className="input" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Color</p>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button type="button" key={c} onClick={() => setForm({ ...form, color: c })}
                      className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : ''}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 border border-slate-200 dark:border-slate-700">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {addFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-1">Add Funds</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">to "{addFundsModal.title}"</p>
            <input type="number" placeholder="Amount to add" className="input mb-4"
              value={addAmount} onChange={e => setAddAmount(e.target.value)} min="0.01" step="0.01" autoFocus />
            <div className="flex gap-3">
              <button onClick={() => { setAddFundsModal(null); setAddAmount('') }} className="btn-ghost flex-1 border border-slate-200 dark:border-slate-700">Cancel</button>
              <button onClick={handleAddFunds} className="btn-primary flex-1">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavingsGoals