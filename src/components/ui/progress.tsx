'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
  animated?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const variantStyles = {
  default: 'bg-primary-500',
  gradient: 'bg-gradient-to-r from-primary-500 to-pink-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = true,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-white/70">{label}</span>
          {showLabel && (
            <span className="font-medium text-white">{Math.round(percentage)}%</span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-white/10',
          sizeStyles[size]
        )}
      >
        {animated ? (
          <motion.div
            className={cn('h-full rounded-full', variantStyles[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full', variantStyles[variant])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  )
}

// Order Progress Steps
interface OrderProgressProps {
  currentStatus: string
  className?: string
}

const orderSteps = [
  { status: 'pending', label: 'Placed', icon: '📝' },
  { status: 'confirmed', label: 'Confirmed', icon: '✓' },
  { status: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { status: 'ready_for_pickup', label: 'Ready', icon: '📦' },
  { status: 'picked_up', label: 'Picked Up', icon: '🚴' },
  { status: 'in_transit', label: 'On the Way', icon: '🛵' },
  { status: 'delivered', label: 'Delivered', icon: '🎉' },
]

export function OrderProgress({ currentStatus, className }: OrderProgressProps) {
  const currentIndex = orderSteps.findIndex(
    (step) => step.status === currentStatus
  )

  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-0 top-4 h-0.5 w-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (orderSteps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {orderSteps.map((step, index) => {
            const isCompleted = index <= currentIndex
            const isCurrent = index === currentIndex

            return (
              <div key={step.status} className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm',
                    isCompleted
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-elevated text-white/40 ring-2 ring-white/10'
                  )}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    opacity: 1,
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  {step.icon}
                </motion.div>
                <span
                  className={cn(
                    'mt-2 text-xs',
                    isCompleted ? 'text-white' : 'text-white/40'
                  )}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
