'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Store,
  Users,
  Truck,
  ShoppingBag,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react'
import { GlassCard, Button } from '@/components/ui'

const features = [
  {
    icon: Store,
    title: 'Restaurant Management',
    description: 'Full control over your menu, orders, and analytics',
  },
  {
    icon: Truck,
    title: 'Real-time Tracking',
    description: 'Live GPS tracking for all deliveries',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Support',
    description: 'Custom trained chatbot for each restaurant',
  },
  {
    icon: ShoppingBag,
    title: 'Price Comparison',
    description: 'Smart comparison to find the best deals',
  },
]

const stats = [
  { value: '1,200+', label: 'Restaurants' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '100K+', label: 'Orders Delivered' },
  { value: '4.8', label: 'Average Rating' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary-400" />
              <span className="text-sm text-primary-400">
                AI-Powered Food Delivery Platform
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Delicious Food,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Delivered Fast
              </span>
            </h1>

            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
              The ultimate platform for restaurants, customers, and delivery
              partners. Real-time tracking, smart price comparison, and
              AI-powered assistance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/restaurants">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Store className="h-5 w-5" />
                  Partner with Us
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {stats.map((stat, index) => (
              <GlassCard key={index} className="text-center py-6">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/50 mt-1">{stat.label}</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose FoodFlow?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            A complete ecosystem designed for modern food delivery
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full text-center p-6 hover:bg-white/10 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/20 mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Role Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Customer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="h-full p-8 border-primary-500/30">
              <Users className="h-10 w-10 text-primary-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">For Customers</h3>
              <ul className="space-y-2 text-white/60 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  Compare prices across restaurants
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-info" />
                  Real-time order tracking
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-400" />
                  AI assistant for recommendations
                </li>
              </ul>
              <Link href="/restaurants">
                <Button className="w-full">Start Ordering</Button>
              </Link>
            </GlassCard>
          </motion.div>

          {/* Restaurant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="h-full p-8 border-accent-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-accent-500 text-xs font-medium rounded-bl-lg">
                Popular
              </div>
              <Store className="h-10 w-10 text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">For Restaurants</h3>
              <ul className="space-y-2 text-white/60 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-success" />
                  Manage orders in real-time
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-400" />
                  Train your own AI chatbot
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  Analytics & insights
                </li>
              </ul>
              <Link href="/admin">
                <Button variant="accent" className="w-full">Partner Now</Button>
              </Link>
            </GlassCard>
          </motion.div>

          {/* Delivery */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="h-full p-8 border-success/30">
              <Truck className="h-10 w-10 text-success mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">For Riders</h3>
              <ul className="space-y-2 text-white/60 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-info" />
                  Optimized route planning
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-success" />
                  Flexible schedule
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  Track your earnings
                </li>
              </ul>
              <Link href="/delivery">
                <Button variant="success" className="w-full">Become a Rider</Button>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">FoodFlow</span>
            </div>
            <p className="text-sm text-white/40">
              © 2026 FoodFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/superadmin" className="text-sm text-white/40 hover:text-white">
                Admin
              </Link>
              <Link href="/privacy" className="text-sm text-white/40 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-white/40 hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
