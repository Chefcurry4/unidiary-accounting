import { GlassCard } from './GlassCard'
import { motion } from 'framer-motion'
import { UpcomingExpense } from '@/lib/types'
import { formatCurrency, getUrgencyColor, getUrgencyLabel } from '@/lib/expense-utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Clock } from '@phosphor-icons/react'
import { format, parseISO } from 'date-fns'

interface UpcomingExpensesWidgetProps {
  expenses: UpcomingExpense[]
  onMarkPaid: (id: string) => void
}

export function UpcomingExpensesWidget({ expenses, onMarkPaid }: UpcomingExpensesWidgetProps) {
  if (expenses.length === 0) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock />
          Upcoming Expenses
        </h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No upcoming expenses scheduled</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock />
        Upcoming Expenses
      </h3>
      <div className="space-y-3">
        {expenses.slice(0, 5).map((expense, index) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <GlassCard
              className="p-4"
              hover
              glow={expense.urgency === 'overdue' ? 'red' : 'none'}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">
                      {expense.description || expense.category}
                    </p>
                    <Badge className={getUrgencyColor(expense.urgency)} variant="secondary">
                      {getUrgencyLabel(expense)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due: {format(parseISO(expense.nextDueDate!), 'MMM d, yyyy')}
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-1 tabular-nums">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onMarkPaid(expense.id)}
                  className="shrink-0"
                >
                  <Check />
                  Mark Paid
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
