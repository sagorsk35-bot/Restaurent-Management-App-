'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Store,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import {
  GlassCard,
  Button,
  Input,
  Badge,
  Avatar,
  Select,
  Modal,
  ConfirmDialog,
} from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

// Mock data
const restaurants = [
  {
    id: '1',
    name: 'Burger Palace',
    slug: 'burger-palace',
    owner: { name: 'John Doe', email: 'john@email.com' },
    status: 'approved',
    city: 'Dhaka',
    address: '123 Main Street, Gulshan',
    phone: '+880 1712 345 678',
    commissionRate: 0.15,
    avgRating: 4.8,
    totalOrders: 1247,
    totalRevenue: 847293,
    cuisineTypes: ['American', 'Fast Food'],
    createdAt: '2025-06-15',
  },
  {
    id: '2',
    name: 'Pizza Hub',
    slug: 'pizza-hub',
    owner: { name: 'Jane Smith', email: 'jane@email.com' },
    status: 'pending',
    city: 'Chittagong',
    address: '45 Station Road',
    phone: '+880 1812 345 678',
    commissionRate: 0.15,
    avgRating: 0,
    totalOrders: 0,
    totalRevenue: 0,
    cuisineTypes: ['Italian', 'Pizza'],
    createdAt: '2026-01-10',
  },
  {
    id: '3',
    name: 'Sushi Master',
    slug: 'sushi-master',
    owner: { name: 'Mike Lee', email: 'mike@email.com' },
    status: 'suspended',
    city: 'Dhaka',
    address: '78 Dhanmondi Lake Road',
    phone: '+880 1912 345 678',
    commissionRate: 0.12,
    avgRating: 4.2,
    totalOrders: 582,
    totalRevenue: 384729,
    cuisineTypes: ['Japanese', 'Sushi'],
    createdAt: '2025-03-20',
  },
  {
    id: '4',
    name: 'Spice Garden',
    slug: 'spice-garden',
    owner: { name: 'Sara Khan', email: 'sara@email.com' },
    status: 'approved',
    city: 'Sylhet',
    address: '12 Amberkhana',
    phone: '+880 1612 345 678',
    commissionRate: 0.15,
    avgRating: 4.6,
    totalOrders: 892,
    totalRevenue: 583920,
    cuisineTypes: ['Indian', 'Bengali'],
    createdAt: '2025-08-10',
  },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'banned', label: 'Banned' },
]

const getStatusBadge = (status: string) => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'secondary'> = {
    approved: 'success',
    pending: 'warning',
    suspended: 'danger',
    banned: 'danger',
  }
  return variants[status] || 'secondary'
}

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'suspend' | 'ban' | 'delete'
    restaurant: typeof restaurants[0]
  } | null>(null)

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAction = (type: string) => {
    // Handle the action
    setConfirmAction(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Restaurant Management</h1>
          <p className="text-white/60 mt-1">
            Manage all restaurants on the platform
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="lg">
            {restaurants.filter((r) => r.status === 'approved').length} Active
          </Badge>
          <Badge variant="warning" size="lg">
            {restaurants.filter((r) => r.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <GlassCard padding="sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search restaurants or owners..."
              leftIcon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="glass"
            />
          </div>

          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="glass"
            className="sm:w-48"
          />

          <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
            More Filters
          </Button>
        </div>
      </GlassCard>

      {/* Restaurant Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRestaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard hover className="h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-pink-500/20">
                    <Store className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{restaurant.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={getStatusBadge(restaurant.status)} size="sm">
                        {restaurant.status}
                      </Badge>
                      {restaurant.avgRating > 0 && (
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs">{restaurant.avgRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="icon-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-white/60">
                  <Avatar name={restaurant.owner.name} size="xs" />
                  <span>{restaurant.owner.name}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{restaurant.city}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {restaurant.cuisineTypes.map((cuisine) => (
                    <Badge key={cuisine} variant="secondary" size="sm">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              {restaurant.status === 'approved' && (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/50">Total Orders</p>
                    <p className="font-semibold text-white">
                      {restaurant.totalOrders.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Revenue</p>
                    <p className="font-semibold text-white">
                      {formatCurrency(restaurant.totalRevenue)}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  leftIcon={<Eye className="h-4 w-4" />}
                  onClick={() => {
                    setSelectedRestaurant(restaurant)
                    setShowDetails(true)
                  }}
                >
                  View
                </Button>

                {restaurant.status === 'pending' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                      onClick={() =>
                        setConfirmAction({ type: 'approve', restaurant })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      leftIcon={<XCircle className="h-4 w-4" />}
                    >
                      Reject
                    </Button>
                  </>
                )}

                {restaurant.status === 'approved' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Ban className="h-4 w-4" />}
                    onClick={() =>
                      setConfirmAction({ type: 'suspend', restaurant })
                    }
                  >
                    Suspend
                  </Button>
                )}

                {restaurant.status === 'suspended' && (
                  <Button
                    variant="success"
                    size="sm"
                    leftIcon={<CheckCircle className="h-4 w-4" />}
                    onClick={() =>
                      setConfirmAction({ type: 'approve', restaurant })
                    }
                  >
                    Reactivate
                  </Button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Restaurant Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={selectedRestaurant?.name}
        size="lg"
      >
        {selectedRestaurant && (
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <Avatar name={selectedRestaurant.owner.name} size="lg" />
              <div>
                <p className="font-medium text-white">
                  {selectedRestaurant.owner.name}
                </p>
                <p className="text-sm text-white/60">
                  {selectedRestaurant.owner.email}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Address</span>
                </div>
                <p className="text-white">{selectedRestaurant.address}</p>
                <p className="text-white/60">{selectedRestaurant.city}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">Contact</span>
                </div>
                <p className="text-white">{selectedRestaurant.phone}</p>
              </div>
            </div>

            {/* Commission Settings */}
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-white/60 mb-2">Commission Rate</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-white">
                  {(selectedRestaurant.commissionRate * 100).toFixed(0)}%
                </p>
                <Button variant="secondary" size="sm">
                  Edit Rate
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button variant="secondary" className="flex-1">
                Edit Restaurant
              </Button>
              {selectedRestaurant.status !== 'banned' && (
                <Button variant="destructive">Ban Restaurant</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleAction(confirmAction?.type || '')}
        title={
          confirmAction?.type === 'approve'
            ? 'Approve Restaurant'
            : confirmAction?.type === 'suspend'
              ? 'Suspend Restaurant'
              : 'Confirm Action'
        }
        description={
          confirmAction?.type === 'approve'
            ? `Are you sure you want to approve "${confirmAction?.restaurant.name}"? They will be able to receive orders.`
            : `Are you sure you want to suspend "${confirmAction?.restaurant.name}"? They will not be able to receive orders.`
        }
        confirmText={confirmAction?.type === 'approve' ? 'Approve' : 'Suspend'}
        variant={confirmAction?.type === 'approve' ? 'default' : 'danger'}
      />
    </div>
  )
}
