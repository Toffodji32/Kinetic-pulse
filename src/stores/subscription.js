import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscriptions: [], // liste globale
    clientSubscriptions: [], // abonnements d'un client précis
    subscription: null, // détail d'un seul
    loading: false,
    error: null,
  }),

  getters: {
    // filtre rapide côté front : uniquement les actifs
    activeSubscriptions: (state) => state.subscriptions.filter((s) => s.status === 'Actif'),

    // expirés
    expiredSubscriptions: (state) => state.subscriptions.filter((s) => s.status === 'Expiré'),
  },

  actions: {
    // GET /api/subscriptions
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

    // GET /api/subscriptions/{id}
    async fetchOne(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/subscriptions/${id}`)
        this.subscription = data
      } finally {
        this.loading = false
      }
    },

    // GET /api/subscriptions/client/{id}
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

    // POST /api/subscriptions
    // payload: { client_id, subscription_type_id }
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

    // POST /api/subscriptions/{id}/renew
    async renew(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post(`/subscriptions/${id}/renew`)
        await this.fetchAll()
        return data // { message, new_subscription_id }
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur renouvellement'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
