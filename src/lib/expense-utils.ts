import { Expense, CategoryStat, MonthlyTrend, Budget, UpcomingExpense, UrgencyLevel, ExpenseCategory } from './types'
import { format, startOfMonth, endOfMonth, isAfter, isBefore, differenceInDays, addMonths, parseISO } from 'date-fns'

export function calculateCategoryStats(expenses: Expense[]): CategoryStat[] {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const categoryMap = new Map<ExpenseCategory, { total: number; count: number }>()

  expenses.forEach((expense) => {
    const current = categoryMap.get(expense.category) || { total: 0, count: 0 }
    categoryMap.set(expense.category, {
      total: current.total + expense.amount,
      count: current.count + 1
    })
  })

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    total: data.total,
    count: data.count,
    percentage: total > 0 ? (data.total / total) * 100 : 0
  })).sort((a, b) => b.total - a.total)
}

export function filterExpensesByMonth(expenses: Expense[], date: Date): Expense[] {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date)
    return !isBefore(expenseDate, start) && !isAfter(expenseDate, end)
  })
}

export function calculateMonthlyTrends(expenses: Expense[], budgets: Budget[], monthsBack: number = 6): MonthlyTrend[] {
  const trends: MonthlyTrend[] = []
  const now = new Date()
  
  for (let i = monthsBack - 1; i >= 0; i--) {
    const month = addMonths(now, -i)
    const monthExpenses = filterExpensesByMonth(expenses, month)
    const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    
    const monthlyBudget = budgets.find(b => b.period === 'monthly')
    
    trends.push({
      month: format(month, 'MMM'),
      amount: monthTotal,
      budget: monthlyBudget?.amount || 0
    })
  }
  
  return trends
}

export function getUpcomingExpenses(expenses: Expense[]): UpcomingExpense[] {
  const now = new Date()
  
  const upcoming = expenses
    .filter(expense => expense.isRecurring && expense.nextDueDate && !expense.isPaid)
    .map(expense => {
      const dueDate = parseISO(expense.nextDueDate!)
      const daysUntilDue = differenceInDays(dueDate, now)
      
      let urgency: UrgencyLevel
      if (daysUntilDue < 0) {
        urgency = 'overdue'
      } else if (daysUntilDue <= 3) {
        urgency = 'urgent'
      } else {
        urgency = 'upcoming'
      }
      
      return {
        ...expense,
        daysUntilDue,
        urgency
      }
    })
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
  
  return upcoming
}

export function calculateBudgetProgress(expenses: Expense[], budget: Budget): number {
  let relevantExpenses = expenses
  
  if (budget.category !== 'total') {
    relevantExpenses = expenses.filter(e => e.category === budget.category)
  }
  
  if (budget.period === 'monthly') {
    relevantExpenses = filterExpensesByMonth(relevantExpenses, new Date())
  }
  
  const spent = relevantExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  return budget.amount > 0 ? (spent / budget.amount) * 100 : 0
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function getUrgencyColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case 'overdue':
      return 'bg-destructive text-destructive-foreground'
    case 'urgent':
      return 'bg-warning text-foreground'
    case 'upcoming':
      return 'bg-success text-foreground'
  }
}

export function getUrgencyLabel(expense: UpcomingExpense): string {
  if (expense.urgency === 'overdue') {
    return `${Math.abs(expense.daysUntilDue)} days overdue`
  } else if (expense.urgency === 'urgent') {
    return `Due in ${expense.daysUntilDue} days`
  } else {
    return `Due in ${expense.daysUntilDue} days`
  }
}
