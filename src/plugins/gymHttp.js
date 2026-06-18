import axios from 'axios';

const PRODUCTION_API = 'https://kenetic-pulse-api.onrender.com/api'

function resolveApiBaseUrl() {
  let url = (import.meta.env.VITE_API_URL || PRODUCTION_API).trim().replace(/\/+$/, '')

  if (!url.endsWith('/api')) {
    url = `${url}/api`
  }

  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
    url = `https://${url.slice('http://'.length)}`
  }

  return url
}

const gymHttp = axios.create({
  baseURL: resolveApiBaseUrl(),
})

gymHttp.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

gymHttp.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gym_token')
      localStorage.removeItem('gym_user')
      localStorage.removeItem('gym_gym')
    }
    return Promise.reject(error)
  }
)

export default gymHttp
