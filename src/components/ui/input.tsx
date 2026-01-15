'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'glass'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      variant = 'default',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const variantStyles = {
      default:
        'bg-surface-elevated border-white/10 focus:border-primary-500 focus:ring-primary-500/20',
      glass:
        'bg-white/5 backdrop-blur-xl border-white/10 focus:border-white/30 focus:ring-white/10',
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'h-10 w-full rounded-xl border px-3 text-sm text-white placeholder:text-white/40',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              variantStyles[variant],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/40">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-danger">{error}</p>
        )}

        {hint && !error && (
          <p className="mt-1.5 text-sm text-white/50">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea variant
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  variant?: 'default' | 'glass'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, variant = 'default', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const variantStyles = {
      default:
        'bg-surface-elevated border-white/10 focus:border-primary-500 focus:ring-primary-500/20',
      glass:
        'bg-white/5 backdrop-blur-xl border-white/10 focus:border-white/30 focus:ring-white/10',
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'min-h-[100px] w-full rounded-xl border px-3 py-2 text-sm text-white placeholder:text-white/40',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none',
            variantStyles[variant],
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-sm text-danger">{error}</p>
        )}

        {hint && !error && (
          <p className="mt-1.5 text-sm text-white/50">{hint}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
