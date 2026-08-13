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

let isRefreshing = false;
let waitQueue = [];

function flushQueue(error, token = null) {
  waitQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  waitQueue = [];
}

async function refreshSession() {
  const authStore = useAuthStore();
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const { data } = await axios.post(`${api.defaults.baseURL}/token/refresh`, {
    refresh_token: refreshToken,
  });

  authStore.setTokens(data.token, data.refresh_token || refreshToken);

  return data.token;
}

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

// Intercepteur pour gérer les erreurs (401 JWT expiré → refresh, 402 abonnement expiré)
api.interceptors.response.use(
  response => response,
  async (error) => {
    const authStore = useAuthStore();
    const { response, config } = error;

    // 401 → tenter un refresh silencieux, puis rejouer la requête
    if (response?.status === 401 && !config._retry && !config.url.includes('/token/refresh')) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitQueue.push({
            resolve: (token) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(api(config));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshSession();
        flushQueue(null, newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (refreshError) {
        flushQueue(refreshError);
        console.warn('Session expirée, reconnexion requise.');
        authStore.logout();
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 402 && error.response?.data?.code === 'SUBSCRIPTION_EXPIRED') {
      if (router.currentRoute.value.path !== '/admin/gym/subscription') {
        router.push('/admin/gym/subscription');
      }
    }

    return Promise.reject(error);
  }
);

export default api;