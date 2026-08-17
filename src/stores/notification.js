import { defineStore } from 'pinia'
import gymHttp from '@/plugins/gymHttp'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  }),

  actions: {
    // GET /api/notifications
    async fetchNotifications() {
      this.loading = true
      this.error = null
      try {
        const { data } = await gymHttp.get('/notifications')
        this.notifications = data.notifications || []
        this.unreadCount = data.unread_count || 0
        return data
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur chargement notifications'
        throw err
      } finally {
        this.loading = false
      }
    },

    // GET /api/notifications/unread-count
    async fetchUnreadCount() {
      try {
        const { data } = await gymHttp.get('/notifications/unread-count')
        this.unreadCount = data.count || 0
        return data.count || 0
      } catch (err) {
        return 0
      }
    },

    // PATCH /api/notifications/{id}/read
    async markRead(id) {
      try {
        await gymHttp.patch(`/notifications/${id}/read`)
        const n = this.notifications.find((x) => x.id === id)
        if (n && !n.is_read) {
          n.is_read = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur mise à jour notification'
      }
    },

    // PATCH /api/notifications/read-all
    async markAllRead() {
      try {
        await gymHttp.patch('/notifications/read-all')
        this.notifications.forEach((n) => { n.is_read = true })
        this.unreadCount = 0
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur mise à jour notifications'
      }
    },
  },
})