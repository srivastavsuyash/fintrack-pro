import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useCurrency } from '../context/CurrencyContext.jsx'

const AreaChartComponent = ({ data }) => {
  const { formatAmount, currency } = useCurrency()

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-slate-400 text-sm">No data available</p>
      </div>
    )
  }

  const currencySymbol = { USD: '$', EUR: '€', INR: '₹' }[currency] || '$'

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${currencySymbol}${v}`}
        />
        <Tooltip
          formatter={(value) => [formatAmount(value)]}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {value}
            </span>
          )}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#colorIncome)"
          name="Income"
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#colorExpense)"
          name="Expense"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default AreaChartComponent