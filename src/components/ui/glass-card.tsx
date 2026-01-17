'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'solid'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  glow?: boolean
  animated?: boolean
}

const variantStyles = {
  default:
    'bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass',
  elevated:
    'bg-white/10 backdrop-blur-2xl border border-white/20 shadow-glass',
  subtle:
    'bg-white/[0.02] backdrop-blur-lg border border-white/5',
  solid:
    'bg-gray-900 border border-white/10',
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      glow = false,
      animated = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'rounded-2xl transition-all duration-300',
      variantStyles[variant],
      paddingStyles[padding],
      hover && 'hover:bg-white/10 hover:border-white/20 hover:shadow-glow-sm cursor-pointer',
      glow && 'shadow-glow',
      className
    )

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          whileHover={hover ? { scale: 1.02 } : undefined}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
