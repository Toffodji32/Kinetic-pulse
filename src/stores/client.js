import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    client: null,
    loading: false,
    error: null,
  }),

  actions: {
    // GET /api/clients → [{ id, firstName, lastName, phone, email, photo, registrationDate }]
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/clients')
        this.clients = data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur chargement clients'
      } finally {
        this.loading = false
      }
    },

    // GET /api/clients/{id} → { id, firstName, ..., qrCode, subscription }
    async fetchOne(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/clients/${id}`)
        this.client = data
      } finally {
        this.loading = false
      }
    },

    // POST /api/clients (multipart/form-data car photo)
    // payload: { firstName, lastName, phone, email, photo? (File) }
    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('firstName', payload.firstName)
        formData.append('lastName',  payload.lastName)
        formData.append('phone',     payload.phone)
        formData.append('email',     payload.email)
        if (payload.photo) {
          formData.append('photo', payload.photo)
        }

        const { data } = await api.post('/clients', formData)
        console.log('Client créé:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', data)

        // data = { message, id, qrCode }
        await this.fetchAll()
        console.log('Liste clients après création:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', this.clients)
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur création client'
        throw err
      } finally {
        this.loading = false
      }
    },

    // PUT /api/clients/{id} (multipart/form-data aussi)
    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        if (payload.firstName) formData.append('firstName', payload.firstName)
        if (payload.lastName)  formData.append('lastName',  payload.lastName)
        if (payload.phone)     formData.append('phone',     payload.phone)
        if (payload.email)     formData.append('email',     payload.email)
        if (payload.photo)     formData.append('photo',     payload.photo)

        console.log('Payload AVANT envoi:', payload)

        console.log('FormData AVANT envoi:')
        for (let pair of formData.entries()) {
          console.log(pair[0]+ ': ' + pair[1]);
        }

        const { data } = await api.post(`/clients/${id}`, formData)

        console.log('Réponse backend:', data)

        // recharge la liste avec les qrCodes
        await this.fetchAll()

        // récupère le client complet avec son QR code
        await this.fetchOne(data.id)

        // met à jour la liste locale sans refaire un fetch
        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) this.clients[index] = data.client

        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur modification client'
        throw err
      } finally {
        this.loading = false
      }
    },

    // DELETE /api/clients/{id}
    async remove(id) {
      this.loading = true
      try {
        await api.delete(`/clients/${id}`)
        this.clients = this.clients.filter(c => c.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur suppression'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})