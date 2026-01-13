import { GlassCard } from './GlassCard'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/expense-utils'
import { Wallet, TrendUp, ChartBar, Calendar } from '@phosphor-icons/react'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: 'wallet' | 'trending' | 'chart' | 'calendar'
  index: number
}

function StatCard({ title, value, subtitle, icon, index }: StatCardProps) {
  const icons = {
    wallet: <Wallet className="text-primary" />,
    trending: <TrendUp className="text-success" />,
    chart: <ChartBar className="text-warning" />,
    calendar: <Calendar className="text-accent" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <GlassCard className="p-6" hover>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="ml-4">
            {icons[icon]}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

interface StatsOverviewProps {
  totalExpenses: number
  monthlyExpenses: number
  remainingBudget: number
  upcomingCount: number
}

export function StatsOverview({ totalExpenses, monthlyExpenses, remainingBudget, upcomingCount }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Monthly Expenses"
        value={formatCurrency(monthlyExpenses)}
        subtitle="Current month"
        icon="wallet"
        index={0}
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        subtitle="All time"
        icon="trending"
        index={1}
      />
      <StatCard
        title="Remaining Budget"
        value={formatCurrency(remainingBudget)}
        subtitle="This month"
        icon="chart"
        index={2}
      />
      <StatCard
        title="Upcoming Payments"
        value={upcomingCount.toString()}
        subtitle="Scheduled expenses"
        icon="calendar"
        index={3}
      />
    </div>
  )
}
