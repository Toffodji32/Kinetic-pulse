import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const { data } = await api.get('/roles')
        this.roles = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement rôles'
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      const { data } = await api.post('/roles', payload)
      await this.fetchAll()
      return data
    },

    async update(id, payload) {
      const { data } = await api.put(`/roles/${id}`, payload)
      await this.fetchAll()
      return data
    },

    async remove(id) {
      await api.delete(`/roles/${id}`)
      this.roles = this.roles.filter((r) => r.id !== id)
    },

    // ✅ ASSIGNER UN RÔLE À UN UTILISATEUR
    async assignRoleToUser(roleId, userId) {
      try {
        const { data } = await api.post(`/roles/${roleId}/assign-user/${userId}`)
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur assignation rôle'
        throw err
      }
    },

    // ✅ RETIRER UN RÔLE D'UN UTILISATEUR
    async removeRoleFromUser(userId) {
      try {
        const { data } = await api.post(`/roles/${userId}/remove-role`)
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur suppression rôle'
        throw err
      }
    },
  },
})
