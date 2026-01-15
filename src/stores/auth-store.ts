'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, UserRole } from '@/types'

interface AuthState {
  user: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: Profile | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  hasRole: (roles: UserRole | UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      hasRole: (roles) => {
        const { user } = get()
        if (!user) return false
        const roleArray = Array.isArray(roles) ? roles : [roles]
        return roleArray.includes(user.role)
      },
    }),
    {
      name: 'foodflow-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
