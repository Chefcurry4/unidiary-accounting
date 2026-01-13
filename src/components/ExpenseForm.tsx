import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ExpenseCategory, RecurrenceInterval } from '@/lib/types'
import { format } from 'date-fns'

interface ExpenseFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (expense: ExpenseFormData) => void
}

export interface ExpenseFormData {
  amount: number
  category: ExpenseCategory
  description: string
  date: string
  isRecurring: boolean
  recurrenceInterval: RecurrenceInterval
  nextDueDate?: string
}

const CATEGORIES: ExpenseCategory[] = [
  'Software',
  'Marketing',
  'Salaries',
  'Office',
  'Travel',
  'Equipment',
  'Utilities',
  'Other'
]

const INTERVALS: RecurrenceInterval[] = ['none', 'weekly', 'monthly', 'yearly']

export function ExpenseForm({ open, onClose, onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    category: 'Software',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    isRecurring: false,
    recurrenceInterval: 'none',
    nextDueDate: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
    setFormData({
      amount: 0,
      category: 'Software',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      isRecurring: false,
      recurrenceInterval: 'none',
      nextDueDate: ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] glass-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              required
              className="bg-input border-input text-foreground"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as ExpenseCategory })}>
              <SelectTrigger id="category" className="bg-input border-input text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-border">
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-foreground">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-input border-input text-foreground"
              placeholder="What was this expense for?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="bg-input border-input text-foreground"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData({ 
                ...formData, 
                isRecurring: checked,
                recurrenceInterval: checked ? 'monthly' : 'none'
              })}
            />
            <Label htmlFor="recurring" className="text-foreground">Recurring Expense</Label>
          </div>

          {formData.isRecurring && (
            <>
              <div className="space-y-2">
                <Label htmlFor="interval" className="text-foreground">Recurrence Interval</Label>
                <Select 
                  value={formData.recurrenceInterval} 
                  onValueChange={(value) => setFormData({ ...formData, recurrenceInterval: value as RecurrenceInterval })}
                >
                  <SelectTrigger id="interval" className="bg-input border-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border">
                    {INTERVALS.filter(i => i !== 'none').map(interval => (
                      <SelectItem key={interval} value={interval} className="text-foreground capitalize">{interval}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextDueDate" className="text-foreground">Next Due Date</Label>
                <Input
                  id="nextDueDate"
                  type="date"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                  required={formData.isRecurring}
                  className="bg-input border-input text-foreground"
                />
              </div>
            </>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
