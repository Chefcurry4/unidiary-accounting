export type ExpenseCategory = 
  | 'Software'
  | 'Marketing'
  | 'Salaries'
  | 'Office'
  | 'Travel'
  | 'Equipment'
  | 'Utilities'
  | 'Other'

export type RecurrenceInterval = 'weekly' | 'monthly' | 'yearly' | 'none'

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string
  isRecurring: boolean
  recurrenceInterval: RecurrenceInterval
  nextDueDate?: string
  isPaid?: boolean
  createdAt: string
}

export interface Budget {
  id: string
  category: ExpenseCategory | 'total'
  amount: number
  period: 'monthly' | 'yearly'
  startDate: string
  createdAt: string
}

export interface CategoryStat {
  category: ExpenseCategory
  total: number
  count: number
  percentage: number
}

export interface MonthlyTrend {
  month: string
  amount: number
  budget: number
}

export type UrgencyLevel = 'overdue' | 'urgent' | 'upcoming'

export interface UpcomingExpense extends Expense {
  daysUntilDue: number
  urgency: UrgencyLevel
}
