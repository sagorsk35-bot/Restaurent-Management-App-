'use client'

import { motion } from 'framer-motion'
import { cn, formatCurrency } from '@/lib/utils'
import { GlassCard } from './glass-card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  iconColor?: string
  isCurrency?: boolean
  trend?: 'up' | 'down' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: {
    card: 'p-4',
    title: 'text-xs',
    value: 'text-xl',
    icon: 'h-8 w-8',
  },
  md: {
    card: 'p-5',
    title: 'text-sm',
    value: 'text-2xl',
    icon: 'h-10 w-10',
  },
  lg: {
    card: 'p-6',
    title: 'text-sm',
    value: 'text-3xl',
    icon: 'h-12 w-12',
  },
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  prefix,
  suffix,
  icon,
  iconColor = 'bg-primary-500/20 text-primary-400',
  isCurrency = false,
  trend,
  size = 'md',
  className,
}: StatsCardProps) {
  const styles = sizeStyles[size]

  const displayValue = isCurrency && typeof value === 'number'
    ? formatCurrency(value)
    : value

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <GlassCard padding="none" className={cn(styles.card, className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn('text-white/60', styles.title)}>{title}</p>

          <motion.div
            className={cn('mt-2 font-bold text-white', styles.value)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {prefix}
            {displayValue}
            {suffix}
          </motion.div>

          {(change !== undefined || changeLabel) && (
            <div className="mt-2 flex items-center gap-1.5">
              {change !== undefined && (
                <div
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    change > 0 ? 'text-success' : change < 0 ? 'text-danger' : 'text-white/40'
                  )}
                >
                  <TrendIcon className="h-3 w-3" />
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
              {changeLabel && (
                <span className="text-xs text-white/40">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              'flex items-center justify-center rounded-xl',
              styles.icon,
              iconColor
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

// Mini Stats Row
interface MiniStatsProps {
  stats: {
    label: string
    value: string | number
    color?: string
  }[]
  className?: string
}

export function MiniStats({ stats, className }: MiniStatsProps) {
  return (
    <div className={cn('flex items-center gap-6', className)}>
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2">
          {stat.color && (
            <div
              className={cn('h-2 w-2 rounded-full', stat.color)}
            />
          )}
          <span className="text-sm text-white/60">{stat.label}</span>
          <span className="font-semibold text-white">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}
