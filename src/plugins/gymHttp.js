import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import router from '../router';

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

  const { data } = await axios.post(`${gymHttp.defaults.baseURL}/token/refresh`, {
    refresh_token: refreshToken,
  });

  authStore.setTokens(data.token, data.refresh_token || refreshToken);

  return data.token;
}

gymHttp.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token') || localStorage.getItem('token')
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
              resolve(gymHttp(config));
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
        return gymHttp(config);
      } catch (refreshError) {
        flushQueue(refreshError);
        console.warn('Session expirée, reconnexion requise.');
        localStorage.removeItem('gym_token')
        localStorage.removeItem('gym_user')
        localStorage.removeItem('gym_gym')
        authStore.logout();
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error)
  }
)

export default gymHttp