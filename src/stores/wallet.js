import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: null,
    transactions: [],
    transactionsMeta: { page: 1, total: 0, pages: 1 },
    withdrawals: [],
    loading: false,
    error: null,
  }),

  actions: {
    // GET /api/wallet
    async fetchWallet() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/wallet')
        this.wallet = data
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement wallet'
        throw err
      } finally {
        this.loading = false
      }
    },

    // GET /api/wallet/transactions?page=&limit=
    async fetchTransactions(page = 1) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/wallet/transactions', { params: { page, limit: 20 } })
        this.transactions = data.data
        this.transactionsMeta = { page: data.page, total: data.total, pages: data.pages }
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement transactions'
        throw err
      } finally {
        this.loading = false
      }
    },

    // POST /api/wallet/withdraw
    async requestWithdrawal(amount, mobileMoneyNumber, mobileMoneyOperator) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/wallet/withdraw', {
          amount, mobileMoneyNumber, mobileMoneyOperator,
        })
        await this.fetchWallet()
        await this.fetchWithdrawals()
        return data
      } catch (err) {
        this.error = err.response?.data?.error || "Erreur demande de retrait"
        throw err
      } finally {
        this.loading = false
      }
    },

    // GET /api/wallet/withdrawals
    async fetchWithdrawals() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/wallet/withdrawals')
        this.withdrawals = data
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement retraits'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Super admin: GET /api/superadmin/withdrawals?status=&page=
    async fetchPendingWithdrawals(page = 1, status = 'pending') {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/superadmin/withdrawals', { params: { status, page, limit: 20 } })
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement demandes'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Super admin: POST /api/superadmin/withdrawals/{id}/approve
    async approveWithdrawal(id) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post(`/superadmin/withdrawals/${id}/approve`)
        return data
      } catch (err) {
        this.error = err.response?.data?.error || "Erreur approbation retrait"
        throw err
      } finally {
        this.loading = false
      }
    },

    // Super admin: POST /api/superadmin/withdrawals/{id}/reject
    async rejectWithdrawal(id, reason) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post(`/superadmin/withdrawals/${id}/reject`, { reason })
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur rejet retrait'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Super admin: GET /api/superadmin/wallets
    async fetchAdminWallets() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/superadmin/wallets')
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement wallets'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Super admin: GET /api/superadmin/wallet-stats
    async fetchWalletStats() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/superadmin/wallet-stats')
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement statistiques'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
