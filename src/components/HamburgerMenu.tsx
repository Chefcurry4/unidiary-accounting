import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { List, House, User } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface HamburgerMenuProps {
  currentPage: 'home' | 'profile'
  onNavigate: (page: 'home' | 'profile') => void
}

export function HamburgerMenu({ currentPage, onNavigate }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false)

  const handleNavigation = (page: 'home' | 'profile') => {
    onNavigate(page)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent/20">
          <List size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-card/95 backdrop-blur-xl border-border">
        <nav className="flex flex-col gap-2 mt-8">
          <button
            onClick={() => handleNavigation('home')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "hover:bg-accent/20 hover:scale-[1.02]",
              currentPage === 'home' 
                ? "bg-primary/20 text-primary border border-primary/30" 
                : "text-foreground"
            )}
          >
            <House size={24} weight={currentPage === 'home' ? 'fill' : 'regular'} />
            <span className="font-medium">Home</span>
          </button>
          
          <button
            onClick={() => handleNavigation('profile')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "hover:bg-accent/20 hover:scale-[1.02]",
              currentPage === 'profile' 
                ? "bg-primary/20 text-primary border border-primary/30" 
                : "text-foreground"
            )}
          >
            <User size={24} weight={currentPage === 'profile' ? 'fill' : 'regular'} />
            <span className="font-medium">Profile</span>
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
