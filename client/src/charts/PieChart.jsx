import {
  PieChart as RechartsPie, Pie, Cell,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useCurrency } from '../context/CurrencyContext.jsx'

const COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6',
  '#f97316', '#84cc16'
]

const PieChartComponent = ({ data }) => {
  const { formatAmount } = useCurrency()

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-slate-400 text-sm">No data available</p>
      </div>
    )
  }

  const chartData = Object.entries(data).map(([name, value]) => ({
    name, value: Number(value.toFixed(2))
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsPie>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatAmount(value), 'Amount']}
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
      </RechartsPie>
    </ResponsiveContainer>
  )
}

export default PieChartComponent