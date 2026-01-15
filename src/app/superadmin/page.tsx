'use client'

import { motion } from 'framer-motion'
import {
  Store,
  Users,
  Truck,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  ShoppingBag,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { GlassCard, StatsCard, Badge, Avatar, Progress, Button } from '@/components/ui'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

// Mock data for demonstration
const platformStats = {
  totalRestaurants: 1247,
  activeRestaurants: 892,
  pendingApprovals: 12,
  totalUsers: 45892,
  totalOrders: 128493,
  todayOrders: 2847,
  totalRevenue: 12847293,
  todayRevenue: 384729,
  totalDeliveryPersonnel: 3421,
  activeDeliveries: 127,
}

const recentRestaurants = [
  {
    id: '1',
    name: 'Burger Palace',
    owner: 'John Doe',
    status: 'pending',
    location: 'Dhaka',
    appliedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    name: 'Pizza Hub',
    owner: 'Jane Smith',
    status: 'pending',
    location: 'Chittagong',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    name: 'Sushi Master',
    owner: 'Mike Lee',
    status: 'pending',
    location: 'Sylhet',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
]

const liveDeliveries = [
  {
    id: '1',
    orderId: 'FF-20260113-A1B2C3',
    deliveryPerson: 'Ahmed Khan',
    restaurant: 'Burger King',
    status: 'in_transit',
    eta: '12 mins',
  },
  {
    id: '2',
    orderId: 'FF-20260113-D4E5F6',
    deliveryPerson: 'Rahim Uddin',
    restaurant: 'Pizza Hut',
    status: 'picked_up',
    eta: '25 mins',
  },
  {
    id: '3',
    orderId: 'FF-20260113-G7H8I9',
    deliveryPerson: 'Karim Ali',
    restaurant: 'KFC',
    status: 'in_transit',
    eta: '8 mins',
  },
]

const topRestaurants = [
  { name: 'Burger King', orders: 1247, revenue: 847293, rating: 4.8 },
  { name: 'Pizza Hut', orders: 1089, revenue: 729384, rating: 4.6 },
  { name: 'KFC', orders: 982, revenue: 684729, rating: 4.7 },
  { name: 'Dominos', orders: 847, revenue: 583920, rating: 4.5 },
  { name: 'Subway', orders: 729, revenue: 472839, rating: 4.4 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SuperadminDashboard() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-white/60 mt-1">
          Welcome back! Here's what's happening across the platform.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={itemVariants}
      >
        <StatsCard
          title="Total Revenue"
          value={platformStats.totalRevenue}
          isCurrency
          change={12.5}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
          iconColor="bg-success/20 text-success"
        />
        <StatsCard
          title="Active Restaurants"
          value={platformStats.activeRestaurants}
          suffix={` / ${platformStats.totalRestaurants}`}
          change={8.2}
          changeLabel="growth"
          icon={<Store className="h-5 w-5" />}
          iconColor="bg-primary-500/20 text-primary-400"
        />
        <StatsCard
          title="Today's Orders"
          value={platformStats.todayOrders}
          change={15.3}
          changeLabel="vs yesterday"
          icon={<ShoppingBag className="h-5 w-5" />}
          iconColor="bg-info/20 text-info"
        />
        <StatsCard
          title="Active Deliveries"
          value={platformStats.activeDeliveries}
          icon={<Truck className="h-5 w-5" />}
          iconColor="bg-warning/20 text-warning"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Approvals */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Pending Approvals</h2>
              <Badge variant="danger" size="sm">
                {platformStats.pendingApprovals} new
              </Badge>
            </div>

            <div className="space-y-3">
              {recentRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/20">
                    <Store className="h-5 w-5 text-primary-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {restaurant.name}
                    </p>
                    <p className="text-xs text-white/50">
                      {restaurant.owner} • {restaurant.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="success" size="icon-sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon-sm">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="secondary" className="w-full mt-4">
              View All Requests
            </Button>
          </GlassCard>
        </motion.div>

        {/* Live Deliveries */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-white">Live Deliveries</h2>
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
              <Button variant="ghost" size="sm">
                View Map
              </Button>
            </div>

            {/* Mini Map Placeholder */}
            <div className="h-48 rounded-xl bg-surface-overlay mb-4 flex items-center justify-center border border-white/10">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                <p className="text-sm text-white/60">Live tracking map</p>
                <p className="text-xs text-white/40">
                  {platformStats.activeDeliveries} active deliveries
                </p>
              </div>
            </div>

            {/* Delivery List */}
            <div className="space-y-2">
              {liveDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5"
                >
                  <Avatar name={delivery.deliveryPerson} size="sm" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {delivery.orderId}
                    </p>
                    <p className="text-xs text-white/50">
                      {delivery.restaurant} → Customer
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        delivery.status === 'in_transit' ? 'info' : 'warning'
                      }
                      size="sm"
                    >
                      {delivery.status === 'in_transit'
                        ? 'In Transit'
                        : 'Picked Up'}
                    </Badge>
                    <div className="flex items-center gap-1 text-white/60">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{delivery.eta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Restaurants */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Top Restaurants</h2>
              <Badge variant="secondary" size="sm">
                This Month
              </Badge>
            </div>

            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <div key={restaurant.name} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sm font-medium text-white/60">
                    #{index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">
                        {restaurant.name}
                      </p>
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs">{restaurant.rating}</span>
                      </div>
                    </div>
                    <Progress
                      value={(restaurant.orders / topRestaurants[0].orders) * 100}
                      size="sm"
                      variant="gradient"
                      className="mt-2"
                    />
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {formatCurrency(restaurant.revenue)}
                    </p>
                    <p className="text-xs text-white/50">
                      {restaurant.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Revenue Overview */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Revenue Breakdown</h2>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="h-64 rounded-xl bg-surface-overlay flex items-center justify-center border border-white/10">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-white/60">Revenue Heatmap</p>
                <p className="text-xs text-white/40">
                  {formatCurrency(platformStats.todayRevenue)} today
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">Commission</p>
                <p className="text-lg font-bold text-white">15%</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">Avg Order</p>
                <p className="text-lg font-bold text-white">
                  {formatCurrency(485)}
                </p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">Growth</p>
                <p className="text-lg font-bold text-success">+12.5%</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
