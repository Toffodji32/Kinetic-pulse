<template>
    <div>
        <div class="mb-8">
            <h2 class="text-2xl font-black font-headline tracking-tight text-white">Super Dashboard</h2>
            <p class="text-gray-400 font-medium">Vue d'ensemble de toutes les salles de sport</p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20 text-indigo-400 font-bold">
            <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Chargement...
        </div>

        <template v-else>
            <!-- Stats cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Total Salles</span>
                        <span class="material-symbols-outlined text-indigo-400">fitness_center</span>
                    </div>
                    <p class="text-3xl font-black text-white">{{ stats.gyms.total }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                        <span class="text-green-400">+{{ stats.gyms.newThisMonth }}</span> ce mois-ci
                    </p>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Clients</span>
                        <span class="material-symbols-outlined text-blue-400">group</span>
                    </div>
                    <p class="text-3xl font-black text-white">{{ stats.clients.total }}</p>
                    <p class="text-xs text-gray-500 mt-1">Membres inscrits</p>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Revenu Abonnements</span>
                        <span class="material-symbols-outlined text-green-400">payments</span>
                    </div>
                    <p class="text-3xl font-black text-white">{{ formatCurrency(stats.subscriptions.revenue) }}</p>
                    <p class="text-xs text-gray-500 mt-1">Total actif</p>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Revenu du jour</span>
                        <span class="material-symbols-outlined text-amber-400">trending_up</span>
                    </div>
                    <p class="text-3xl font-black text-white">{{ formatCurrency(stats.orders.todayRevenue) }}</p>
                    <p class="text-xs text-gray-500 mt-1">Commandes boutique</p>
                </div>
            </div>

            <!-- Gym status breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <h3 class="text-sm font-semibold text-gray-300 mb-4">Statut des abonnements</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-green-400"></span>
                                <span class="text-sm text-gray-400">Actifs</span>
                            </div>
                            <span class="text-sm font-bold text-white">{{ stats.gyms.active }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                                <span class="text-sm text-gray-400">Essai</span>
                            </div>
                            <span class="text-sm font-bold text-white">{{ stats.gyms.trial }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-red-400"></span>
                                <span class="text-sm text-gray-400">Expirés</span>
                            </div>
                            <span class="text-sm font-bold text-white">{{ stats.gyms.expired }}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <h3 class="text-sm font-semibold text-gray-300 mb-4">Utilisateurs</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Administrateurs</span>
                            <span class="text-sm font-bold text-white">{{ stats.users.total }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Produits</span>
                            <span class="text-sm font-bold text-white">{{ stats.products.total }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Commandes</span>
                            <span class="text-sm font-bold text-white">{{ stats.orders.total }}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <h3 class="text-sm font-semibold text-gray-300 mb-4">Aujourd'hui</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Check-ins</span>
                            <span class="text-sm font-bold text-white">{{ stats.checkins.today }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Revenu boutique</span>
                            <span class="text-sm font-bold text-white">{{ formatCurrency(stats.orders.todayRevenue) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

const loading = ref(true)
const stats = ref({
    gyms: { total: 0, newThisMonth: 0, trial: 0, active: 0, expired: 0 },
    clients: { total: 0 },
    users: { total: 0 },
    products: { total: 0 },
    orders: { total: 0, todayRevenue: 0 },
    subscriptions: { revenue: 0 },
    checkins: { today: 0 },
})

const formatCurrency = (val) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val) + ' FCFA'
}

onMounted(async () => {
    try {
        const { data } = await api.get('/super-admin/dashboard')
        stats.value = data
    } catch (e) {
        console.error('Failed to load super admin stats', e)
    } finally {
        loading.value = false
    }
})
</script>
