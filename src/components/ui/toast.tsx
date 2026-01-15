'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useUIStore } from '@/stores'
import { cn } from '@/lib/utils'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'border-success/30 bg-success/10',
  error: 'border-danger/30 bg-danger/10',
  warning: 'border-warning/30 bg-warning/10',
  info: 'border-info/30 bg-info/10',
}

const iconStyles = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]

          return (
            <motion.div
              key={toast.id}
              className={cn(
                'flex w-80 items-start gap-3 rounded-xl border p-4 backdrop-blur-xl',
                styles[toast.type]
              )}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.3 }}
            >
              <Icon className={cn('h-5 w-5 shrink-0', iconStyles[toast.type])} />

              <div className="flex-1">
                <p className="font-medium text-white">{toast.title}</p>
                {toast.message && (
                  <p className="mt-0.5 text-sm text-white/60">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/40 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
