import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Classname utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(
  amount: number,
  currency: string = 'BDT',
  locale: string = 'en-BD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format date
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

// Format time
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(date)
}

// Format distance
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

// Format duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

// Generate slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

// Calculate order progress percentage
export function getOrderProgress(
  status: string
): { percent: number; label: string } {
  const statusMap: Record<string, { percent: number; label: string }> = {
    pending: { percent: 10, label: 'Order Placed' },
    confirmed: { percent: 20, label: 'Confirmed' },
    preparing: { percent: 40, label: 'Preparing' },
    ready_for_pickup: { percent: 60, label: 'Ready' },
    picked_up: { percent: 70, label: 'Picked Up' },
    in_transit: { percent: 85, label: 'On the Way' },
    delivered: { percent: 100, label: 'Delivered' },
    cancelled: { percent: 0, label: 'Cancelled' },
    refunded: { percent: 0, label: 'Refunded' },
  }
  return statusMap[status] || { percent: 0, label: status }
}

// Get status color
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'text-yellow-500 bg-yellow-500/10',
    confirmed: 'text-blue-500 bg-blue-500/10',
    preparing: 'text-orange-500 bg-orange-500/10',
    ready_for_pickup: 'text-purple-500 bg-purple-500/10',
    picked_up: 'text-indigo-500 bg-indigo-500/10',
    in_transit: 'text-cyan-500 bg-cyan-500/10',
    delivered: 'text-green-500 bg-green-500/10',
    cancelled: 'text-red-500 bg-red-500/10',
    refunded: 'text-gray-500 bg-gray-500/10',
    approved: 'text-green-500 bg-green-500/10',
    suspended: 'text-yellow-500 bg-yellow-500/10',
    banned: 'text-red-500 bg-red-500/10',
    available: 'text-green-500 bg-green-500/10',
    busy: 'text-orange-500 bg-orange-500/10',
    offline: 'text-gray-500 bg-gray-500/10',
  }
  return colorMap[status] || 'text-gray-500 bg-gray-500/10'
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Generate random color
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone (Bangladesh format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s|-/g, ''))
}

// Format phone number
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('880')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`
  }
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

// Calculate savings
export function calculateSavings(
  originalPrice: number,
  currentPrice: number
): { amount: number; percent: number } {
  const amount = originalPrice - currentPrice
  const percent = (amount / originalPrice) * 100
  return { amount, percent: Math.round(percent) }
}

// Generate order number
export function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `FF-${dateStr}-${random}`
}
