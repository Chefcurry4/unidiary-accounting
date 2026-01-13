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
import { SignOut } from '@phosphor-icons/react'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home')
  const { user, loading, signOut } = useAuth()

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
