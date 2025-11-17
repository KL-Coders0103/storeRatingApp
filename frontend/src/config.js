const config = {
  development: {
    API_URL: 'http://localhost:3000/api'
  },
  production: {
    API_URL: 'https://storeratingapp-backend-l8ur.onrender.com/api'
  }
}

const getConfig = () => {
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return config.development
  }
  return config.production
}

export const { API_URL } = getConfig()