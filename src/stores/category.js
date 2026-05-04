import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),

  getters: {
    // catégories triées alphabétiquement
    sortedCategories: (state) => [...state.categories].sort((a, b) => a.name.localeCompare(b.name)),

    // trouve une catégorie par son nom
    findByName: (state) => (name) => state.categories.find((c) => c.name === name) ?? null,

    // trouve une catégorie par son id
    findById: (state) => (id) => state.categories.find((c) => c.id === id) ?? null,
  },

  actions: {
    // GET /api/categories
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/categories')
        this.categories = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement catégories'
      } finally {
        this.loading = false
      }
    },

    // POST /api/categories
    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/categories', {
          name: payload.name?.trim(),
          description: payload.description?.trim() || null,
        })
        await this.fetchAll()
        return data
      } catch (err) {
        // message précis selon le code HTTP
        if (err.response?.status === 409) {
          this.error = `La catégorie "${payload.name}" existe déjà`
        } else if (err.response?.status === 400) {
          this.error = err.response?.data?.error || 'Nom obligatoire'
        } else if (err.response?.status === 403) {
          this.error = 'Accès refusé — droits administrateur requis'
        } else {
          this.error = err.response?.data?.error || 'Erreur création catégorie'
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    // PUT /api/categories/{id}
    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.put(`/categories/${id}`, {
          name: payload.name?.trim(),
          description: payload.description?.trim() || null,
        })
        // mise à jour locale immédiate sans refetch
        const index = this.categories.findIndex((c) => c.id === id)
        if (index !== -1) {
          this.categories[index] = {
            ...this.categories[index],
            name: payload.name.trim(),
            description: payload.description?.trim() || null,
          }
        }
        return data
      } catch (err) {
        if (err.response?.status === 409) {
          this.error = `Le nom "${payload.name}" est déjà utilisé`
        } else if (err.response?.status === 403) {
          this.error = 'Accès refusé — droits administrateur requis'
        } else {
          this.error = err.response?.data?.error || 'Erreur modification catégorie'
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    // DELETE /api/categories/{id}
    async remove(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/categories/${id}`)
        // suppression locale immédiate
        this.categories = this.categories.filter((c) => c.id !== id)
      } catch (err) {
        if (err.response?.status === 400) {
          this.error = 'Impossible de supprimer — des produits utilisent cette catégorie'
        } else if (err.response?.status === 403) {
          this.error = 'Accès refusé — droits administrateur requis'
        } else {
          this.error = err.response?.data?.error || 'Erreur suppression catégorie'
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    // reset l'erreur manuellement si besoin
    clearError() {
      this.error = null
    },
  },
})
