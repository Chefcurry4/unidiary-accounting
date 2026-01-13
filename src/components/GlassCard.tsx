import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: 'none' | 'red' | 'warning'
}

export function GlassCard({ children, className, hover = false, glow = 'none' }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-lg',
        hover && 'glass-card-hover',
        glow === 'red' && 'glow-red',
        className
      )}
    >
      {children}
    </div>
  )
}
