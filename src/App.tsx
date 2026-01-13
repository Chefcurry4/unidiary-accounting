import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { GrainyBackground } from './components/GrainyBackground'
import { StatsOverview } from './components/StatsOverview'
import { UpcomingExpensesWidget } from './components/UpcomingExpensesWidget'
import { CategoryChart, MonthlyTrendsChart, BudgetComparisonChart } from './components/Charts'
import { ExpenseList } from './components/ExpenseList'
import { BudgetOverview } from './components/BudgetOverview'
import { ExpenseForm, ExpenseFormData } from './components/ExpenseForm'
import { Button } from './components/ui/button'
import { Toaster, toast } from 'sonner'
import { Expense, Budget } from './lib/types'
import { 
  calculateCategoryStats, 
  filterExpensesByMonth, 
  calculateMonthlyTrends,
  getUpcomingExpenses
} from './lib/expense-utils'
import { Plus, ChartBar } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

function App() {
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
    <div className="min-h-screen text-foreground">
      <GrainyBackground />
      <Toaster position="top-right" theme="dark" />
      
      <div className="relative z-10">
        <motion.header 
          className="border-b border-border backdrop-blur-sm bg-background/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  UniDiary Accounting
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Expense Management for Startups
                </p>
              </div>
              <Button onClick={() => setIsExpenseFormOpen(true)} size="lg">
                <Plus className="mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </motion.header>

        <main className="container mx-auto px-4 py-8 space-y-8">
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
        </main>

        <footer className="border-t border-border backdrop-blur-sm bg-background/50 mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              UniDiary Accounting © {new Date().getFullYear()} - Built for Startups
            </p>
          </div>
        </footer>
      </div>

      <ExpenseForm
        open={isExpenseFormOpen}
        onClose={() => setIsExpenseFormOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  )
}

export default App
