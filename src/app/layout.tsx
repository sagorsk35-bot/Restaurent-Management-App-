import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { ToastContainer } from '@/components/ui'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'FoodFlow - Restaurant Management & Delivery Platform',
    template: '%s | FoodFlow',
  },
  description:
    'Modern multi-tenant restaurant management and food delivery platform with real-time tracking and AI-powered assistance.',
  keywords: [
    'food delivery',
    'restaurant management',
    'online ordering',
    'delivery tracking',
  ],
  authors: [{ name: 'FoodFlow' }],
  creator: 'FoodFlow',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans bg-surface text-white antialiased`}
      >
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
