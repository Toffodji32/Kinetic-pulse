<template>
  <transition name="fade-up" mode="out-in">
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20 animate-fade-in">
            <span class="material-symbols-outlined text-white text-3xl">bolt</span>
          </div>
          <h1 class="text-3xl font-black text-[#131b2e] tracking-tight">Kinetic Pulse</h1>
          <p class="text-[#464554] mt-2">Connectez-vous à votre espace</p>
        </div>
        <div class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <el-form @submit.prevent="handleLogin" label-position="top" size="large">
            <el-form-item label="Email">
              <el-input v-model="email" type="email" placeholder="vous@exemple.com" />
            </el-form-item>
            <el-form-item label="Mot de passe">
              <el-input v-model="password" type="password" show-password placeholder="••••••••" />
            </el-form-item>
            <div class="flex items-center justify-between mb-6">
              <el-checkbox v-model="remember">Se souvenir de moi</el-checkbox>
              <router-link to="/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Mot de passe oublié ?</router-link>
            </div>
            <el-button type="primary" size="large" class="w-full" :loading="loading" native-type="submit" style="height:48px; border-radius:12px; font-weight:700;">
              Se connecter
            </el-button>
          </el-form>
          <p class="text-center text-sm text-[#464554] mt-6">
            Pas encore de compte ?
            <router-link to="/register-gym" class="text-indigo-600 font-semibold hover:text-indigo-700">Créer un espace</router-link>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    ElMessage.error('Veuillez remplir tous les champs')
    return
  }
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    const isSuperAdmin = authStore.user?.roles?.includes('ROLE_SUPER_ADMIN')
    const redirect = route.query.redirect || (isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard')
    router.replace(redirect)
  } catch {
    ElMessage.error(authStore.error || 'Email ou mot de passe incorrect')
  } finally {
    loading.value = false
  }
}
</script>
