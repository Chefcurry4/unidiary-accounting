import { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { User, Envelope, Buildings, MapPin, PencilSimple, FloppyDisk } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ProfileData {
  bio: string
  location: string
  company: string
  phone: string
}

export function ProfilePage() {
  const { user } = useAuth()
  const { profileData, updateProfile } = useProfile(user?.id)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileData>(profileData || {
    bio: '',
    location: '',
    company: '',
    phone: ''
  })

  useEffect(() => {
    if (profileData) {
      setFormData(profileData)
    }
  }, [profileData])

  const handleSave = async () => {
    try {
      if (user) {
        await updateProfile(user.id, formData)
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData(profileData || {
      bio: '',
      location: '',
      company: '',
      phone: ''
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    )
  }

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-border/50 p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {displayName}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Envelope size={16} />
                  <span className="text-sm">{user.email || 'No email set'}</span>
                </div>
              </div>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <PencilSimple className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <FloppyDisk className="mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="bio" className="text-foreground mb-2 block">
                Bio
              </Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="min-h-[120px] bg-background/50 border-border text-foreground"
                />
              ) : (
                <p className="text-foreground/80 bg-background/30 rounded-lg p-4 min-h-[120px]">
                  {profileData?.bio || 'No bio added yet.'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company" className="text-foreground mb-2 flex items-center gap-2">
                  <Buildings size={16} />
                  Company
                </Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your startup name"
                    className="bg-background/50 border-border text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80 bg-background/30 rounded-lg p-3">
                    {profileData?.company || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-foreground mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Location
                </Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                    className="bg-background/50 border-border text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80 bg-background/30 rounded-lg p-3">
                    {profileData?.location || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground mb-2 flex items-center gap-2">
                  <User size={16} />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="bg-background/50 border-border text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80 bg-background/30 rounded-lg p-3">
                    {profileData?.phone || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground mb-2 block">
                  User ID
                </Label>
                <p className="text-foreground/60 bg-background/30 rounded-lg p-3 font-mono text-sm truncate">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <motion.div
          className="mt-6 glass-card rounded-lg p-6 border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">About This Profile</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This is your profile for UniDiary Accounting. Your information is securely stored 
            in Supabase and used to personalize your experience within the expense management system. 
            You can update your details anytime.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
