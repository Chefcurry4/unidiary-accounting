import { useState } from 'react'
import { GrainyBackground } from './components/GrainyBackground'
import { HomePage } from './components/HomePage'
import { ProfilePage } from './components/ProfilePage'
import { AuthPage } from './components/AuthPage'
import { HamburgerMenu } from './components/HamburgerMenu'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from './components/ui/button'
import { SignOut, Warning } from '@phosphor-icons/react'

function ConfigurationError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <Warning size={64} className="mx-auto text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Configuration Required</h1>
        <p className="text-muted-foreground mb-6">
          The application is missing required Supabase configuration. Please configure the following environment variables in Netlify:
        </p>
        <div className="bg-muted rounded-lg p-4 text-left mb-6">
          <code className="text-sm">
            <div className="mb-2"><span className="text-yellow-500">VITE_SUPABASE_URL</span>=your-project-url</div>
            <div><span className="text-yellow-500">VITE_SUPABASE_ANON_KEY</span>=your-anon-key</div>
          </code>
        </div>
        <p className="text-sm text-muted-foreground">
          You can find these values in your Supabase project settings under API.
        </p>
      </div>
    </div>
  )
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home')
  const { user, loading, signOut, configError } = useAuth()

  // Show configuration error if Supabase is not configured
  if (configError) {
    return <ConfigurationError />
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        <div className="text-center">
          <div className="text-2xl mb-2">Loading...</div>
          <div className="text-muted-foreground">Checking authentication</div>
        </div>
      </div>
    )
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />
  }

  // Show main app if logged in
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
              <div className="flex items-center gap-4">
                <HamburgerMenu currentPage={currentPage} onNavigate={setCurrentPage} />
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    UniDiary Accounting
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Expense Management for Startups
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <SignOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.header>

        <main>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'profile' && <ProfilePage />}
        </main>

        <footer className="border-t border-border backdrop-blur-sm bg-background/50 mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              UniDiary Accounting © {new Date().getFullYear()} - Built for Startups
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
