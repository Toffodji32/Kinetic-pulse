import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,
    loading: false,
    error: null,
  }),

  getters: {
    inStock: (state) => state.products.filter((p) => p.stock_status === 'in_stock'),
    outOfStock: (state) => state.products.filter((p) => p.stock_status === 'out_of_stock'),
  },

  actions: {
    // GET /api/products
    // retourne [{ id, name, description, price, quantity, image, stock_status, category }]
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/products')
        this.products = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement produits'
      } finally {
        this.loading = false
      }
    },

    // GET /api/products/{id}
    async fetchOne(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/products/${id}`)
        this.product = data
      } finally {
        this.loading = false
      }
    },

    // POST /api/products (multipart/form-data)
    // payload: { name, price, quantity, description?, image?, category? }
    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('name', payload.name)
        formData.append('price', payload.price)
        formData.append('quantity', payload.quantity)
        if (payload.description) formData.append('description', payload.description)
        if (payload.category) formData.append('category', payload.category)
        if (payload.image) formData.append('image', payload.image)

        const { data } = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur création produit'
        throw err
      } finally {
        this.loading = false
      }
    },

    // POST /api/products/{id} (multipart/form-data — pas PUT !)
    // Symfony lit $request->request->get() donc on envoie form-data
    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        if (payload.name) formData.append('name', payload.name)
        if (payload.description) formData.append('description', payload.description)
        if (payload.price) formData.append('price', payload.price)
        if (payload.quantity !== undefined) formData.append('quantity', payload.quantity)
        // Envoyer la catégorie MÊME si elle est vide (pour remplacer une ancienne catégorie)
        if (payload.category !== undefined && payload.category !== null)
          formData.append('category', payload.category)
        if (payload.image) formData.append('image', payload.image)

        const { data } = await api.post(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        await this.fetchAll()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur modification produit'
        throw err
      } finally {
        this.loading = false
      }
    },

    // DELETE /api/products/{id}
    async remove(id) {
      this.loading = true
      try {
        await api.delete(`/products/${id}`)
        this.products = this.products.filter((p) => p.id !== id)
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur suppression produit'
        throw err
      } finally {
        this.loading = false
      }
    },

    // POST /api/products/{id}/decrease-stock
    // payload: { quantity: 2 }
    async decreaseStock(id, quantity) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post(`/products/${id}/decrease-stock`, { quantity })
        // mise à jour locale
        const index = this.products.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.products[index].quantity = data.new_quantity
          this.products[index].stock_status = data.new_quantity > 0 ? 'in_stock' : 'out_of_stock'
        }
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur mise à jour stock'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
