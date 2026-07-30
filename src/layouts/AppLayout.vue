<template>
    <div class="flex h-screen bg-[#faf8ff] overflow-hidden">
        <!-- DESKTOP SIDEBAR (>= 1024px) -->
        <aside
            v-show="!mobileMenuOpen"
            class="hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 flex-shrink-0 h-screen overflow-hidden"
            :class="sidebarExpanded ? 'w-[260px]' : 'w-[72px]'"
            @mouseenter="sidebarExpanded = true"
            @mouseleave="sidebarExpanded = false"
        >
            <!-- Logo -->
            <div class="flex items-center h-16 px-4 border-b border-gray-100 flex-shrink-0" :class="sidebarExpanded ? 'justify-between' : 'justify-center'">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span class="material-symbols-outlined text-white text-lg">bolt</span>
                    </div>
                    <span v-show="sidebarExpanded" class="font-black text-[#131b2e] text-lg tracking-tight whitespace-nowrap">KINETIC</span>
                </div>
                <button v-show="sidebarExpanded" @click="sidebarExpanded = false" class="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0">
                    <span class="material-symbols-outlined text-gray-500 text-sm">chevron_left</span>
                </button>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide space-y-1">
                <router-link v-for="item in navItems" :key="item.to"
                    :to="item.to"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                    :class="isActive(item.to)
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-[#464554] hover:bg-gray-50 hover:text-[#131b2e]'"
                >
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                        :class="isActive(item.to) ? 'bg-indigo-100 text-indigo-600' : 'text-[#464554] group-hover:bg-gray-100'">
                        <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
                    </div>
                    <span v-show="sidebarExpanded" class="text-sm font-medium whitespace-nowrap">{{ item.label }}</span>
                </router-link>
            </nav>

            <!-- User bottom -->
            <div class="border-t border-gray-100 px-3 py-3 flex-shrink-0">
                <div class="relative">
                    <button @click="userMenuOpen = !userMenuOpen"
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        :class="sidebarExpanded ? '' : 'justify-center'"
                    >
                        <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                            {{ authStore.user?.name?.charAt(0).toUpperCase() || 'A' }}
                        </div>
                        <template v-if="sidebarExpanded">
                            <div class="flex-1 min-w-0 text-left">
                                <p class="text-sm font-semibold text-[#131b2e] truncate">{{ authStore.user?.name || 'Admin' }}</p>
                                <p class="text-[10px] uppercase tracking-wider text-gray-400">Connecté</p>
                            </div>
                            <span class="material-symbols-outlined text-gray-400 text-lg">expand_more</span>
                        </template>
                    </button>
                    <transition name="fade">
                        <div v-if="userMenuOpen"
                            class="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                            @click="userMenuOpen = false">
                            <router-link to="/admin/settings" class="flex items-center gap-3 px-4 py-2.5 text-sm text-[#464554] hover:bg-gray-50 hover:text-[#131b2e] transition-colors">
                                <span class="material-symbols-outlined text-lg">settings</span>
                                <span>Paramètres</span>
                            </router-link>
                            <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                <span class="material-symbols-outlined text-lg">logout</span>
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </transition>
                </div>
            </div>
        </aside>

        <!-- MOBILE DRAWER (< 1024px) -->
        <el-drawer v-model="mobileMenuOpen" direction="ltr" size="280px" :with-header="false" :z-index="1000">
            <div class="flex flex-col h-full p-4">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                            <span class="material-symbols-outlined text-white text-lg">bolt</span>
                        </div>
                        <span class="font-black text-[#131b2e] text-lg tracking-tight">KINETIC</span>
                    </div>
                    <button @click="mobileMenuOpen = false" class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <span class="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>
                <nav class="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                    <router-link v-for="item in navItems" :key="item.to"
                        :to="item.to"
                        class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
                        :class="isActive(item.to) ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-[#464554] hover:bg-gray-50'"
                        @click="mobileMenuOpen = false">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                            :class="isActive(item.to) ? 'bg-indigo-100 text-indigo-600' : ''">
                            <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
                        </div>
                        <span class="text-sm font-medium">{{ item.label }}</span>
                    </router-link>
                </nav>
                <div class="border-t border-gray-100 pt-4 mt-auto">
                    <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                        <span class="material-symbols-outlined text-xl">logout</span>
                        <span class="text-sm font-medium">Déconnexion</span>
                    </button>
                </div>
            </div>
        </el-drawer>

        <!-- MAIN CONTENT -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- HEADER -->
            <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30">
                <div class="flex items-center gap-3">
                    <button @click="mobileMenuOpen = true" class="lg:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <span class="material-symbols-outlined text-[#464554] text-2xl">menu</span>
                    </button>
                    <!-- Breadcrumb -->
                    <div class="hidden sm:flex items-center gap-2 text-sm">
                        <span class="text-[#464554] font-medium">{{ currentBreadcrumb }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Wallet badge -->
                    <router-link to="/admin/wallet"
                        class="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                        <span class="material-symbols-outlined text-emerald-600 text-lg">account_balance_wallet</span>
                        <span class="font-bold text-emerald-700 text-sm whitespace-nowrap">{{ walletStore.wallet ? formatWalletAmount(walletStore.wallet.balanceAvailable) : '—' }}</span>
                    </router-link>

                    <!-- Notifications placeholder -->
                    <button class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors relative">
                        <span class="material-symbols-outlined text-[#464554] text-2xl">notifications</span>
                        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <!-- User avatar -->
                    <router-link to="/admin/settings" class="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 hover:opacity-80 transition-opacity">
                        <div class="text-right hidden md:block">
                            <p class="text-sm font-bold text-[#131b2e]">{{ authStore.user?.name || 'Admin' }}</p>
                            <p class="text-[10px] uppercase tracking-wider text-gray-400">Connecté</p>
                        </div>
                        <div class="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                            {{ authStore.user?.name?.charAt(0).toUpperCase() || 'A' }}
                        </div>
                    </router-link>
                </div>
            </header>

            <!-- TRIAL BANNER -->
            <transition name="slide-down">
                <div v-if="subscriptionBanner.show"
                    class="mx-4 lg:mx-6 mt-4 px-5 py-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    :class="subscriptionBanner.class">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-xl">{{ subscriptionBanner.icon }}</span>
                        <p class="text-sm font-medium">{{ subscriptionBanner.message }}</p>
                    </div>
                    <router-link v-if="subscriptionBanner.actionLink" :to="subscriptionBanner.actionLink"
                        class="px-4 py-1.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
                        :class="subscriptionBanner.actionClass">
                        {{ subscriptionBanner.actionText }}
                    </router-link>
                </div>
            </transition>

            <!-- PAGE CONTENT -->
            <main class="flex-1 overflow-y-auto p-4 lg:p-6">
                <router-view v-slot="{ Component }">
                    <transition name="fade-up" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </main>
        </div>

        <!-- MOBILE BOTTOM NAV (< 640px) -->
        <nav class="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-1 z-50 shadow-2xl safe-area-bottom">
            <router-link v-for="item in bottomNavItems" :key="item.to"
                :to="item.to"
                class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[44px] min-h-[44px] justify-center"
                :class="isActive(item.to) ? 'text-indigo-600' : 'text-gray-400'">
                <span class="material-symbols-outlined text-2xl" :class="isActive(item.to) ? 'font-variation-settings-filled' : ''">{{ item.icon }}</span>
                <span class="text-[10px] font-medium leading-none">{{ item.label }}</span>
            </router-link>
        </nav>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGymAuthStore } from '@/stores/gymAuth'
import { useWalletStore } from '@/stores/wallet'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const gymAuthStore = useGymAuthStore()
const walletStore = useWalletStore()
const sidebarExpanded = ref(true)
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

function formatWalletAmount(v) {
    return ((v || 0)).toLocaleString('fr-FR') + ' FCFA'
}

function isActive(path) {
    if (path === '/admin/dashboard') return route.path === '/admin/dashboard'
    return route.path.startsWith(path)
}

const currentBreadcrumb = computed(() => {
    const map = {
        'dashboard': 'Tableau de bord',
        'clients': 'Clients',
        'subscriptions': 'Abonnements',
        'payments': 'Paiements',
        'orders': 'Commandes',
        'products': 'Produits',
        'categories': 'Catégories',
        'users': 'Utilisateurs',
        'wallet': 'Porte-monnaie',
        'settings': 'Paramètres',
        'gym': 'Ma salle',
        'subscription-types': "Types d'abonnement",
    }
    const name = route.name?.toString().replace('admin-', '')
    return map[name] || 'Dashboard'
})

const navItems = [
    { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/admin/clients', icon: 'group', label: 'Clients' },
    { to: '/admin/subscriptions', icon: 'card_membership', label: 'Abonnements' },
    { to: '/admin/payments', icon: 'payments', label: 'Paiements' },
    { to: '/admin/orders', icon: 'shopping_bag', label: 'Commandes' },
    { to: '/admin/products', icon: 'inventory_2', label: 'Produits' },
    { to: '/admin/categories', icon: 'category', label: 'Catégories' },
    { to: '/admin/users', icon: 'manage_accounts', label: 'Utilisateurs' },
    { to: '/admin/wallet', icon: 'account_balance_wallet', label: 'Porte-monnaie' },
    { to: '/admin/subscription-types', icon: 'style', label: "Types d'abonnement" },
    { to: '/scan', icon: 'qr_code_scanner', label: 'Scanner QR' },
    { to: '/admin/settings', icon: 'settings', label: 'Paramètres' },
]

const bottomNavItems = [
    { to: '/admin/dashboard', icon: 'dashboard', label: 'Accueil' },
    { to: '/admin/clients', icon: 'group', label: 'Clients' },
    { to: '/scan', icon: 'qr_code_scanner', label: 'Scanner' },
    { to: '/admin/products', icon: 'inventory_2', label: 'Produits' },
    { to: '/admin/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
]

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

const subscriptionBanner = computed(() => {
    const s = gymAuthStore.subscription
    if (!s) return { show: false }
    if (s.status === 'expired') {
        return {
            show: true,
            class: 'bg-red-50 border border-red-200 text-red-700',
            icon: 'error',
            message: 'Votre abonnement a expiré. Renouvelez-le pour continuer à utiliser Kinetic Pulse.',
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
            message: `Votre essai gratuit expire dans ${s.daysLeft} jour${s.daysLeft > 1 ? 's' : ''}. Souscrivez à la formule Premium.`,
            actionLink: '/admin/gym/subscription',
            actionText: 'Souscrire',
            actionClass: 'bg-amber-600 text-white hover:bg-amber-700',
        }
    }
    return { show: false }
})

onMounted(async () => {
    if (gymAuthStore.token || authStore.token) {
        try {
            const { data } = await api.get('/gym/profile')
            gymAuthStore.gym = data
            localStorage.setItem('gym_gym', JSON.stringify(data))
        } catch {
            gymAuthStore.gym = null
            localStorage.removeItem('gym_gym')
        }
    }
    if (gymAuthStore.token) {
        gymAuthStore.fetchSubscription().catch(() => {})
    }
    walletStore.fetchWallet().catch(() => {})

    const savedSidebar = localStorage.getItem('sidebar_expanded')
    if (savedSidebar !== null) {
        sidebarExpanded.value = savedSidebar === 'true'
    }
})
</script>

<style scoped>
.safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
}
.font-variation-settings-filled {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
