import { AlertTriangle } from 'lucide-react'

const BudgetWarning = ({ totalExpense, budgetLimit, formatAmount }) => {
  if (!budgetLimit || budgetLimit === 0) return null
  const percentage = (totalExpense / budgetLimit) * 100
  if (percentage < 80) return null
  const isExceeded = percentage >= 100

  return (
    <div className={`rounded-2xl p-4 flex items-start gap-3 ${
      isExceeded
        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
    }`}>
      <AlertTriangle size={20} className={isExceeded ? 'text-red-500 mt-0.5' : 'text-yellow-500 mt-0.5'} />
      <div>
        <p className={`font-semibold text-sm ${isExceeded ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
          {isExceeded ? '🚨 Budget Exceeded!' : '⚠️ Budget Warning!'}
        </p>
        <p className={`text-xs mt-0.5 ${isExceeded ? 'text-red-600 dark:text-red-300' : 'text-yellow-600 dark:text-yellow-300'}`}>
          You spent {formatAmount(totalExpense)} of {formatAmount(budgetLimit)} ({percentage.toFixed(0)}%)
        </p>
        <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden w-48">
          <div className={`h-full rounded-full ${isExceeded ? 'bg-red-500' : 'bg-yellow-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </div>
    </div>
  )
}

export default BudgetWarning