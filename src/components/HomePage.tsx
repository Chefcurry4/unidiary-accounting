import { useState, useEffect } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { useBudgets } from '../hooks/useBudgets'
import { StatsOverview } from './StatsOverview'
import { UpcomingExpensesWidget } from './UpcomingExpensesWidget'
import { CategoryChart, MonthlyTrendsChart, BudgetComparisonChart } from './Charts'
import { ExpenseList } from './ExpenseList'
import { BudgetOverview } from './BudgetOverview'
import { ExpenseForm, ExpenseFormData } from './ExpenseForm'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Expense } from '../lib/types'
import { isSupabaseConfigured } from '../lib/supabase'
import { 
  calculateCategoryStats, 
  filterExpensesByMonth, 
  calculateMonthlyTrends,
  getUpcomingExpenses
} from '../lib/expense-utils'
import { Plus, ChartBar, Warning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export function HomePage() {
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses()
  const { budgets } = useBudgets()
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      toast.warning(
        'Supabase not configured. Please update .env with your Supabase credentials.',
        { duration: 5000 }
      )
    }
  }, [])

  const handleAddExpense = async (formData: ExpenseFormData) => {
    try {
      const newExpense: Omit<Expense, 'id' | 'createdAt'> = {
        amount: formData.amount,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        isRecurring: formData.isRecurring,
        recurrenceInterval: formData.recurrenceInterval,
        nextDueDate: formData.nextDueDate,
        isPaid: false,
      }

      await addExpense(newExpense)
      toast.success('Expense added successfully!')
    } catch (error) {
      toast.error('Failed to add expense')
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id)
      toast.success('Expense deleted')
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const handleMarkPaid = async (id: string) => {
    try {
      await updateExpense(id, { isPaid: true })
      toast.success('Expense marked as paid')
    } catch (error) {
      toast.error('Failed to update expense')
    }
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
        {!isSupabaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3"
          >
            <Warning className="text-warning mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-warning mb-1">Database Not Connected</h3>
              <p className="text-sm text-foreground/80">
                Supabase is not properly configured. Please update your <code className="bg-background/50 px-1 rounded">.env</code> file with valid Supabase credentials.
                Data will not be persisted until the connection is established.
              </p>
            </div>
          </motion.div>
        )}
        
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
