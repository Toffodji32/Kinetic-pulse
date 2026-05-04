import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null,
    loading: false,
    error: null,
  }),

  getters: {
    // accès rapides pour les cards du dashboard
    totalClients:        (state) => state.stats?.clients.total ?? 0,
    totalProducts:       (state) => state.stats?.products.total ?? 0,
    outOfStock:          (state) => state.stats?.products.outOfStock ?? 0,
    totalRevenue:        (state) => state.stats?.orders.totalRevenue ?? 0,
    todayRevenue:        (state) => state.stats?.orders.todayRevenue ?? 0,
    activeSubscriptions: (state) => state.stats?.subscriptions.active ?? 0,
    expiredSubscriptions:(state) => state.stats?.subscriptions.expired ?? 0,
    todayCheckins:       (state) => state.stats?.checkins.today ?? 0,
  },

  actions: {
    // GET /api/dashboard → gros objet de stats
    async fetchStats() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/dashboard')
        this.stats = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement dashboard'
      } finally {
        this.loading = false
      }
    },
  },
})