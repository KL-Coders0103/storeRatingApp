import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Store, Star, Users, ArrowRight, TrendingUp } from 'lucide-react'
import { motion as Motion } from 'framer-motion'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const features = [
    {
      icon: Store,
      title: 'Discover Stores',
      description: 'Explore various stores and find your favorites',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Share your experiences by rating stores',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'Store Analytics',
      description: 'Store owners can track their performance',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a community of shoppers and business owners',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Welcome to RateStore
          </Motion.h1>
          <Motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg mb-8"
          >
            Ready to explore stores and share your experiences?
          </Motion.p>
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button 
              onClick={() => navigate('/stores')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Store className="h-5 w-5" />
              <span>Browse Stores</span>
            </button>
          </Motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="pt-20 pb-16 px-4 text-center">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Discover & Rate
            <span className="block bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Favorite Stores
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Join our community to explore stores, share your experiences, and help others discover amazing places.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </div>
        </Motion.div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose RateStore?
            </h2>
            <p className="text-white/60 text-lg">
              Everything you need to discover and share store experiences
            </p>
          </Motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 bg-linear-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-effect rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Join thousands of users who are already discovering and rating stores
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Create Account
              </Link>
              <Link to="/stores" className="btn-secondary text-lg px-8 py-4">
                Browse Stores
              </Link>
            </div>
          </div>
        </Motion.div>
      </section>
    </div>
  )
}

export default Home