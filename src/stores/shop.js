import gymHttp from '@/plugins/gymHttp'
import { defineStore } from 'pinia'

function shopPrefix(gymSlug) {
  return gymSlug ? `/shop/${gymSlug}` : '/shop'
}

export const useShopStore = defineStore('shop', {
  state: () => ({
    products: [],
    orders: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts(gymSlug) {
      this.loading = true
      this.error = null
      try {
        const { data } = await gymHttp.get(`${shopPrefix(gymSlug)}/products`)
        this.products = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement produits'
      } finally {
        this.loading = false
      }
    },

    async register(name, email, phone, password, gymSlug) {
      this.loading = true
      this.error = null
      try {
        const { data } = await gymHttp.post(`${shopPrefix(gymSlug)}/register`, { name, email, phone, password })
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur inscription'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createOrder(payload, gymSlug) {
      this.loading = true
      this.error = null
      try {
        const { data } = await gymHttp.post(`${shopPrefix(gymSlug)}/orders`, payload)
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur commande'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchMyOrders(gymSlug) {
      this.loading = true
      try {
        const { data } = await gymHttp.get(`${shopPrefix(gymSlug)}/orders`)
        this.orders = data
      } finally {
        this.loading = false
      }
    },
  },
})
