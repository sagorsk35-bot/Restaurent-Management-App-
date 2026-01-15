'use client'

import { motion } from 'framer-motion'
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Users,
  CheckCircle,
  XCircle,
  ChefHat,
  Truck,
} from 'lucide-react'
import { GlassCard, StatsCard, Badge, Avatar, Button, Progress } from '@/components/ui'
import { formatCurrency, formatRelativeTime, getStatusColor } from '@/lib/utils'

// Mock data
const restaurantStats = {
  todayOrders: 47,
  todayRevenue: 38472,
  pendingOrders: 5,
  avgRating: 4.8,
  totalReviews: 1247,
  menuItems: 48,
}

const recentOrders = [
  {
    id: 'FF-20260113-A1B2C3',
    customer: 'Ahmed Rahman',
    items: ['Classic Burger x2', 'Fries x1', 'Coke x2'],
    total: 485,
    status: 'preparing',
    time: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'FF-20260113-D4E5F6',
    customer: 'Fatima Begum',
    items: ['Chicken Sandwich', 'Salad'],
    total: 320,
    status: 'pending',
    time: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: 'FF-20260113-G7H8I9',
    customer: 'Karim Uddin',
    items: ['Double Cheese Burger', 'Onion Rings', 'Sprite'],
    total: 590,
    status: 'ready_for_pickup',
    time: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'FF-20260113-J0K1L2',
    customer: 'Nusrat Jahan',
    items: ['Veggie Wrap x3'],
    total: 450,
    status: 'confirmed',
    time: new Date(Date.now() - 1000 * 60 * 1),
  },
]

const popularItems = [
  { name: 'Classic Burger', orders: 156, revenue: 46800, trend: 12 },
  { name: 'Double Cheese Burger', orders: 124, revenue: 49600, trend: 8 },
  { name: 'Chicken Sandwich', orders: 98, revenue: 29400, trend: -3 },
  { name: 'Loaded Fries', orders: 87, revenue: 17400, trend: 15 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const getOrderStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'New Order',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready_for_pickup: 'Ready',
  }
  return labels[status] || status
}

const getOrderStatusVariant = (status: string): 'warning' | 'info' | 'primary' | 'success' => {
  const variants: Record<string, 'warning' | 'info' | 'primary' | 'success'> = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'primary',
    ready_for_pickup: 'success',
  }
  return variants[status] || 'secondary' as 'warning'
}

export default function AdminDashboard() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white">Restaurant Dashboard</h1>
        <p className="text-white/60 mt-1">
          Welcome back! Here's your restaurant's performance today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={itemVariants}
      >
        <StatsCard
          title="Today's Revenue"
          value={restaurantStats.todayRevenue}
          isCurrency
          change={15.3}
          changeLabel="vs yesterday"
          icon={<DollarSign className="h-5 w-5" />}
          iconColor="bg-success/20 text-success"
        />
        <StatsCard
          title="Today's Orders"
          value={restaurantStats.todayOrders}
          change={8.2}
          changeLabel="vs yesterday"
          icon={<ShoppingBag className="h-5 w-5" />}
          iconColor="bg-primary-500/20 text-primary-400"
        />
        <StatsCard
          title="Pending Orders"
          value={restaurantStats.pendingOrders}
          icon={<Clock className="h-5 w-5" />}
          iconColor="bg-warning/20 text-warning"
        />
        <StatsCard
          title="Rating"
          value={restaurantStats.avgRating}
          suffix=" / 5"
          icon={<Star className="h-5 w-5" />}
          iconColor="bg-warning/20 text-warning"
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live Orders */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-white">Live Orders</h2>
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Avatar name={order.customer} size="md" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-white">{order.customer}</p>
                      <Badge
                        variant={getOrderStatusVariant(order.status)}
                        size="sm"
                      >
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </div>

                    <p className="text-xs text-white/50 mb-2">{order.id}</p>

                    <p className="text-sm text-white/70 truncate">
                      {order.items.join(', ')}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(order.total)}
                      </span>
                      <span className="text-xs text-white/40">
                        {formatRelativeTime(order.time)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {order.status === 'pending' && (
                      <>
                        <Button variant="success" size="icon-sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon-sm">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <Button variant="default" size="sm">
                        <ChefHat className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button variant="success" size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Ready
                      </Button>
                    )}
                    {order.status === 'ready_for_pickup' && (
                      <Button variant="default" size="sm">
                        <Truck className="h-4 w-4 mr-1" />
                        Picked
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Popular Items */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Popular Items</h2>
              <Badge variant="secondary" size="sm">
                Today
              </Badge>
            </div>

            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20 text-sm font-medium text-primary-400">
                    #{index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {item.name}
                    </p>
                    <Progress
                      value={(item.orders / popularItems[0].orders) * 100}
                      size="sm"
                      variant="gradient"
                      className="mt-1"
                    />
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {item.orders}
                    </p>
                    <p
                      className={`text-xs ${
                        item.trend > 0 ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {item.trend > 0 ? '+' : ''}
                      {item.trend}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="secondary" className="w-full mt-4">
              Manage Menu
            </Button>
          </GlassCard>
        </motion.div>
      </div>

      {/* Order Status Summary */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <h2 className="font-semibold text-white mb-4">Today's Order Flow</h2>

          <div className="grid gap-4 sm:grid-cols-5">
            {[
              { label: 'Pending', value: 5, color: 'bg-warning' },
              { label: 'Confirmed', value: 8, color: 'bg-info' },
              { label: 'Preparing', value: 12, color: 'bg-primary-500' },
              { label: 'Ready', value: 6, color: 'bg-purple-500' },
              { label: 'Delivered', value: 16, color: 'bg-success' },
            ].map((status) => (
              <div
                key={status.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
              >
                <div className={`h-3 w-3 rounded-full ${status.color}`} />
                <div>
                  <p className="text-xs text-white/50">{status.label}</p>
                  <p className="text-lg font-bold text-white">{status.value}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
