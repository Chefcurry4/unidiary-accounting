import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Expense } from '../lib/types'

export function useExpenses(userId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('expenses')
        .select('*')
        .order('createdAt', { ascending: false })

      // Filter by user_id if RLS is enabled and userId is provided
      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      setExpenses(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const expenseData = userId ? { ...expense, user_id: userId } : expense
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()

      if (error) throw error
      if (data) {
        setExpenses((current) => [...data, ...current])
      }
      return data?.[0]
    } catch (err) {
      setError(err as Error)
      console.error('Error adding expense:', err)
      throw err
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data) {
        setExpenses((current) =>
          current.map((expense) => (expense.id === id ? data[0] : expense))
        )
      }
      return data?.[0]
    } catch (err) {
      setError(err as Error)
      console.error('Error updating expense:', err)
      throw err
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error
      setExpenses((current) => current.filter((expense) => expense.id !== id))
    } catch (err) {
      setError(err as Error)
      console.error('Error deleting expense:', err)
      throw err
    }
  }

  useEffect(() => {
    if (userId) {
      fetchExpenses()
    }
  }, [userId])

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
