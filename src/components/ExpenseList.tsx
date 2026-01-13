import { GlassCard } from './GlassCard'
import { motion } from 'framer-motion'
import { Expense } from '@/lib/types'
import { formatCurrency } from '@/lib/expense-utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash, ArrowsClockwise } from '@phosphor-icons/react'
import { format, parseISO } from 'date-fns'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <GlassCard className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No expenses recorded yet</p>
          <p className="text-sm text-muted-foreground">Click "Add Expense" to get started</p>
        </div>
      </GlassCard>
    )
  }

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Expenses</h3>
      <div className="space-y-3">
        {sortedExpenses.slice(0, 10).map((expense, index) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
          >
            <GlassCard className="p-4" hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-medium text-foreground truncate">
                      {expense.description || 'Untitled'}
                    </p>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      {expense.category}
                    </Badge>
                    {expense.isRecurring && (
                      <Badge variant="outline" className="border-primary text-primary">
                        <ArrowsClockwise className="mr-1" />
                        {expense.recurrenceInterval}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(expense.date), 'MMM d, yyyy')}
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-1 tabular-nums">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(expense.id)}
                  className="shrink-0"
                >
                  <Trash />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      {expenses.length > 10 && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Showing 10 of {expenses.length} expenses
        </p>
      )}
    </GlassCard>
  )
}
