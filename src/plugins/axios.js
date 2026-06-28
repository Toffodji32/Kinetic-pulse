import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import router from '../router';

const PRODUCTION_API = 'https://kenetic-pulse-api.onrender.com'

function resolveApiBaseUrl() {
  let url = (import.meta.env.VITE_API_URL || PRODUCTION_API).trim().replace(/\/+$/, '')

  if (!url.endsWith('/api')) {
    url = `${url}/api`
  }

  // Évite Mixed Content quand Vercel a une URL http:// dans VITE_API_URL
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
    url = `https://${url.slice('http://'.length)}`
  }

  return url
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config;
});

// Intercepteur pour gérer les erreurs (401 JWT expiré)
api.interceptors.response.use(
  response => response,
  (error) => {
    const authStore = useAuthStore();

    if (error.response?.status === 401) {
      console.warn('JWT expiré ou non valide, déconnexion...');
      authStore.logout();
      router.push('/login');
    }

    return Promise.reject(error);
  }
);

export default api;
