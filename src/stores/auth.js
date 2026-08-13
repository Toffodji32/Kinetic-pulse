import api from '@/plugins/axios'
import { defineStore } from 'pinia'
import { useCartStore } from './cart'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    user: (() => {
      try {
        const stored = localStorage.getItem('user')

        if (!stored || stored === 'undefined') return null
        const parsed = JSON.parse(stored)

        return parsed
      } catch (err) {
        return null
      }
    })(),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.roles?.includes('ROLE_ADMIN'),
    isSuperAdmin: (state) => state.user?.roles?.includes('ROLE_SUPER_ADMIN'),
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/login', { email, password })

        this.token = data.token
        this.refreshToken = data.refresh_token
        this.user = data.user // ← directement depuis la réponse login

        localStorage.setItem('token', data.token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur de connexion'
        this.token = null
        this.refreshToken = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      // GET /api/me → { id, email, name, roles }
      try {
        const { data } = await api.get('/me')

        this.user = data
        localStorage.setItem('user', JSON.stringify(data))
      } catch (err) {
        this.logout()
      }
    },

    setTokens(token, refreshToken) {
      this.token = token
      this.refreshToken = refreshToken
      localStorage.setItem('token', token)
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
    },

    logout() {
      this.token = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      useCartStore().clear()
    },
  },
})