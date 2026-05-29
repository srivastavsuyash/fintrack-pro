import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ title, amount, icon: Icon, type, formatAmount }) => {
  const bgMap = {
    balance: 'bg-primary-50 dark:bg-primary-900/20',
    income: 'bg-emerald-50 dark:bg-emerald-900/20',
    expense: 'bg-red-50 dark:bg-red-900/20',
    savings: 'bg-violet-50 dark:bg-violet-900/20',
  }
  const textMap = {
    balance: 'text-primary-600 dark:text-primary-400',
    income: 'text-emerald-600 dark:text-emerald-400',
    expense: 'text-red-600 dark:text-red-400',
    savings: 'text-violet-600 dark:text-violet-400',
  }

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`p-2 rounded-xl ${bgMap[type]}`}>
          <Icon size={18} className={textMap[type]} />
        </div>
      </div>
      <p className={`text-2xl font-display font-bold ${textMap[type]}`}>
        {formatAmount ? formatAmount(amount) : `$${amount?.toFixed(2)}`}
      </p>
      <div className="flex items-center gap-1 mt-2">
        {type === 'income' || type === 'balance'
          ? <TrendingUp size={13} className="text-emerald-500" />
          : <TrendingDown size={13} className="text-red-500" />
        }
        <p className="text-xs text-slate-400">All time</p>
      </div>
    </div>
  )
}

export default StatsCard