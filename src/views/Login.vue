<template>
    <div class="dark">
        <div class="bg-gym-background text-gym-on-surface font-body min-h-screen bg-pattern relative overflow-hidden">

            <!-- Background Glows -->
            <div class="absolute top-1/4 -left-20 w-96 h-96 bg-gym-primary opacity-[0.08] blur-[120px] rounded-full"></div>
            <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-gym-secondary opacity-[0.08] blur-[120px] rounded-full"></div>

            <!-- NAVBAR -->
            <nav class="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent backdrop-blur-2xl">
                <div class="font-headline text-2xl font-bold tracking-tighter text-slate-50">
                    Kinetic Pulse
                </div>
                <router-link to="/register"
                    class="bg-gym-primary-container text-gym-on-primary-container px-6 py-2 rounded-full font-bold transition-all hover:scale-105 active:scale-95">
                    Sign Up
                </router-link>
            </nav>

            <!-- MAIN -->
            <main class="relative min-h-screen flex items-center justify-center pt-20 pb-12 z-10">
                <section class="relative z-10 w-full max-w-md px-6">
                    <div class="glass-card neo-shadow rounded-3xl p-8 md:p-10 flex flex-col items-center">

                        <!-- Header -->
                        <header class="text-center mb-10">
                            <h1 class="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-gym-on-surface mb-2">
                                Welcome Back
                            </h1>
                            <p class="text-gym-on-surface-variant font-medium">Step into the nocturnal energy.</p>
                        </header>

                        <!-- Form -->
                        <form class="w-full space-y-6" @submit.prevent="handleLogin">

                            <!-- Email -->
                            <div class="group">
                                <label class="block text-xs font-bold uppercase tracking-widest text-gym-on-surface-variant mb-2 group-focus-within:text-gym-primary transition-colors">
                                    Email
                                </label>
                                <div class="relative">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gym-outline text-lg">alternate_email</span>
                                    <input v-model="email" type="email" placeholder="runner@kinetic.pulse"
                                        class="w-full bg-gym-surface-low border-none rounded-xl py-4 pl-12 pr-4 text-gym-on-surface placeholder:text-gym-outline focus:ring-2 focus:ring-gym-primary-fixed focus:bg-gym-surface-container transition-all outline-none" />
                                </div>
                                <p v-if="errors.email" class="text-gym-error text-xs mt-1">{{ errors.email }}</p>
                            </div>

                            <!-- Password -->
                            <div class="group">
                                <div class="flex justify-between items-center mb-2">
                                    <label class="block text-xs font-bold uppercase tracking-widest text-gym-on-surface-variant">
                                        Mot de Passe
                                    </label>
                                    <a class="text-[10px] font-bold uppercase tracking-widest text-gym-primary-dim hover:text-gym-primary transition-colors" href="#">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div class="relative">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gym-outline text-lg">lock_open</span>
                                    <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                        placeholder="••••••••"
                                        class="w-full bg-gym-surface-low border-none rounded-xl py-4 pl-12 pr-12 text-gym-on-surface placeholder:text-gym-outline focus:ring-2 focus:ring-gym-primary-fixed focus:bg-gym-surface-container transition-all outline-none" />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute right-4 top-1/2 -translate-y-1/2 text-gym-outline hover:text-gym-primary transition-colors">
                                        <span class="material-symbols-outlined text-lg">
                                            {{ showPassword ? 'visibility_off' : 'visibility' }}
                                        </span>
                                    </button>
                                </div>
                                <p v-if="errors.password" class="text-gym-error text-xs mt-1">{{ errors.password }}</p>
                            </div>

                            <!-- Error API -->
                            <div v-if="errorMessage"
                                class="text-gym-error text-sm text-center bg-gym-error-container/20 py-2 px-4 rounded-xl">
                                {{ errorMessage }}
                            </div>

                            <!-- Submit -->
                            <button type="submit" :disabled="loading"
                                class="w-full py-4 bg-gradient-to-r from-gym-primary to-gym-primary-container rounded-full text-gym-on-primary-container font-headline font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gym-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="loading">Loading...</span>
                                <span v-else>Log In</span>
                            </button>

                        </form>

                        <!-- Divider -->
                        <div class="w-full flex items-center gap-4 my-8">
                            <div class="h-px flex-1 bg-gym-outline-variant/30"></div>
                            <span class="text-[10px] font-bold uppercase tracking-widest text-gym-on-surface-variant">Social Synergy</span>
                            <div class="h-px flex-1 bg-gym-outline-variant/30"></div>
                        </div>

                        <!-- Social Buttons -->
                        <div class="grid grid-cols-2 gap-4 w-full">
                            <button class="flex items-center justify-center gap-3 py-3 bg-gym-surface-high rounded-xl hover:bg-gym-surface-highest transition-all border border-gym-outline-variant/10">
                                <span class="text-sm font-semibold text-gym-on-surface">Google</span>
                            </button>
                            <button class="flex items-center justify-center gap-3 py-3 bg-gym-surface-high rounded-xl hover:bg-gym-surface-highest transition-all border border-gym-outline-variant/10">
                                <span class="material-symbols-outlined text-sm text-gym-on-surface">ios</span>
                                <span class="text-sm font-semibold text-gym-on-surface">Apple</span>
                            </button>
                        </div>

                        <p class="mt-10 text-sm text-gym-on-surface-variant">
                            New to the nocturnal circuit?
                            <router-link to="/register" class="text-gym-primary-dim font-bold hover:underline ml-1">Sign Up</router-link>
                        </p>

                    </div>
                </section>
            </main>

            <!-- FOOTER -->
            <footer class="w-full py-8 flex flex-col md:flex-row justify-between items-center px-8 border-t border-slate-800/20">
                <div class="text-xs uppercase tracking-widest text-slate-500 mb-4 md:mb-0">
                    © 2024 Kinetic Pulse. Engineered for Performance.
                </div>
                <div class="flex gap-8">
                    <a class="text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-all" href="#">Privacy</a>
                    <a class="text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-all" href="#">Terms</a>
                    <a class="text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-all" href="#">Support</a>
                </div>
            </footer>

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
        const redirect = route.query.redirect || '/admin/dashboard'
        router.replace(redirect)
    } catch (err) {
        errorMessage.value = authStore.error || 'Email ou mot de passe incorrect'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.glass-card {
    background: rgba(35, 38, 44, 0.4);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(70, 72, 77, 0.15);
}

.neo-shadow {
    box-shadow: 0 0 40px -10px rgba(105, 218, 255, 0.1);
}

.bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2369daff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>