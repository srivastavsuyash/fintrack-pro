import { useState, useEffect } from 'react'
import { getSummary } from '../services/transactionService.js'
import { useCurrency } from '../context/CurrencyContext.jsx'
import AreaChartComponent from '../charts/AreaChart.jsx'
import PieChartComponent from '../charts/PieChart.jsx'
import BarChartComponent from '../charts/BarChart.jsx'

const Analytics = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const { formatAmount } = useCurrency()

  useEffect(() => {
    getSummary().then(setSummary).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    </div>
  )

  const categoryData = summary?.categoryBreakdown || {}
  const topCategory = Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Visual breakdown of your finances</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Income</p>
          <p className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400">
            {formatAmount(summary?.totalIncome || 0)}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Expense</p>
          <p className="text-2xl font-display font-bold text-red-600 dark:text-red-400">
            {formatAmount(summary?.totalExpense || 0)}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Top Spending</p>
          <p className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400">
            {topCategory ? topCategory[0] : 'N/A'}
          </p>
          {topCategory && (
            <p className="text-xs text-slate-400 mt-1">{formatAmount(topCategory[1])}</p>
          )}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">
            Monthly Income vs Expense
          </h3>
          <AreaChartComponent data={summary?.monthlySummary || []} />
        </div>
        <div className="card">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">
            Monthly Bar Chart
          </h3>
          <BarChartComponent data={summary?.monthlySummary || []} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">
            Expense by Category
          </h3>
          <PieChartComponent data={categoryData} />
        </div>

        {/* Category Breakdown Table */}
        <div className="card">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">
            Category Breakdown
          </h3>
          {Object.keys(categoryData).length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No expense data yet</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryData)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => {
                  const total = summary?.totalExpense || 1
                  const pct = ((amt / total) * 100).toFixed(1)
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{cat}</span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {formatAmount(amt)} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics