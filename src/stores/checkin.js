import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useCheckinStore = defineStore('checkin', {
  state: () => ({
    checkins: [],
    lastCheckin: null, // résultat du dernier scan
    loading: false,
    error: null,
    scanSuccess: false,
  }),

  actions: {
    // ← ACTION MANQUANTE — à ajouter
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/checkin')
        this.checkins = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement checkins'
      } finally {
        this.loading = false
      }
    },

    // POST /api/checkin
    // appelé après avoir décodé le QR code → on envoie l'uuid du client
    // le QR code contient : { uuid, name }
    async scan(uuid) {
      this.loading = true
      this.error = null
      this.scanSuccess = false
      this.lastCheckin = null
      try {
        const { data } = await api.post('/checkin', { uuid })
        // data = { message, client, subscription, checkinTime }
        this.lastCheckin = data
        this.scanSuccess = true
        return data
      } catch (err) {
        // 403 = abonnement expiré, 404 = client introuvable
        this.error = err.response?.data?.error || 'Accès refusé'
        throw err
      } finally {
        this.loading = false
      }
    },

    // remet l'état à zéro entre deux scans
    resetScan() {
      this.scanSuccess = false
      this.error = null
      this.lastCheckin = null
    },
  },
})
