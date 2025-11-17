import React, { useState, useEffect, useCallback } from 'react'
import { adminAPI } from '../../services/api'
import { X, User, Mail, MapPin, Calendar, Store, Star, Shield, Building, Edit3 } from 'lucide-react'
import { motion as  Motion } from 'framer-motion'
import LoadingSpinner from '../LoadingSpinner'

const UserDetailsModal = ({ user, onClose, onRoleUpdate }) => {
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await adminAPI.get(`/admin/users/${user.id}`)
      setUserDetails(response.data)
    } catch (error) {
      console.error('Error fetching user details:', error)
    } finally {
      setLoading(false)
    }
  },[user]);

  useEffect(() => {
    fetchUserDetails()
  }, [fetchUserDetails])

  const handleRoleUpdate = async (newRole) => {
    setUpdating(true)
    try {
      await onRoleUpdate(user.id, newRole)
      setUserDetails(prev => ({
        ...prev,
        user: { ...prev.user, role: newRole }
      }))
    } catch (error) {
      console.error('Error updating role:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="h-5 w-5" />
      case 'store_owner': return <Building className="h-5 w-5" />
      default: return <User className="h-5 w-5" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'store_owner': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  }

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return 'Full system access and management capabilities'
      case 'store_owner': return 'Can manage stores and view customer ratings'
      default: return 'Can browse stores and submit ratings'
    }
  }

  if (loading) {
    return (
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <Motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-linear-to-br from-gray-800 to-gray-900 border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Motion.div>
      </Motion.div>
    )
  }

  const { user: userData, store } = userDetails

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <Motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-linear-to-br from-gray-800 to-gray-900 border border-white/20 rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">User Details</h2>
            <p className="text-white/60">Complete information about the user</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{userData.name}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getRoleColor(userData.role)}`}>
                      {getRoleIcon(userData.role)}
                      <span className="ml-1 capitalize font-medium">{userData.role.replace('_', ' ')}</span>
                    </div>
                    <span className="text-white/60 text-sm">
                      Joined {new Date(userData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white font-medium">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white/60 text-sm">Member Since</p>
                    <p className="text-white font-medium">
                      {new Date(userData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-start space-x-3 p-3 bg-white/5 rounded-xl">
                  <MapPin className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-white/60 text-sm">Address</p>
                    <p className="text-white font-medium">{userData.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {userData.role === 'store_owner' && store && (
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Store className="h-5 w-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Store Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">{store.name}</h4>
                    <p className="text-white/60 text-sm mb-3">{store.address}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{store.average_rating}</span>
                        <span className="text-white/60 text-sm">average rating</span>
                      </div>
                      <span className="text-white/60 text-sm">
                        {store.total_ratings} total ratings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {userData.role === 'store_owner' && !store && (
              <div className="glass-effect rounded-2xl p-6 text-center">
                <Store className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">No Store Assigned</h4>
                <p className="text-white/60 text-sm">
                  This store owner doesn't have any stores assigned yet.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Edit3 className="h-5 w-5 text-white" />
                <h3 className="text-lg font-bold text-white">Role Management</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Current Role
                  </label>
                  <div className={`p-3 rounded-xl border ${getRoleColor(userData.role)}`}>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(userData.role)}
                      <span className="font-semibold capitalize">{userData.role.replace('_', ' ')}</span>
                    </div>
                    <p className="text-white/60 text-sm mt-1">
                      {getRoleDescription(userData.role)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Change Role
                  </label>
                  <select
                    value={userData.role}
                    onChange={(e) => handleRoleUpdate(e.target.value)}
                    disabled={updating}
                    className="input-field w-full disabled:opacity-50"
                  >
                    <option className='text-black' value="user">Customer</option>
                    <option className='text-black' value="store_owner">Store Owner</option>
                    <option className='text-black' value="admin">Administrator</option>
                  </select>
                  {updating && (
                    <div className="flex items-center space-x-2 mt-2 text-white/60 text-sm">
                      <LoadingSpinner size="sm" />
                      <span>Updating role...</span>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                  <p className="text-yellow-300 text-sm">
                    <strong>Note:</strong> Changing roles may affect user permissions and access to features.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {userData.role === 'store_owner' && (
                  <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <div className="flex items-center space-x-2">
                      <Store className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">View Store Details</span>
                    </div>
                  </button>
                )}
                <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-green-400" />
                    <span className="text-white text-sm">Send Message</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span className="text-white text-sm">View Activity Log</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">User Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Account Status</span>
                  <span className="text-green-400 text-sm font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Last Login</span>
                  <span className="text-white text-sm">Recently</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Ratings Given</span>
                  <span className="text-white text-sm">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-6 mt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Close
          </button>
          <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-blue-500/30">
            Edit User
          </button>
        </div>
      </Motion.div>
    </Motion.div>
  )
}

export default UserDetailsModal