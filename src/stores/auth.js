import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: (() => {
      try {
        const stored = localStorage.getItem('user')
        console.log('📦 Chargement user du localStorage:', stored)
        if (!stored || stored === 'undefined') return null
        const parsed = JSON.parse(stored)
        console.log('✅ User parsé:', parsed)
        return parsed
      } catch (err) {
        console.error('❌ Erreur parsing user:', err)
        return null
      }
    })(),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.roles?.includes('ROLE_ADMIN'),
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        console.log('🔐 Tentative login avec:', email)
        // POST /api/login → { token }
        const { data } = await api.post('/login', { email, password })

        console.log('📡 Réponse login reçue:', data)
        console.log('🔑 Token dans réponse:', data.token?.substring(0, 20) + '...')

        this.token = data.token
        localStorage.setItem('token', data.token)

        console.log('💾 Token stocké')

        // ✅ Récupérer les données utilisateur APRÈS le login
        console.log('🔄 Récupération des données utilisateur...')
        await this.fetchMe()

        console.log('✅ Login et fetchMe complétés')
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur de connexion'
        console.error('❌ Erreur login:', err.response?.data || err.message)
        this.token = null
        localStorage.removeItem('token')
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      // GET /api/me → { id, email, name, roles }
      try {
        console.log('🔄 fetchMe - récupération utilisateur actuel')
        const { data } = await api.get('/me')
        console.log('✅ fetchMe réponse:', data)
        this.user = data
        localStorage.setItem('user', JSON.stringify(data))
        console.log('✅ User mis à jour et sauvegardé:', this.user)
      } catch (err) {
        console.error('❌ fetchMe erreur:', err)
        this.logout()
      }
    },

    logout() {
      console.log('🚪 Logout')
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      console.log('✅ localStorage et store vidés')
    },
  },
})
