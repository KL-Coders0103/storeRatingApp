import axios from 'axios'

const BASE_URL = 'https://storeratingapp-backend-l8ur.onrender.com/api'

console.log('🔗 API Base URL:', BASE_URL)
console.log('📝 Registration URL:', `${BASE_URL}/auth/register`)

export const authAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const storesAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const ratingsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const adminAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const addAuthToken = (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  console.log('🔄 Making request to:', config.baseURL + config.url)
  return config
}

const handleResponseError = (error) => {
  console.error('❌ API Error:', {
    url: error.config?.baseURL + error.config?.url,
    status: error.response?.status,
    data: error.response?.data
  })

  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
  
  return Promise.reject(error)
}

[authAPI, storesAPI, ratingsAPI, adminAPI].forEach(api => {
  api.interceptors.request.use(addAuthToken)
  api.interceptors.response.use(
    response => {
      console.log('✅ Response received from:', response.config.url)
      return response
    },
    handleResponseError
  )
})

export const testConnection = async () => {
  try {
    console.log('🧪 Testing backend connection...')
    const response = await authAPI.get('/auth/health')
    console.log('✅ Backend connection successful:', response.data)
    return true
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message)
    console.log('💡 Check if backend is running at:', BASE_URL)
    return false
  }
}

testConnection()