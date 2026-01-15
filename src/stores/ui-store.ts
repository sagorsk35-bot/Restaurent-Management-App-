'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ToastMessage, ModalState } from '@/types'

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Toasts
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  // Modal
  modal: ModalState
  openModal: (component: string, props?: Record<string, unknown>) => void
  closeModal: () => void

  // Search
  searchOpen: boolean
  searchQuery: string
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void

  // Location
  userLocation: { lat: number; lng: number } | null
  setUserLocation: (location: { lat: number; lng: number } | null) => void

  // Loading states
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
}

function generateToastId(): string {
  return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = generateToastId()
        const newToast = { ...toast, id }

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }))

        // Auto-remove after duration
        const duration = toast.duration || 5000
        setTimeout(() => {
          get().removeToast(id)
        }, duration)
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      clearToasts: () => set({ toasts: [] }),

      // Modal
      modal: { isOpen: false, component: null },
      openModal: (component, props) =>
        set({ modal: { isOpen: true, component, props } }),
      closeModal: () =>
        set({ modal: { isOpen: false, component: null, props: undefined } }),

      // Search
      searchOpen: false,
      searchQuery: '',
      setSearchOpen: (open) => set({ searchOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Location
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),

      // Loading
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
    }),
    {
      name: 'foodflow-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        userLocation: state.userLocation,
      }),
    }
  )
)

// Toast helper functions
export const toast = {
  success: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'error', title, message }),
  info: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'info', title, message }),
  warning: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'warning', title, message }),
}
