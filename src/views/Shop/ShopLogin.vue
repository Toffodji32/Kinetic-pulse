<template>
  <transition name="fade-up" mode="out-in">
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20 animate-fade-in">
            <span class="material-symbols-outlined text-white text-3xl">store</span>
          </div>
          <h1 class="text-3xl font-black text-[#131b2e] tracking-tight">Kinetic Pulse</h1>
          <p class="text-[#464554] mt-2">Espace client</p>
        </div>
        <div class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <el-tabs v-model="activeTab" class="mb-6">
            <el-tab-pane label="Connexion" name="login" />
            <el-tab-pane label="Inscription" name="register" />
          </el-tabs>

          <el-form v-if="activeTab === 'login'" ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top" size="large" @submit.prevent="handleLogin">
            <el-form-item label="Email" prop="email">
              <el-input v-model="loginForm.email" type="email" placeholder="vous@exemple.com" />
            </el-form-item>
            <el-form-item label="Mot de passe" prop="password">
              <el-input v-model="loginForm.password" type="password" show-password placeholder="••••••••" />
            </el-form-item>
            <el-button type="primary" size="large" native-type="submit" :loading="loading" class="w-full" style="height:48px; border-radius:12px; font-weight:700;">
              Se connecter
            </el-button>
          </el-form>

          <el-form v-else ref="registerFormRef" :model="registerForm" :rules="registerRules" label-position="top" size="large">
            <el-form-item label="Nom complet" prop="name">
              <el-input v-model="registerForm.name" placeholder="Jean Dupont" />
            </el-form-item>
            <el-form-item label="Numéro de téléphone" prop="phone">
              <el-input v-model="registerForm.phone" placeholder="+229 XXXX XXXX" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="registerForm.email" type="email" placeholder="vous@exemple.com" />
            </el-form-item>
            <el-form-item label="Mot de passe" prop="password">
              <el-input v-model="registerForm.password" type="password" show-password placeholder="••••••••" />
            </el-form-item>
            <el-form-item label="Confirmer le mot de passe" prop="confirmPassword">
              <el-input v-model="registerForm.confirmPassword" type="password" show-password placeholder="••••••••" />
            </el-form-item>
            <el-button type="primary" size="large" :loading="loading" class="w-full" style="height:48px; border-radius:12px; font-weight:700;" @click="handleRegister">
              Créer mon compte
            </el-button>
          </el-form>
        </div>
        <div class="text-center mt-6">
          <router-link :to="gymSlug ? `/shop/${gymSlug}` : '/shop'" class="text-sm text-indigo-600 font-medium hover:text-indigo-700">
            Continuer sans compte
          </router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'
import { useGymAuthStore } from '@/stores/gymAuth'
import { useShopStore } from '@/stores/shop'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const gymSlug = computed(() => route.params.gymSlug || '')
const authStore = useAuthStore()
const gymAuthStore = useGymAuthStore()
const shopStore = useShopStore()

const activeTab = ref('login')
const loading = ref(false)
const loginFormRef = ref(null)
const registerFormRef = ref(null)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({
  name: '', email: '', phone: '', password: '', confirmPassword: ''
})

const loginRules = {
  email: [{ required: true, type: 'email', message: 'Email invalide', trigger: 'blur' }],
  password: [{ required: true, message: 'Mot de passe requis', trigger: 'blur' }],
}

const registerRules = {
  name: [{ required: true, message: 'Nom obligatoire', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: 'Email invalide', trigger: 'blur' }],
  phone: [
    { required: true, message: 'Numéro de téléphone obligatoire', trigger: 'blur' },
    { min: 8, message: 'Minimum 8 chiffres', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Mot de passe obligatoire', trigger: 'blur' },
    { min: 6, message: 'Minimum 6 caractères', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Confirmation requise', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('Les mots de passe ne correspondent pas'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

async function handleLogin() {
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const { data } = await api.post('/login', {
        email: loginForm.value.email,
        password: loginForm.value.password,
      })

      const roles = data.user?.roles || []

      if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_USER')) {
        authStore.token = data.token
        authStore.user = data.user
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push({ name: 'dashboard' })
        return
      }

      localStorage.setItem('gym_token', data.token)
      localStorage.setItem('gym_user', JSON.stringify(data.user))
      gymAuthStore.token = data.token
      gymAuthStore.user = data.user

      const redirect = route.query.redirect
      const defaultShop = gymSlug.value ? `/shop/${gymSlug.value}` : '/shop'
      const safeRedirect = redirect && redirect !== '/shop/login' && redirect !== '/login'
        ? redirect
        : defaultShop

      router.push(safeRedirect)
    } catch {
      ElMessage.error('Email ou mot de passe incorrect')
    } finally {
      loading.value = false
    }
  })
}

async function handleRegister() {
  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const result = await shopStore.register(
        registerForm.value.name,
        registerForm.value.email,
        registerForm.value.phone,
        registerForm.value.password,
        gymSlug.value
      )

      localStorage.setItem('gym_token', result.token)
      localStorage.setItem('gym_user', JSON.stringify(result.user))
      gymAuthStore.token = result.token
      gymAuthStore.user = result.user

      router.push(gymSlug.value ? `/shop/${gymSlug.value}` : { name: 'shop-home' })
    } catch {
      ElMessage.error(shopStore.error || 'Erreur lors de la création du compte')
    } finally {
      loading.value = false
    }
  })
}
</script>
