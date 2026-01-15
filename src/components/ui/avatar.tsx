'use client'

import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showStatus?: boolean
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizeStyles = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const statusSizes = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
}

const statusColors = {
  online: 'bg-success',
  offline: 'bg-gray-500',
  busy: 'bg-danger',
  away: 'bg-warning',
}

export function Avatar({
  src,
  alt,
  name = 'User',
  size = 'md',
  className,
  showStatus,
  status = 'offline',
}: AvatarProps) {
  const initials = getInitials(name)
  const bgColor = getAvatarColor(name)

  return (
    <div className={cn('relative inline-flex', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-full ring-2 ring-white/10',
          sizeStyles[size],
          !src && bgColor
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="font-semibold text-white">{initials}</span>
        )}
      </div>

      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-surface',
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  )
}

// Avatar Group
interface AvatarGroupProps {
  avatars: { src?: string; name: string }[]
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max)
  const remainingCount = avatars.length - max

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          size={size}
        />
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full bg-surface-overlay ring-2 ring-white/10',
            sizeStyles[size]
          )}
        >
          <span className="text-xs font-medium text-white/70">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  )
}
