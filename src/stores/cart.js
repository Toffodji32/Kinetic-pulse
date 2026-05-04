import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),

  getters: {
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),

    count: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addItem(product, quantity = 1) {
      const existing = this.items.find((i) => i.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({ product, quantity, price: product.price })
      }
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find((i) => i.product.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = quantity
        }
      }
    },

    removeItem(productId) {
      this.items = this.items.filter((i) => i.product.id !== productId)
    },

    clear() {
      this.items = []
    },
  },

  persist: true, // survit au refresh grâce à pinia-plugin-persistedstate
})
