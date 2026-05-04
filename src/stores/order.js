import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    order: null,
    loading: false,
    error: null,
  }),

  getters: {
    pendingOrders: (state) => state.orders.filter((o) => o.status === 'pending'),
    paidOrders: (state) => state.orders.filter((o) => o.status === 'paid'),
    cancelledOrders: (state) => state.orders.filter((o) => o.status === 'cancelled'),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/orders')
        this.orders = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement commandes'
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/orders/${id}`)
        this.order = data
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/orders', payload)
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur création commande'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateDelivery(id, deliveryStatus) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post(`/orders/${id}/delivery`, {
          delivery_status: deliveryStatus,
        })
        const index = this.orders.findIndex((o) => o.id === id)
        if (index !== -1) this.orders[index].delivery_status = deliveryStatus
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur mise à jour livraison'
        throw err
      } finally {
        this.loading = false
      }
    },

    // ← NOUVEAU : POST /api/orders/{id}/validate
    async validate(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post(`/orders/${id}/validate`)
        // mise à jour locale immédiate sans refetch
        const index = this.orders.findIndex((o) => o.id === id)
        if (index !== -1) this.orders[index].status = 'paid'
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur validation commande'
        throw err
      } finally {
        this.loading = false
      }
    },

    async cancel(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post(`/orders/${id}/cancel`)
        // mise à jour locale immédiate sans refetch
        const index = this.orders.findIndex((o) => o.id === id)
        if (index !== -1) this.orders[index].status = 'cancelled'
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur annulation commande'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
