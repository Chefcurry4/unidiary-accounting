import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { StatsOverview } from './StatsOverview'
import { UpcomingExpensesWidget } from './UpcomingExpensesWidget'
import { CategoryChart, MonthlyTrendsChart, BudgetComparisonChart } from './Charts'
import { ExpenseList } from './ExpenseList'
import { BudgetOverview } from './BudgetOverview'
import { ExpenseForm, ExpenseFormData } from './ExpenseForm'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Expense, Budget } from '../lib/types'
import { 
  calculateCategoryStats, 
  filterExpensesByMonth, 
  calculateMonthlyTrends,
  getUpcomingExpenses
} from '../lib/expense-utils'
import { Plus, ChartBar } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export function HomePage() {
  const [expenses, setExpenses] = useKV<Expense[]>('expenses', [])
  const [budgets, setBudgets] = useKV<Budget[]>('budgets', [])
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)

  const handleAddExpense = (formData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      amount: formData.amount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      isRecurring: formData.isRecurring,
      recurrenceInterval: formData.recurrenceInterval,
      nextDueDate: formData.nextDueDate,
      isPaid: false,
      createdAt: new Date().toISOString()
    }

    setExpenses((current) => [...(current || []), newExpense])
    toast.success('Expense added successfully!')
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses((current) => (current || []).filter(e => e.id !== id))
    toast.success('Expense deleted')
  }

  const handleMarkPaid = (id: string) => {
    setExpenses((current) => 
      (current || []).map(e => e.id === id ? { ...e, isPaid: true } : e)
    )
    toast.success('Expense marked as paid')
  }

  const currentMonthExpenses = filterExpensesByMonth(expenses || [], new Date())
  const totalExpenses = (expenses || []).reduce((sum, e) => sum + e.amount, 0)
  const monthlyTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
  
  const monthlyBudget = (budgets || []).find(b => b.period === 'monthly' && b.category === 'total')
  const remainingBudget = monthlyBudget ? monthlyBudget.amount - monthlyTotal : 0
  
  const categoryStats = calculateCategoryStats(currentMonthExpenses)
  const monthlyTrends = calculateMonthlyTrends(expenses || [], budgets || [], 6)
  const upcomingExpenses = getUpcomingExpenses(expenses || [])

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track your expenses and manage your budget
            </p>
          </div>
          <Button onClick={() => setIsExpenseFormOpen(true)} size="lg">
            <Plus className="mr-2" />
            Add Expense
          </Button>
        </div>

        <StatsOverview
          totalExpenses={totalExpenses}
          monthlyExpenses={monthlyTotal}
          remainingBudget={remainingBudget}
          upcomingCount={upcomingExpenses.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UpcomingExpensesWidget
              expenses={upcomingExpenses}
              onMarkPaid={handleMarkPaid}
            />
          </div>
          <div>
            <BudgetOverview budgets={budgets || []} expenses={expenses || []} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart data={categoryStats} />
          <MonthlyTrendsChart data={monthlyTrends} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetComparisonChart data={monthlyTrends} />
          </div>
          <div className="flex items-center justify-center">
            <motion.div
              className="text-center p-8 glass-card rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <ChartBar className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Financial Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your spending patterns and stay within budget
              </p>
            </motion.div>
          </div>
        </div>

        <ExpenseList expenses={expenses || []} onDelete={handleDeleteExpense} />
      </div>

      <ExpenseForm
        open={isExpenseFormOpen}
        onClose={() => setIsExpenseFormOpen(false)}
        onSubmit={handleAddExpense}
      />
    </>
  )
}
