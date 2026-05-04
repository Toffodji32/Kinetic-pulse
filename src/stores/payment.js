import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [],
    loading: false,
    error: null,
  }),

  getters: {
    // séparer les paiements par type pour l'affichage
    subscriptionPayments: (state) =>
      state.payments.filter(p => p.type === 'subscription'),

    orderPayments: (state) =>
      state.payments.filter(p => p.type === 'order'),

    // total encaissé
    totalAmount: (state) =>
      state.payments.reduce((sum, p) => sum + Number(p.amount), 0),
  },

  actions: {
    // GET /api/payments → [{ id, client, amount, method, reference, date, type }]
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/payments')
        this.payments = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement paiements'
      } finally {
        this.loading = false
      }
    },

    // POST /api/payments — payer un abonnement
    // payload: { client_id, subscription_id, payment_method }
    async createForSubscription(clientId, subscriptionId, paymentMethod) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/payments', {
          client_id: clientId,
          subscription_id: subscriptionId,
          payment_method: paymentMethod,
        })
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur paiement abonnement'
        throw err
      } finally {
        this.loading = false
      }
    },

    // POST /api/payments — payer une commande
    // payload: { client_id, order_id, payment_method }
    async createForOrder(clientId, orderId, paymentMethod) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/payments', {
          client_id: clientId,
          order_id: orderId,
          payment_method: paymentMethod,
        })
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur paiement commande'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})