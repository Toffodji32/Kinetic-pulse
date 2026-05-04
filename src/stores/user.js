import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    normalizeUserCollection(data) {
      if (Array.isArray(data)) {
        // Transformer les utilisateurs pour avoir une propriété `role` (singulier)
        return data.map((user) => ({
          ...user,
          role: user.roles && user.roles.length > 0 ? user.roles[0] : null,
        }))
      }
      if (Array.isArray(data?.data)) {
        return data.data.map((user) => ({
          ...user,
          role: user.roles && user.roles.length > 0 ? user.roles[0] : null,
        }))
      }
      if (Array.isArray(data?.users)) {
        return data.users.map((user) => ({
          ...user,
          role: user.roles && user.roles.length > 0 ? user.roles[0] : null,
        }))
      }
      if (Array.isArray(data?.['hydra:member'])) {
        return data['hydra:member'].map((user) => ({
          ...user,
          role: user.roles && user.roles.length > 0 ? user.roles[0] : null,
        }))
      }
      return []
    },

    // GET /api/users → [{ id, email, name, roles, createdAt }]
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/users')
        console.log('📡 Réponse brute de /api/users:', data)

        // Debug: Structure exacte du premier user
        if (Array.isArray(data) && data.length > 0) {
          console.log('🔍 Structure du premier user:', JSON.stringify(data[0], null, 2))
          console.log('📦 Type de roles[0]:', typeof data[0].roles[0], data[0].roles[0])
        }

        this.users = this.normalizeUserCollection(data)
        console.log('✅ Utilisateurs normalisés avec role (singulier):', this.users)

        // Debug: Vérifier que role est bien présent
        this.users.forEach((user, idx) => {
          console.log(`  User ${idx}:`, {
            id: user.id,
            email: user.email,
            role: user.role,
            role_type: typeof user.role,
            roles: user.roles,
          })
        })
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur chargement utilisateurs'
        console.error('❌ Erreur fetchAll:', err)
      } finally {
        this.loading = false
      }
    },

    // GET /api/users/{id} → { id, email, name, roles }
    async fetchOne(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/users/${id}`)
        this.user = data
      } finally {
        this.loading = false
      }
    },

    // POST /api/users → { message: "Utilisateur créé" }
    // payload: { name, email, password, role }
    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/users', payload)
        // on recharge la liste après création
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur création'
        throw err
      } finally {
        this.loading = false
      }
    },

    // PUT /api/users/{id} → { message: "Utilisateur mis à jour" }
    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.put(`/users/${id}`, payload)
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur mise à jour'
        throw err
      } finally {
        this.loading = false
      }
    },

    // DELETE /api/users/{id} → { message: "Utilisateur supprimé" }
    async remove(id) {
      this.loading = true
      try {
        await api.delete(`/users/${id}`)
        this.users = this.users.filter((u) => u.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur suppression'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
