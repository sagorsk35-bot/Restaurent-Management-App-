'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Store,
  Users,
  Truck,
  DollarSign,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Globe,
  BarChart3,
  Shield,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Avatar, GlassCard, Input } from '@/components/ui'
import { useUIStore, useAuthStore } from '@/stores'

const navigation = [
  {
    name: 'Dashboard',
    href: '/superadmin',
    icon: LayoutDashboard,
  },
  {
    name: 'Restaurants',
    href: '/superadmin/restaurants',
    icon: Store,
    badge: '12',
  },
  {
    name: 'Users',
    href: '/superadmin/users',
    icon: Users,
  },
  {
    name: 'Delivery Fleet',
    href: '/superadmin/delivery',
    icon: Truck,
  },
  {
    name: 'Live Tracking',
    href: '/superadmin/tracking',
    icon: Globe,
    highlight: true,
  },
  {
    name: 'Analytics',
    href: '/superadmin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Revenue',
    href: '/superadmin/revenue',
    icon: DollarSign,
  },
  {
    name: 'Support',
    href: '/superadmin/support',
    icon: MessageSquare,
  },
  {
    name: 'Settings',
    href: '/superadmin/settings',
    icon: Settings,
  },
]

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { user } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col',
          'bg-gray-900/95 backdrop-blur-xl border-r border-white/10',
          'lg:relative lg:translate-x-0',
          !sidebarOpen && '-translate-x-full lg:w-20'
        )}
        initial={false}
        animate={{
          width: sidebarOpen ? 256 : 80,
          x: 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <Link href="/superadmin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 shadow-glow-sm">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  className="font-bold text-white text-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  FoodFlow
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:flex hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-white/60 hover:bg-white/5 hover:text-white',
                      item.highlight && !isActive && 'text-success'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 shrink-0',
                        item.highlight && !isActive && 'animate-pulse'
                      )}
                    />

                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          className="flex-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {item.badge && sidebarOpen && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger text-xs text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Avatar
              name={user?.full_name || 'Superadmin'}
              src={user?.avatar_url}
              size="sm"
              showStatus
              status="online"
            />

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <p className="truncate text-sm font-medium text-white">
                    {user?.full_name || 'Superadmin'}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    Platform Owner
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-lg px-4 lg:px-6">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <Input
              placeholder="Search restaurants, users, orders..."
              leftIcon={<Search className="h-4 w-4" />}
              variant="glass"
              className="bg-white/5"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger" />
            </Button>

            {/* User menu */}
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
