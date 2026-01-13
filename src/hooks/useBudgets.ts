import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Budget } from '../lib/types'

export function useBudgets(userId?: string) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('budgets')
        .select('*')
        .order('createdAt', { ascending: false })

      // Filter by user_id if RLS is enabled and userId is provided
      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      setBudgets(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching budgets:', err)
    } finally {
      setLoading(false)
    }
  }

  const addBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    try {
      const budgetData = userId ? { ...budget, user_id: userId } : budget
      const { data, error } = await supabase
        .from('budgets')
        .insert([budgetData])
        .select()

      if (error) throw error
      if (data) {
        setBudgets((current) => [...data, ...current])
      }
      return data?.[0]
    } catch (err) {
      setError(err as Error)
      console.error('Error adding budget:', err)
      throw err
    }
  }

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data) {
        setBudgets((current) =>
          current.map((budget) => (budget.id === id ? data[0] : budget))
        )
      }
      return data?.[0]
    } catch (err) {
      setError(err as Error)
      console.error('Error updating budget:', err)
      throw err
    }
  }

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)

      if (error) throw error
      setBudgets((current) => current.filter((budget) => budget.id !== id))
    } catch (err) {
      setError(err as Error)
      console.error('Error deleting budget:', err)
      throw err
    }
  }

  useEffect(() => {
    if (userId) {
      fetchBudgets()
    }
  }, [userId])

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  }
}
