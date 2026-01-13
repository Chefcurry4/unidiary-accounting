import { GlassCard } from './GlassCard'
import { Budget, Expense } from '@/lib/types'
import { formatCurrency, calculateBudgetProgress } from '@/lib/expense-utils'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { Warning } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface BudgetOverviewProps {
  budgets: Budget[]
  expenses: Expense[]
}

export function BudgetOverview({ budgets, expenses }: BudgetOverviewProps) {
  if (budgets.length === 0) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Budget Tracking</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No budgets set yet</p>
          <p className="text-sm text-muted-foreground mt-1">Set a budget to track your spending</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Budget Tracking</h3>
      <div className="space-y-6">
        {budgets.map((budget, index) => {
          const progress = calculateBudgetProgress(expenses, budget)
          const isWarning = progress >= 80 && progress < 100
          const isExceeded = progress >= 100

          let categoryExpenses = expenses
          if (budget.category !== 'total') {
            categoryExpenses = expenses.filter(e => e.category === budget.category)
          }
          
          const spent = budget.period === 'monthly' 
            ? categoryExpenses.filter(e => {
                const expenseDate = new Date(e.date)
                const now = new Date()
                return expenseDate.getMonth() === now.getMonth() && 
                       expenseDate.getFullYear() === now.getFullYear()
              }).reduce((sum, e) => sum + e.amount, 0)
            : categoryExpenses.reduce((sum, e) => sum + e.amount, 0)

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground capitalize">
                    {budget.category} Budget
                  </p>
                  {isExceeded && (
                    <Warning className="text-destructive" weight="fill" />
                  )}
                  {isWarning && !isExceeded && (
                    <Warning className="text-warning" weight="fill" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {budget.period === 'monthly' ? 'Monthly' : 'Yearly'}
                </p>
              </div>
              
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(spent)} spent
                </p>
                <p className="text-sm font-medium text-foreground tabular-nums">
                  {formatCurrency(budget.amount - spent)} remaining
                </p>
              </div>

              <div className="relative">
                <Progress 
                  value={Math.min(progress, 100)} 
                  className="h-2"
                />
                <div 
                  className={cn(
                    "absolute top-0 left-0 h-2 rounded-full transition-all",
                    isExceeded 
                      ? 'bg-destructive' 
                      : isWarning 
                        ? 'bg-warning' 
                        : 'bg-primary'
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {progress.toFixed(1)}% used
                </p>
                <p className="text-xs text-muted-foreground">
                  Budget: {formatCurrency(budget.amount)}
                </p>
              </div>

              {isExceeded && (
                <div className="mt-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">
                    Budget exceeded by {formatCurrency(spent - budget.amount)}
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
