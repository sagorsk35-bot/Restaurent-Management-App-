// =====================================================
// FOODFLOW PLATFORM - Application Types
// =====================================================

export * from './database'

// Cart Types
export interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  variant?: {
    id: string
    name: string
    priceModifier: number
  }
  addons: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
  specialInstructions?: string
  image?: string
}

export interface Cart {
  restaurantId: string
  restaurantName: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  serviceFee: number
  tax: number
  discount: number
  total: number
  couponCode?: string
}

// Tracking Types
export interface DeliveryLocation {
  latitude: number
  longitude: number
  heading?: number
  speed?: number
  accuracy?: number
  timestamp: string
}

export interface TrackingState {
  orderId: string
  deliveryPersonId: string
  currentLocation: DeliveryLocation | null
  route: [number, number][]
  estimatedArrival: string | null
  status: string
}

// Chat Types
export interface ChatState {
  conversationId: string | null
  restaurantId: string | null
  messages: {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: string
  }[]
  isLoading: boolean
}

// UI Types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

export interface ModalState {
  isOpen: boolean
  component: string | null
  props?: Record<string, unknown>
}

// Map Types
export interface MapMarker {
  id: string
  type: 'restaurant' | 'delivery' | 'user' | 'destination'
  coordinates: [number, number]
  label?: string
  icon?: string
}

export interface MapRoute {
  coordinates: [number, number][]
  duration: number
  distance: number
}

// Dashboard Stats Types
export interface PlatformStats {
  totalRestaurants: number
  activeRestaurants: number
  pendingApprovals: number
  totalUsers: number
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  totalDeliveryPersonnel: number
  activeDeliveries: number
}

export interface RestaurantStats {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  avgRating: number
  totalReviews: number
  pendingOrders: number
  menuItems: number
}

export interface DeliveryStats {
  totalDeliveries: number
  todayDeliveries: number
  totalEarnings: number
  todayEarnings: number
  avgRating: number
  currentStatus: string
}

// Form Types
export interface MenuItemFormData {
  name: string
  description: string
  price: number
  compareAtPrice?: number
  categoryId: string
  image?: File
  isAvailable: boolean
  isFeatured: boolean
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  spiceLevel: number
  calories?: number
  prepTimeMinutes: number
  tags: string[]
  allergens: string[]
}

export interface RestaurantFormData {
  name: string
  description: string
  address: string
  city: string
  state?: string
  postalCode?: string
  phone: string
  email?: string
  website?: string
  cuisineTypes: string[]
  deliveryRadiusKm: number
  minOrderAmount: number
  avgPrepTimeMinutes: number
  openingHours: {
    [key: string]: {
      open: string
      close: string
      isClosed: boolean
    }
  }
}

// Knowledge Base Types
export interface KnowledgeEntry {
  id?: string
  title: string
  content: string
  type: 'faq' | 'policy' | 'menu_info' | 'custom'
}

// Price Comparison Types
export interface PriceComparison {
  currentItem: {
    id: string
    name: string
    price: number
    restaurantName: string
  }
  alternatives: {
    id: string
    restaurantId: string
    restaurantName: string
    restaurantLogo: string | null
    itemName: string
    price: number
    imageUrl: string | null
    distanceKm: number
    similarityScore: number
    savings: number
    savingsPercent: number
  }[]
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}
