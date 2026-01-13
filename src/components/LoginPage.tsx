import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import { SignIn, User } from '@phosphor-icons/react'

interface LoginPageProps {
  onLogin: () => Promise<void>
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await onLogin()
    } catch (err) {
      setError('Failed to log in. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-border/50 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/20 p-4 rounded-full border-2 border-primary/30">
                <User size={48} className="text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              UniDiary Accounting
            </h1>
            <p className="text-muted-foreground">
              Please log in to access the expense management system
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <SignIn className="mr-2" size={20} />
                  Log In with Spark
                </>
              )}
            </Button>

            {error && (
              <div className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-md border border-destructive/30">
                {error}
              </div>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              This is an internal tool. You must be authenticated to access the
              application.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
