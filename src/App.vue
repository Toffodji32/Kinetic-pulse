<template>

  <router-view />

</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

// Au démarrage de l'app, si token existe mais pas user, récupérer l'utilisateur
onMounted(async () => {
  console.log('🚀 App montée - Vérification de la session')
  console.log('🔑 Token présent:', !!authStore.token)
  console.log('👤 User présent:', !!authStore.user)

  if (authStore.token && !authStore.user) {
    console.log('📡 Token sans user → appel fetchMe()')
    try {
      await authStore.fetchMe()
      console.log('✅ User récupéré au démarrage')
    } catch (err) {
      console.error('❌ Erreur fetchMe au démarrage:', err)
    }
  }
})
</script>
