import gymHttp from '@/plugins/gymHttp'
import api from '@/plugins/axios'
import { useAuthStore } from './auth'
import { defineStore } from 'pinia'

export const useGymAuthStore = defineStore('gymAuth', {
  state: () => ({
    token: localStorage.getItem('gym_token') || null,
    user: (() => {
      try {
        const stored = localStorage.getItem('gym_user')
        if (!stored || stored === 'undefined') return null
        return JSON.parse(stored)
      } catch {
        return null
      }
    })(),
    gym: (() => {
      try {
        const stored = localStorage.getItem('gym_gym')
        if (!stored || stored === 'undefined') return null
        return JSON.parse(stored)
      } catch {
        return null
      }
    })(),
    subscription: null,
    loading: false,
    error: null,
  }),

  getters: {
    isGymAuthenticated: (state) => !!state.token,
    subscriptionStatus: (state) => state.subscription?.status || null,
    daysLeft: (state) => state.subscription?.daysLeft ?? 0,
    isTrial: (state) => state.subscription?.status === 'trial',
    isExpired: (state) => state.subscription?.status === 'expired',
    isSubscriptionActive: (state) => state.subscription?.status === 'active',
  },

  actions: {
    async register(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/gym/register', payload)

        this.token = data.token
        this.user = data.user
        this.gym = data.gym

        localStorage.setItem('gym_token', data.token)
        localStorage.setItem('gym_user', JSON.stringify(data.user))
        localStorage.setItem('gym_gym', JSON.stringify(data.gym))

        const authStore = useAuthStore()
        authStore.token = data.token
        authStore.user = data.user
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        return data
      } catch (err) {
        this.error = err.response?.data?.error || "Erreur d'inscription"
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchSubscription() {
      try {
        const { data } = await gymHttp.get('/gym/subscription')
        this.subscription = data
        return data
      } catch (err) {
        this.subscription = null
        throw err
      }
    },

    async paySubscription(fedapayTransactionId, planType) {
      this.loading = true
      try {
        const { data } = await gymHttp.post('/gym/subscription/pay', {
          fedapayTransactionId,
          plan_type: planType || 'basic',
        })
        this.subscription = data
        return data
      } catch (err) {
        throw err
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.gym = null
      this.subscription = null
      localStorage.removeItem('gym_token')
      localStorage.removeItem('gym_user')
      localStorage.removeItem('gym_gym')
    },
  },
})
