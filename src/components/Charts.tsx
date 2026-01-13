import { GlassCard } from './GlassCard'
import { CategoryStat, MonthlyTrend } from '@/lib/types'
import { formatCurrency } from '@/lib/expense-utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'

const CATEGORY_COLORS = [
  '#667eea',
  '#764ba2',
  '#fa709a',
  '#43e97b',
  '#2980b9',
  '#f093fb',
  '#4facfe',
  '#f39c12'
]

interface CategoryChartProps {
  data: CategoryStat[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Spending by Category</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.category}: ${entry.percentage.toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="total"
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as CategoryStat
                return (
                  <GlassCard className="p-3">
                    <p className="text-sm font-medium text-foreground">{data.category}</p>
                    <p className="text-lg font-semibold text-primary tabular-nums">{formatCurrency(data.total)}</p>
                    <p className="text-xs text-muted-foreground">{data.count} transactions</p>
                  </GlassCard>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}

interface MonthlyTrendsChartProps {
  data: MonthlyTrend[]
}

export function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(224, 212, 252, 0.1)" />
          <XAxis dataKey="month" stroke="rgba(224, 212, 252, 0.6)" />
          <YAxis stroke="rgba(224, 212, 252, 0.6)" tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <GlassCard className="p-3">
                    <p className="text-sm font-medium text-foreground mb-2">{payload[0].payload.month}</p>
                    <p className="text-sm text-primary">Spent: {formatCurrency(payload[0].value as number)}</p>
                    {payload[1] && (
                      <p className="text-sm text-muted-foreground">Budget: {formatCurrency(payload[1].value as number)}</p>
                    )}
                  </GlassCard>
                )
              }
              return null
            }}
          />
          <Bar dataKey="amount" fill="#667eea" animationDuration={800} />
          <Bar dataKey="budget" fill="rgba(224, 212, 252, 0.3)" animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}

interface BudgetComparisonChartProps {
  data: MonthlyTrend[]
}

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Budget vs Actual</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(224, 212, 252, 0.1)" />
          <XAxis dataKey="month" stroke="rgba(224, 212, 252, 0.6)" />
          <YAxis stroke="rgba(224, 212, 252, 0.6)" tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <GlassCard className="p-3">
                    <p className="text-sm font-medium text-foreground mb-2">{payload[0].payload.month}</p>
                    <p className="text-sm text-primary">Spent: {formatCurrency(payload[0].value as number)}</p>
                    {payload[1] && (
                      <p className="text-sm text-success">Budget: {formatCurrency(payload[1].value as number)}</p>
                    )}
                  </GlassCard>
                )
              }
              return null
            }}
          />
          <Line type="monotone" dataKey="amount" stroke="#667eea" strokeWidth={2} dot={{ fill: '#667eea' }} animationDuration={800} />
          <Line type="monotone" dataKey="budget" stroke="#43e97b" strokeWidth={2} dot={{ fill: '#43e97b' }} strokeDasharray="5 5" animationDuration={800} />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
