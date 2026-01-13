import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface ProfileData {
  bio: string
  location: string
  company: string
  phone: string
}

export function useProfile(userId?: string) {
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    location: '',
    company: '',
    phone: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('userId', id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error
      }
      
      if (data) {
        setProfileData(data)
      }
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (id: string, updates: Partial<ProfileData>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ userId: id, ...updates })
        .select()

      if (error) throw error
      if (data && data[0]) {
        setProfileData(data[0])
      }
      return data?.[0]
    } catch (err) {
      setError(err as Error)
      console.error('Error updating profile:', err)
      throw err
    }
  }

  useEffect(() => {
    if (userId) {
      fetchProfile(userId)
    }
  }, [userId])

  return {
    profileData,
    loading,
    error,
    fetchProfile,
    updateProfile,
  }
}
