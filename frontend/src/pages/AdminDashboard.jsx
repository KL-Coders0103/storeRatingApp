import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI } from '../services/api'
import { Users, Store, Star, TrendingUp, UserPlus, Building } from 'lucide-react'
import { motion as  Motion } from 'framer-motion'
import LoadingSpinner from '../components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.get('/admin/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching admin dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon, label, value, color, onClick }) => {
    const Icon = icon;
    return(
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-effect rounded-2xl p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Motion.div>
  );
}

  const RecentItem = ({ item, type, icon }) => {
    const Icon = icon;
    return(
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-white/60" />
        <div>
          <p className="text-white font-medium">{item.name}</p>
          <p className="text-white/60 text-sm">
            {type === 'user' ? item.email : item.owner_name || 'No owner'}
          </p>
        </div>
      </div>
      <span className="text-white/40 text-sm">
        {new Date(item.created_at).toLocaleDateString()}
      </span>
    </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-white/60 text-lg">
          Welcome back, {user?.name}. Manage your platform.
        </p>
      </Motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={dashboardData?.stats.totalUsers || 0}
          color="bg-blue-500/20"
          onClick={() => navigate('/app/admin/users')}
        />
        <StatCard
          icon={Store}
          label="Total Stores"
          value={dashboardData?.stats.totalStores || 0}
          color="bg-green-500/20"
          onClick={() => navigate('/app/admin/stores')}
        />
        <StatCard
          icon={Star}
          label="Total Ratings"
          value={dashboardData?.stats.totalRatings || 0}
          color="bg-yellow-500/20"
        />
        <StatCard
          icon={TrendingUp}
          label="Platform Health"
          value="Active"
          color="bg-purple-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Users</h3>
            <button 
              onClick={() => navigate('/app/admin/users')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentUsers.map((user) => (
              <RecentItem key={user.id} item={user} type="user" icon={Users} />
            ))}
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Stores</h3>
            <button 
              onClick={() => navigate('/app/admin/stores')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentStores.map((store) => (
              <RecentItem key={store.id} item={store} type="store" icon={Store} />
            ))}
          </div>
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/admin/users?action=create')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 text-left"
          >
            <UserPlus className="h-8 w-8 text-white mb-3" />
            <h3 className="text-white font-semibold text-lg">Add User</h3>
            <p className="text-white/60 text-sm mt-1">Create new user account</p>
          </Motion.button>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/admin/stores?action=create')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 text-left"
          >
            <Building className="h-8 w-8 text-white mb-3" />
            <h3 className="text-white font-semibold text-lg">Add Store</h3>
            <p className="text-white/60 text-sm mt-1">Register new store</p>
          </Motion.button>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/admin/users')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 text-left"
          >
            <Users className="h-8 w-8 text-white mb-3" />
            <h3 className="text-white font-semibold text-lg">Manage Users</h3>
            <p className="text-white/60 text-sm mt-1">View and edit users</p>
          </Motion.button>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/admin/stores')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 text-left"
          >
            <Store className="h-8 w-8 text-white mb-3" />
            <h3 className="text-white font-semibold text-lg">Manage Stores</h3>
            <p className="text-white/60 text-sm mt-1">View all stores</p>
          </Motion.button>
        </div>
      </Motion.div>
    </div>
  )
}

export default AdminDashboard