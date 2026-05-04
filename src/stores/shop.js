import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useShopStore = defineStore('shop', {
  state: () => ({
    products: [],
    orders: [],
    loading: false,
    error: null,
  }),

  actions: {
    // catalogue public
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/shop/products')
        this.products = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement produits'
      } finally {
        this.loading = false
      }
    },

    // inscription client
    async register(name, email, phone, password) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/shop/register', { name, email, phone, password })
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur inscription'
        throw err
      } finally {
        this.loading = false
      }
    },

    // passer une commande
    async createOrder(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/shop/orders', payload)
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur commande'
        throw err
      } finally {
        this.loading = false
      }
    },

    // mes commandes
    async fetchMyOrders() {
      this.loading = true
      try {
        const { data } = await api.get('/shop/orders')
        this.orders = data
      } finally {
        this.loading = false
      }
    },
  },
})
