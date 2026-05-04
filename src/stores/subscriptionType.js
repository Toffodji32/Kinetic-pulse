import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useSubscriptionTypeStore = defineStore('subscriptionType', {
  state: () => ({
    types: [],
    type: null,
    loading: false,
    error: null,
  }),

  actions: {
    // GET /api/subscription-types
    // retourne [{ id, name, price, durationDays }]
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/subscription-types')
        this.types = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement types'
      } finally {
        this.loading = false
      }
    },

    // GET /api/subscription-types/{id}
    async fetchOne(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/subscription-types/${id}`)
        this.type = data
      } finally {
        this.loading = false
      }
    },

    // POST /api/subscription-types
    // payload: { name, price, durationDays }
    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/subscription-types', payload)
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur création type'
        throw err
      } finally {
        this.loading = false
      }
    },

    // PUT /api/subscription-types/{id}
    // payload: { name?, price?, durationDays? }
    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.put(`/subscription-types/${id}`, payload)
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur modification type'
        throw err
      } finally {
        this.loading = false
      }
    },

    // DELETE /api/subscription-types/{id}
    async remove(id) {
      this.loading = true
      try {
        await api.delete(`/subscription-types/${id}`)
        this.types = this.types.filter(t => t.id !== id)
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur suppression type'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})