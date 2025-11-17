import React, { useState, useEffect, useCallback } from 'react'
import { adminAPI } from '../services/api'
import { Users, Search, UserPlus, Eye, Shield, Building } from 'lucide-react'
import { motion as  Motion } from 'framer-motion'
import LoadingSpinner from '../components/Loadingspinner'
import CreateUserModal from '../components/admin/CreateUserModal'
import UserDetailsModal from '../components/admin/UserDetailsModal'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await adminAPI.get(`/admin/users?${params}`)
      setUsers(response.data.users)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }))
  }

  const handleUserCreated = () => {
    setShowCreateModal(false)
    fetchUsers()
  }

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await adminAPI.put(`/admin/users/${userId}/role`, { role: newRole })
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />
      case 'store_owner': return <Building className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'store_owner': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-white/60 mt-2">Manage all users and their roles</p>
        </div>
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2 mt-4 lg:mt-0"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add User</span>
        </Motion.button>
      </div>
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or address..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="input-field w-full"
            >
              <option value="all" className='text-black'>All Roles</option>
              <option value="user" className='text-black'>Customers</option>
              <option value="store_owner" className='text-black'>Store Owners</option>
              <option value="admin" className='text-black'>Admins</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="name" className='text-black'>Sort by Name</option>
              <option value="email" className='text-black'>Sort by Email</option>
              <option value="role" className='text-black'>Sort by Role</option>
              <option value="created_at" className='text-black'>Sort by Date</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="input-field w-32"
            >
              <option value="asc" className='text-black'>Asc</option>
              <option value="desc" className='text-black'>Desc</option>
            </select>
          </div>
        </div>
      </Motion.div>
      {loading ? (
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">
                  {pagination.totalUsers} Users Found
                </span>
              </div>
              {pagination.totalPages > 1 && (
                <span className="text-white/60 text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <Motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white truncate">{user.name}</h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-2 truncate">{user.email}</p>
                  <p className="text-white/40 text-xs mb-3 truncate">{user.address}</p>

                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1 capitalize">{user.role.replace('_', ' ')}</span>
                    </div>

                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                      className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/50"
                    >
                      <option value="user" className='text-black'>Customer</option>
                      <option value="store_owner" className='text-black'>Store Owner</option>
                      <option value="admin" className='text-black'>Admin</option>
                    </select>
                  </div>

                  <p className="text-white/30 text-xs mt-3">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </Motion.div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                <p className="text-white/60">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-white/60 text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onRoleUpdate={handleRoleUpdate}
        />
      )}
    </div>
  )
}

export default AdminUsers