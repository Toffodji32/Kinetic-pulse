import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import router from '../router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',

});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  /* const authStore = useAuthStore(); */
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
      authStore.logout(); // supprime le token
      router.push('/login'); // redirige vers login
    }

    return Promise.reject(error);
  }
);

export default api;
