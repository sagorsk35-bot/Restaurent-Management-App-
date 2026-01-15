'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
  variant?: 'default' | 'glass'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      placeholder,
      variant = 'default',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

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
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-10 w-full appearance-none rounded-xl border px-3 pr-10 text-sm text-white',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              variantStyles[variant],
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-white/40">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-surface-elevated text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white/40">
            <ChevronDown className="h-4 w-4" />
          </div>
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

Select.displayName = 'Select'
