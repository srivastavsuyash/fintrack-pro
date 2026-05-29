import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactionService.js'
import { getSummary } from '../services/transactionService.js'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { exportToCSV } from '../utils/exportCSV.js'
import { exportToPDF } from '../utils/exportPDF.js'
import { formatDate } from '../utils/dateHelpers.js'
import toast from 'react-hot-toast'

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Salary', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Investment', 'Others']

const categoryEmoji = {
  Food: '🍔', Travel: '✈️', Shopping: '🛍️', Salary: '💼',
  Bills: '📄', Entertainment: '🎬', Healthcare: '🏥',
  Education: '📚', Investment: '📈', Others: '💰'
}

const emptyForm = { title: '', amount: '', type: 'expense', category: 'Food', date: '', notes: '' }

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState({ search: '', type: '', category: '', page: 1 })
  const [totalPages, setTotalPages] = useState(1)
  const { formatAmount } = useCurrency()

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = { page: filters.page, limit: 10 }
      if (filters.search) params.search = filters.search
      if (filters.type) params.type = filters.type
      if (filters.category) params.category = filters.category
      const [txData, sumData] = await Promise.all([getTransactions(params), getSummary()])
      setTransactions(txData.transactions)
      setTotalPages(txData.pages)
      setSummary(sumData)
    } catch {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [filters])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.amount || !form.category) return
    try {
      if (editItem) {
        await updateTransaction(editItem._id, form)
        toast.success('Transaction updated!')
      } else {
        await createTransaction(form)
        toast.success('Transaction added!')
      }
      setShowModal(false)
      setEditItem(null)
      setForm(emptyForm)
      fetchData()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleEdit = (t) => {
    setEditItem(t)
    setForm({ title: t.title, amount: t.amount, type: t.type, category: t.category, date: t.date?.split('T')[0] || '', notes: t.notes || '' })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await deleteTransaction(id)
      toast.success('Deleted!')
      fetchData()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your income and expenses</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm(emptyForm); setShowModal(true) }}
          className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search transactions..." className="input pl-9 text-sm"
            value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        </div>
        <select className="input text-sm w-36" value={filters.type}
          onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="input text-sm w-40" value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value, page: 1 })}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => exportToCSV(transactions)} className="btn-ghost flex items-center gap-2 text-sm border border-slate-200 dark:border-slate-700">
          <Download size={15} /> CSV
        </button>
        <button onClick={() => exportToPDF(transactions, summary)} className="btn-ghost flex items-center gap-2 text-sm border border-slate-200 dark:border-slate-700">
          <Download size={15} /> PDF
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {['Transaction', 'Amount', 'Type', 'Category', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
              </td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">No transactions found</td></tr>
            ) : transactions.map(t => (
              <tr key={t._id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{categoryEmoji[t.category] || '💰'}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.title}</p>
                      {t.notes && <p className="text-xs text-slate-400 truncate max-w-[150px]">{t.notes}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${t.type === 'income' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400">{t.category}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{formatDate(t.date)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(t)} className="text-xs text-primary-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(t._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setFilters({ ...filters, page: p })}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${filters.page === p ? 'bg-primary-600 text-white' : 'bg-white dark:bg-surface-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-4">
              {editItem ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Title" className="input" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input type="number" placeholder="Amount" className="input" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} required min="0.01" step="0.01" />
              <div className="grid grid-cols-2 gap-3">
                <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input type="date" className="input" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
              <textarea placeholder="Notes (optional)" className="input resize-none" rows={2}
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 border border-slate-200 dark:border-slate-700">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editItem ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions