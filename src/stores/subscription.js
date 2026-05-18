import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscriptions: [],
    clientSubscriptions: [],
    subscription: null,
    loading: false,
    error: null,
  }),

  getters: {
    // 1 entrée par client — le dernier abonnement de chaque client
    latestPerClient: (state) => {
      const grouped = {}
      state.subscriptions.forEach((sub) => {
        const key = sub.client_id
        if (
          !grouped[key] ||
          new Date(sub.endDate.split('/').reverse().join('-')) >
            new Date(grouped[key].endDate.split('/').reverse().join('-'))
        ) {
          grouped[key] = sub
        }
      })
      return Object.values(grouped)
    },

    // Actifs = dernier abonnement du client est Actif
    activeSubscriptions: (state) => {
      const grouped = {}
      state.subscriptions.forEach((sub) => {
        const key = sub.client_id
        if (
          !grouped[key] ||
          new Date(sub.endDate.split('/').reverse().join('-')) >
            new Date(grouped[key].endDate.split('/').reverse().join('-'))
        ) {
          grouped[key] = sub
        }
      })
      return Object.values(grouped).filter((s) => s.status === 'Actif')
    },

    // Expirés = dernier abonnement du client est Expiré (non renouvelé)
    expiredSubscriptions: (state) => {
      const grouped = {}
      state.subscriptions.forEach((sub) => {
        const key = sub.client_id
        if (
          !grouped[key] ||
          new Date(sub.endDate.split('/').reverse().join('-')) >
            new Date(grouped[key].endDate.split('/').reverse().join('-'))
        ) {
          grouped[key] = sub
        }
      })
      return Object.values(grouped).filter((s) => s.status === 'Expiré')
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/subscriptions')
        this.subscriptions = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement abonnements'
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/subscriptions/${id}`)
        this.subscription = data
      } finally {
        this.loading = false
      }
    },

    async fetchByClient(clientId) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get(`/subscriptions/client/${clientId}`)
        this.clientSubscriptions = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur abonnements client'
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/subscriptions', payload)
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur création abonnement'
        throw err
      } finally {
        this.loading = false
      }
    },

    async renew(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post(`/subscriptions/${id}/renew`)
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur renouvellement'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
