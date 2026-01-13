import { useState } from 'react'
import { GrainyBackground } from './components/GrainyBackground'
import { HomePage } from './components/HomePage'
import { ProfilePage } from './components/ProfilePage'
import { LoginPage } from './components/LoginPage'
import { HamburgerMenu } from './components/HamburgerMenu'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import { motion } from 'framer-motion'

function AppContent() {
  const { user, isLoading, login } = useAuth()
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground bg-background">
        <GrainyBackground />
        <div className="relative z-10">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <GrainyBackground />
        <LoginPage onLogin={login} />
      </>
    )
  }

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
