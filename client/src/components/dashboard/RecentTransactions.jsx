import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatDate } from '../../utils/dateHelpers.js'

const categoryEmoji = {
  Food: '🍔', Travel: '✈️', Shopping: '🛍️', Salary: '💼',
  Bills: '📄', Entertainment: '🎬', Healthcare: '🏥',
  Education: '📚', Investment: '📈', Others: '💰'
}

const RecentTransactions = ({ transactions, formatAmount }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <p className="text-4xl mb-2">💸</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No transactions yet</p>
          <p className="text-slate-400 text-xs mt-1">Add your first transaction to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((t) => (
          <div key={t._id} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg">
                {categoryEmoji[t.category] || '💰'}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.title}</p>
                <p className="text-xs text-slate-400">{t.category} • {formatDate(t.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {t.type === 'income'
                ? <ArrowUpRight size={14} className="text-emerald-500" />
                : <ArrowDownRight size={14} className="text-red-500" />
              }
              <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions