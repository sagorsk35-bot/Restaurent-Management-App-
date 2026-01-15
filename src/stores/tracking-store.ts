'use client'

import { create } from 'zustand'
import type { DeliveryLocation, TrackingState, MapMarker } from '@/types'

interface TrackingStoreState {
  activeTracking: TrackingState | null
  deliveryLocations: Map<string, DeliveryLocation>
  markers: MapMarker[]

  // Actions
  setActiveTracking: (tracking: TrackingState | null) => void
  updateDeliveryLocation: (
    orderId: string,
    location: DeliveryLocation
  ) => void
  clearTracking: () => void
  setMarkers: (markers: MapMarker[]) => void
  addMarker: (marker: MapMarker) => void
  removeMarker: (id: string) => void
  updateMarkerPosition: (id: string, coordinates: [number, number]) => void
}

export const useTrackingStore = create<TrackingStoreState>((set, get) => ({
  activeTracking: null,
  deliveryLocations: new Map(),
  markers: [],

  setActiveTracking: (tracking) => set({ activeTracking: tracking }),

  updateDeliveryLocation: (orderId, location) => {
    const { deliveryLocations, activeTracking } = get()
    const newLocations = new Map(deliveryLocations)
    newLocations.set(orderId, location)

    // Update active tracking if this is the current order
    if (activeTracking?.orderId === orderId) {
      set({
        deliveryLocations: newLocations,
        activeTracking: {
          ...activeTracking,
          currentLocation: location,
        },
      })
    } else {
      set({ deliveryLocations: newLocations })
    }
  },

  clearTracking: () =>
    set({
      activeTracking: null,
      deliveryLocations: new Map(),
      markers: [],
    }),

  setMarkers: (markers) => set({ markers }),

  addMarker: (marker) =>
    set((state) => ({
      markers: [...state.markers, marker],
    })),

  removeMarker: (id) =>
    set((state) => ({
      markers: state.markers.filter((m) => m.id !== id),
    })),

  updateMarkerPosition: (id, coordinates) =>
    set((state) => ({
      markers: state.markers.map((m) =>
        m.id === id ? { ...m, coordinates } : m
      ),
    })),
}))
