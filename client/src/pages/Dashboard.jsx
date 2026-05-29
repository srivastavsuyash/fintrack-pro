import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'
import { getSummary } from '../services/transactionService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import StatsCard from '../components/dashboard/StatsCard.jsx'
import BudgetWarning from '../components/dashboard/BudgetWarning.jsx'
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx'
import AreaChartComponent from '../charts/AreaChart.jsx'
import PieChartComponent from '../charts/PieChart.jsx'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { formatAmount } = useCurrency()

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getSummary()
        setSummary(data)
      } catch (error) {
        console.error('Failed to fetch summary:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-6 text-white">
        <p className="text-primary-100 text-sm font-medium">Good day,</p>
        <h1 className="font-display text-2xl font-bold mt-0.5">
          {user?.name} 👋
        </h1>
        <p className="text-primary-200 text-sm mt-1">
          Here's your financial overview
        </p>
      </div>

      {/* Budget Warning */}
      {user?.budgetLimit > 0 && (
        <BudgetWarning
          totalExpense={summary?.totalExpense || 0}
          budgetLimit={user?.budgetLimit}
          formatAmount={formatAmount}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Balance"
          amount={summary?.balance || 0}
          icon={Wallet}
          type="balance"
          formatAmount={formatAmount}
        />
        <StatsCard
          title="Total Income"
          amount={summary?.totalIncome || 0}
          icon={TrendingUp}
          type="income"
          formatAmount={formatAmount}
        />
        <StatsCard
          title="Total Expense"
          amount={summary?.totalExpense || 0}
          icon={TrendingDown}
          type="expense"
          formatAmount={formatAmount}
        />
        <StatsCard
          title="Net Savings"
          amount={(summary?.totalIncome || 0) - (summary?.totalExpense || 0)}
          icon={PiggyBank}
          type="savings"
          formatAmount={formatAmount}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Area Chart */}
        <div className="card">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">
            Monthly Overview
          </h3>
          <AreaChartComponent data={summary?.monthlySummary || []} />
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white mb-4">
            Expense by Category
          </h3>
          <PieChartComponent data={summary?.categoryBreakdown || {}} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={summary?.recentTransactions || []}
        formatAmount={formatAmount}
      />
    </div>
  )
}

export default Dashboard