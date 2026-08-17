<template>
    <div class="min-h-screen flex">
        <!-- Left: Image side -->
        <div class="hidden lg:block w-1/2 bg-cover bg-center relative"
            style="background-image: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop');">
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            <div class="absolute bottom-12 left-12 text-white">
                <p class="text-5xl font-black tracking-tight leading-tight">
                    Gérez votre<br />salle de sport
                </p>
                <p class="text-lg text-white/70 mt-4 font-medium">
                    Kinetic Pulse — la plateforme tout-en-un pour les salles de fitness
                </p>
            </div>
        </div>

        <!-- Right: Form side -->
        <div class="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#0f0f13]">
            <div class="w-full max-w-sm">
                <!-- Logo -->
                <div class="mb-12">
                    <h1 class="text-3xl font-black tracking-tighter text-white font-headline">
                        Kinetic <span class="text-indigo-500">Pulse</span>
                    </h1>
                    <p class="text-sm text-zinc-500 mt-2 font-medium">Connectez-vous à votre tableau de bord</p>
                </div>

                <!-- Form -->
                <form class="space-y-5" @submit.prevent="handleLogin">

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Email</label>
                        <input v-model="email" type="email" placeholder="admin@masalle.com"
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                        <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Mot de passe</label>
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                        <p v-if="errors.password" class="text-red-400 text-xs mt-1">{{ errors.password }}</p>
                    </div>

                    <div v-if="errorMessage"
                        class="text-red-400 text-sm text-center bg-red-500/10 py-2.5 px-4 rounded-xl border border-red-500/20">
                        {{ errorMessage }}
                    </div>

                    <button type="submit" :disabled="loading"
                        class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ loading ? 'Connexion...' : 'Se connecter' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({ email: '', password: '' })

const validateForm = () => {
    let valid = true
    errors.value = { email: '', password: '' }

    if (!email.value) {
        errors.value.email = 'Email obligatoire'
        valid = false
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = "Format d'email invalide"
        valid = false
    }

    if (!password.value) {
        errors.value.password = 'Mot de passe obligatoire'
        valid = false
    } else if (password.value.length < 6) {
        errors.value.password = 'Minimum 6 caractères'
        valid = false
    }

    return valid
}

const handleLogin = async () => {
    if (!validateForm()) return

    loading.value = true
    errorMessage.value = ''

    try {
        await authStore.login(email.value, password.value)
        const isSuperAdmin = authStore.user?.roles?.includes('ROLE_SUPER_ADMIN')
        const redirect = route.query.redirect || (isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard')
        router.replace(redirect)
    } catch (err) {
        errorMessage.value = authStore.error || 'Email ou mot de passe incorrect'
    } finally {
        loading.value = false
    }
}
</script>
