import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { X, Search, Building } from 'lucide-react'
import { motion as  Motion } from 'framer-motion'
import LoadingSpinner from '../Loadingspinner'

const CreateStoreModal = ({ onClose, onStoreCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  })
  const [storeOwners, setStoreOwners] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStoreOwners()
  }, [])

  const fetchStoreOwners = async (search = '') => {
    setSearchLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('role', 'store_owner')
      if (search) params.append('search', search)

      const response = await adminAPI.get(`/admin/users?${params}`)
      setStoreOwners(response.data.users)
    } catch (error) {
      console.error('Error fetching store owners:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSearch = (searchTerm) => {
    fetchStoreOwners(searchTerm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await adminAPI.post('/admin/stores', formData)
      onStoreCreated()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create store')
    } finally {
      setLoading(false)
    }
  }

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
        className="bg-linear-to-br from-gray-800 to-gray-900 border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Store</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Store Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter store name"
                minLength={2}
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Store Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="store@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Store Address *
            </label>
            <textarea
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Enter store address"
              maxLength={400}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Store Owner *
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search store owners..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <select
                name="ownerId"
                required
                value={formData.ownerId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a store owner</option>
                {storeOwners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
              
              {searchLoading && (
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <LoadingSpinner size="sm" />
                  <span>Searching...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.ownerId}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Store'}
            </button>
          </div>
        </form>
      </Motion.div>
    </Motion.div>
  )
}

export default CreateStoreModal