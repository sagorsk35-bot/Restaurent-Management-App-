'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart, CartItem } from '@/types'

interface CartState {
  cart: Cart | null
  isOpen: boolean

  // Actions
  addItem: (
    restaurantId: string,
    restaurantName: string,
    item: Omit<CartItem, 'id'>
  ) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateSpecialInstructions: (itemId: string, instructions: string) => void
  clearCart: () => void
  setRestaurant: (restaurantId: string, restaurantName: string) => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  toggleCart: () => void
  setCartOpen: (open: boolean) => void

  // Computed
  itemCount: () => number
  getSubtotal: () => number
}

const SERVICE_FEE_RATE = 0.02
const TAX_RATE = 0.05
const BASE_DELIVERY_FEE = 30

function generateItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function calculateTotals(
  items: CartItem[],
  discount: number = 0
): Pick<Cart, 'subtotal' | 'deliveryFee' | 'serviceFee' | 'tax' | 'total'> {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal =
      item.price +
      (item.variant?.priceModifier || 0) +
      item.addons.reduce((a, addon) => a + addon.price * addon.quantity, 0)
    return sum + itemTotal * item.quantity
  }, 0)

  const deliveryFee = subtotal > 0 ? BASE_DELIVERY_FEE : 0
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE)
  const tax = Math.round(subtotal * TAX_RATE)
  const total = Math.max(0, subtotal + deliveryFee + serviceFee + tax - discount)

  return { subtotal, deliveryFee, serviceFee, tax, total }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,

      addItem: (restaurantId, restaurantName, item) => {
        const { cart } = get()

        // Check if switching restaurants
        if (cart && cart.restaurantId !== restaurantId) {
          // Clear cart when switching restaurants
          const newItem: CartItem = { ...item, id: generateItemId() }
          const totals = calculateTotals([newItem])

          set({
            cart: {
              restaurantId,
              restaurantName,
              items: [newItem],
              ...totals,
              discount: 0,
            },
          })
          return
        }

        // Add to existing cart or create new
        const newItem: CartItem = { ...item, id: generateItemId() }
        const items = cart ? [...cart.items, newItem] : [newItem]
        const totals = calculateTotals(items, cart?.discount)

        set({
          cart: {
            restaurantId,
            restaurantName,
            items,
            ...totals,
            discount: cart?.discount || 0,
            couponCode: cart?.couponCode,
          },
        })
      },

      removeItem: (itemId) => {
        const { cart } = get()
        if (!cart) return

        const items = cart.items.filter((item) => item.id !== itemId)

        if (items.length === 0) {
          set({ cart: null })
          return
        }

        const totals = calculateTotals(items, cart.discount)
        set({
          cart: {
            ...cart,
            items,
            ...totals,
          },
        })
      },

      updateQuantity: (itemId, quantity) => {
        const { cart } = get()
        if (!cart) return

        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        const items = cart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
        const totals = calculateTotals(items, cart.discount)

        set({
          cart: {
            ...cart,
            items,
            ...totals,
          },
        })
      },

      updateSpecialInstructions: (itemId, instructions) => {
        const { cart } = get()
        if (!cart) return

        const items = cart.items.map((item) =>
          item.id === itemId ? { ...item, specialInstructions: instructions } : item
        )

        set({
          cart: {
            ...cart,
            items,
          },
        })
      },

      clearCart: () => set({ cart: null }),

      setRestaurant: (restaurantId, restaurantName) => {
        const { cart } = get()
        if (cart?.restaurantId === restaurantId) return

        set({
          cart: {
            restaurantId,
            restaurantName,
            items: [],
            subtotal: 0,
            deliveryFee: 0,
            serviceFee: 0,
            tax: 0,
            discount: 0,
            total: 0,
          },
        })
      },

      applyCoupon: (code, discount) => {
        const { cart } = get()
        if (!cart) return

        const totals = calculateTotals(cart.items, discount)
        set({
          cart: {
            ...cart,
            ...totals,
            discount,
            couponCode: code,
          },
        })
      },

      removeCoupon: () => {
        const { cart } = get()
        if (!cart) return

        const totals = calculateTotals(cart.items, 0)
        set({
          cart: {
            ...cart,
            ...totals,
            discount: 0,
            couponCode: undefined,
          },
        })
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (open) => set({ isOpen: open }),

      itemCount: () => {
        const { cart } = get()
        return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
      },

      getSubtotal: () => {
        const { cart } = get()
        return cart?.subtotal || 0
      },
    }),
    {
      name: 'foodflow-cart',
    }
  )
)
