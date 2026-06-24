<template>
    <div class="flex bg-[#faf8ff] min-h-screen">
        <!-- SIDEBAR -->
        <aside class="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-[#f2f3ff] flex flex-col gap-2 p-6 z-50">
            <div class="mb-8">
                <h1 class="text-xl font-bold font-headline text-slate-900 tracking-tight">Kinetic Ledger</h1>
                <p class="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">Premium Fitness Admin
                </p>
            </div>

            <nav class="flex flex-col gap-1 flex-1">
                <router-link to="/admin/dashboard"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/dashboard' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">dashboard</span>
                    <span class="text-sm font-medium">Dashboard</span>
                </router-link>

                <router-link to="/admin/clients"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/clients' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">group</span>
                    <span class="text-sm font-medium">Clients</span>
                </router-link>

                <router-link to="/admin/subscriptions"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/subscriptions' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">card_membership</span>
                    <span class="text-sm font-medium">Subscriptions</span>
                </router-link>

                <router-link to="/admin/payments"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/payments' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">payments</span>
                    <span class="text-sm font-medium">Payments</span>
                </router-link>

                <router-link to="/admin/orders"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/orders' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">shopping_bag</span>
                    <span class="text-sm font-medium">Orders</span>
                </router-link>

                <router-link to="/admin/products"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/products' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">inventory_2</span>
                    <span class="text-sm font-medium">Products</span>
                </router-link>

                <router-link to="/admin/users"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/users' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">manage_accounts</span>
                    <span class="text-sm font-medium">Users</span>
                </router-link>

                <router-link to="/admin/categories"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/categories' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">category</span>
                    <span class="text-sm font-medium">Catégories</span>
                </router-link>

                <router-link to="/admin/settings"
                    class="flex items-center gap-3 px-4 py-2 text-slate-500 hover:bg-white/50 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200">
                    <span class="material-symbols-outlined">settings</span>
                    <span class="text-sm font-medium">Settings</span>
                </router-link>

                <hr class="my-2 border-slate-200/50">

                <router-link to="/admin/gym/subscription"
                    class="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/gym/subscription' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">workspace_premium</span>
                    <span class="text-sm font-medium">Abonnement</span>
                </router-link>

                <router-link v-if="hasShopFeature && gymAuthStore.gym?.slug" :to="`/shop/${gymAuthStore.gym.slug}`" target="_blank"
                    class="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/shop' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">storefront</span>
                    <span class="text-sm font-medium">Boutique</span>
                </router-link>
            </nav>

            <!-- Footer Sidebar -->
            <div class="mt-auto pt-6 border-t border-slate-200/50 flex flex-col gap-1">

                <router-link to="/admin/gym/info"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200 text-slate-500 hover:bg-white/50 mb-2">
                    <div v-if="gymAuthStore.gym?.logo"
                        class="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                        <img :src="gymAuthStore.gym.logo" class="w-full h-full object-cover" />
                    </div>
                    <div v-else
                        class="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                        {{ gymAuthStore.gym?.name?.charAt(0).toUpperCase() || 'G' }}
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-slate-800 truncate">{{ gymAuthStore.gym?.name || 'Ma salle' }}</p>
                        <p class="text-[10px] uppercase tracking-wider text-slate-400">Gérer la salle</p>
                    </div>
                </router-link>

                <button @click="handleLogout"
                    class="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-white/50 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200 w-full text-left">
                    <span class="material-symbols-outlined">logout</span>
                    <span class="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <div class="ml-64 flex-1 min-h-screen bg-[#faf8ff] text-[#131b2e]">
            <!-- TOPBAR -->
            <header
                class="sticky top-0 z-40 w-full flex justify-between items-center h-20 px-8 bg-white/80 backdrop-blur-xl shadow-sm">

                <div></div>

                <router-link to="/admin/settings" class="flex items-center gap-3 pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity">
                    <div class="text-right">
                        <p class="text-sm font-bold text-[#131b2e]">{{ authStore.user?.name || 'Admin' }}</p>
                        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500">Connecté</p>
                    </div>
                    <div
                        class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                        {{ authStore.user?.name?.charAt(0).toUpperCase() || 'A' }}
                    </div>
                </router-link>
            </header>

            <!-- TRIAL BANNER -->
            <div v-if="subscriptionBanner.show"
                class="mx-8 mt-4 px-6 py-3 rounded-xl flex items-center justify-between gap-4"
                :class="subscriptionBanner.class"
                style="transition: all 0.3s ease;">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-xl">{{ subscriptionBanner.icon }}</span>
                    <p class="text-sm font-medium">{{ subscriptionBanner.message }}</p>
                </div>
                <router-link v-if="subscriptionBanner.actionLink"
                    :to="subscriptionBanner.actionLink"
                    class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
                    :class="subscriptionBanner.actionClass">
                    {{ subscriptionBanner.actionText }}
                </router-link>
            </div>

            <!-- PAGE CONTENT -->
            <main class="p-8 max-w-7xl mx-auto">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGymAuthStore } from '@/stores/gymAuth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const gymAuthStore = useGymAuthStore()

const hasShopFeature = computed(() => {
    const s = gymAuthStore.subscription
    if (!s) return false
    return s.status === 'trial' || (s.status === 'active' && s.planType === 'premium')
})

const subscriptionBanner = computed(() => {
    const s = gymAuthStore.subscription
    if (!s) return { show: false }

    if (s.status === 'expired') {
        return {
            show: true,
            class: 'bg-red-50 border border-red-200 text-red-700',
            icon: 'error',
            message: 'Votre abonnement a expire. Renouvelez-le pour continuer a utiliser Kinetic Pulse.',
            actionLink: '/admin/gym/subscription',
            actionText: 'Renouveler',
            actionClass: 'bg-red-600 text-white hover:bg-red-700',
        }
    }

    if (s.status === 'trial' && s.daysLeft <= 3) {
        return {
            show: true,
            class: 'bg-amber-50 border border-amber-200 text-amber-700',
            icon: 'timer',
            message: `Votre essai gratuit expire dans ${s.daysLeft} jour${s.daysLeft > 1 ? 's' : ''}. Souscrivez a la formule Premium.`,
            actionLink: '/admin/gym/subscription',
            actionText: 'Souscrire',
            actionClass: 'bg-amber-600 text-white hover:bg-amber-700',
        }
    }

    return { show: false }
})

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

import api from '@/plugins/axios'

onMounted(async () => {
    if (gymAuthStore.token || authStore.token) {
        try {
            const { data } = await api.get('/gym/profile')
            if (!gymAuthStore.gym) {
                gymAuthStore.gym = data
                localStorage.setItem('gym_gym', JSON.stringify(data))
            }
        } catch {}
    }
    if (gymAuthStore.token) {
        gymAuthStore.fetchSubscription().catch(() => {})
    }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
</style>