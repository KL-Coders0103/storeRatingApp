import React, { useState, useEffect, useCallback } from 'react'
import { adminAPI } from '../services/api'
import { Store, Search, Filter, Building, Star, User, Plus } from 'lucide-react'
import { motion as  Motion } from 'framer-motion'
import LoadingSpinner from '../components/Loadingspinner'
import CreateStoreModal from '../components/admin/CreateStoreModal'

const AdminStores = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchStores = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await adminAPI.get(`/admin/stores?${params}`)
      setStores(response.data.stores)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  },[filters]);

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }))
  }

  const handleStoreCreated = () => {
    setShowCreateModal(false)
    fetchStores()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Store Management</h1>
          <p className="text-white/60 mt-2">Manage all stores and their information</p>
        </div>
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2 mt-4 lg:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Store</span>
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
                placeholder="Search stores by name, email, address, or owner..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="flex space-x-2"> 
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field "
            >
              <option className='text-black' value="name">Sort by Name</option>
              <option className='text-black' value="email">Sort by Email</option>
              <option className='text-black' value="average_rating">Sort by Rating</option>
              <option className='text-black' value="created_at">Sort by Date</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="input-field w-32"
            >
              <option className='text-black' value="asc">Asc</option>
              <option className='text-black' value="desc">Desc</option>
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
                <Store className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">
                  {pagination.totalStores} Stores Found
                </span>
              </div>
              {pagination.totalPages > 1 && (
                <span className="text-white/60 text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {stores.map((store, index) => (
                <Motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{store.name}</h3>
                      <div className="flex items-center text-white/60 text-sm mb-2">
                        <Store className="h-4 w-4 mr-1" />
                        <span className="truncate">{store.email}</span>
                      </div>
                      <div className="flex items-center text-white/60 text-sm mb-3">
                        <User className="h-4 w-4 mr-1" />
                        <span>Owner: {store.owner_name || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">
                            {store.average_rating}
                          </span>
                        </div>
                        <span className="text-white/60 text-sm">
                          ({store.total_ratings} ratings)
                        </span>
                      </div>
                    </div>

                    <div className="text-white/60 text-sm line-clamp-2">
                      {store.address}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-white/40 text-xs">
                        Created {new Date(store.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        {store.owner_name && (
                          <div className="bg-blue-500/20 px-2 py-1 rounded-full">
                            <span className="text-blue-300 text-xs font-medium">
                              Active
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>

            {stores.length === 0 && (
              <div className="text-center py-12">
                <Store className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No stores found</h3>
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
        <CreateStoreModal
          onClose={() => setShowCreateModal(false)}
          onStoreCreated={handleStoreCreated}
        />
      )}
    </div>
  )
}

export default AdminStores