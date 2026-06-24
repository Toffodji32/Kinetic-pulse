<template>
    <div>
        <div class="mb-8">
            <h2 class="text-2xl font-black font-headline tracking-tight text-white">Super Dashboard</h2>
            <p class="text-gray-400 font-medium">Vue d'ensemble de votre plateforme SaaS</p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20 text-indigo-400 font-bold">
            <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Chargement...
        </div>

        <template v-else>
            <!-- KPIs principaux -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Salles inscrites</span>
                        <span class="material-symbols-outlined text-indigo-400">fitness_center</span>
                    </div>
                    <p class="text-3xl font-black text-white">{{ stats.gyms.total }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                        <span class="text-green-400">+{{ stats.gyms.newThisMonth }}</span> ce mois-ci
                        <span v-if="stats.gyms.newToday" class="text-green-400 ml-2">+{{ stats.gyms.newToday }} aujourd'hui</span>
                    </p>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Abonnements actifs</span>
                        <span class="material-symbols-outlined text-green-400">workspace_premium</span>
                    </div>
                    <p class="text-3xl font-black text-white">{{ stats.gyms.active }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                        <span class="text-amber-400">{{ stats.gyms.trial }}</span> en essai ·
                        <span class="text-red-400">{{ stats.gyms.expired }}</span> expirés
                    </p>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Revenu mensuel (MRR)</span>
                        <span class="material-symbols-outlined text-emerald-400">trending_up</span>
                    </div>
                    <p class="text-3xl font-black text-white">{{ formatCurrency(stats.subscriptions.mrr) }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ stats.gyms.active }} salle{{ stats.gyms.active > 1 ? 's' : '' }} payante{{ stats.gyms.active > 1 ? 's' : '' }}</p>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Essais expirant bientôt</span>
                        <span class="material-symbols-outlined text-amber-400">timer</span>
                    </div>
                    <p class="text-3xl font-black text-white">{{ stats.subscriptions.trialsExpiringSoon }}</p>
                    <p class="text-xs text-gray-500 mt-1">Dans les 7 prochains jours</p>
                </div>
            </div>

            <!-- Deuxième ligne de métriques -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <h3 class="text-sm font-semibold text-gray-300 mb-4">Répartition des abonnements</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-green-400">Actifs</span>
                                <span class="text-white font-bold">{{ stats.gyms.active }}</span>
                            </div>
                            <div class="w-full bg-[#0f0f13] rounded-full h-2">
                                <div class="bg-green-400 h-2 rounded-full" :style="barWidth(stats.gyms.active)"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-amber-400">Essai</span>
                                <span class="text-white font-bold">{{ stats.gyms.trial }}</span>
                            </div>
                            <div class="w-full bg-[#0f0f13] rounded-full h-2">
                                <div class="bg-amber-400 h-2 rounded-full" :style="barWidth(stats.gyms.trial)"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-red-400">Expirés</span>
                                <span class="text-white font-bold">{{ stats.gyms.expired }}</span>
                            </div>
                            <div class="w-full bg-[#0f0f13] rounded-full h-2">
                                <div class="bg-red-400 h-2 rounded-full" :style="barWidth(stats.gyms.expired)"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <h3 class="text-sm font-semibold text-gray-300 mb-4">Chiffres clés</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400 text-sm">Revenu total (tout temps)</span>
                            <span class="text-white font-bold">{{ formatCurrency(stats.subscriptions.totalRevenue) }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400 text-sm">Clients (membres)</span>
                            <span class="text-white font-bold">{{ stats.clients.total }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400 text-sm">Utilisateurs (staff)</span>
                            <span class="text-white font-bold">{{ stats.users.total }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400 text-sm">Nouvelles salles aujourd'hui</span>
                            <span class="text-white font-bold">{{ stats.gyms.newToday }}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-5">
                    <h3 class="text-sm font-semibold text-gray-300 mb-4">Dernières salles inscrites</h3>
                    <div v-if="stats.recentGyms.length" class="space-y-3">
                        <div v-for="gym in stats.recentGyms" :key="gym.id"
                            class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                            <div>
                                <p class="text-sm font-medium text-white">{{ gym.name }}</p>
                                <p class="text-xs text-gray-500">{{ gym.email || '—' }}</p>
                            </div>
                            <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
                                :class="statusClass(gym.subscription?.status)">
                                {{ statusLabel(gym.subscription?.status) }}
                            </span>
                        </div>
                    </div>
                    <p v-else class="text-gray-500 text-sm text-center py-4">Aucune salle</p>
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
    gyms: { total: 0, newThisMonth: 0, newToday: 0, trial: 0, active: 0, expired: 0 },
    subscriptions: { mrr: 0, totalRevenue: 0, trialsExpiringSoon: 0 },
    clients: { total: 0 },
    users: { total: 0 },
    recentGyms: [],
})

const formatCurrency = (val) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val) + ' FCFA'
}

const barWidth = (val) => {
    const total = stats.value.gyms.total || 1
    return { width: (val / total * 100) + '%' }
}

const statusClass = (status) => {
    const map = {
        active: 'bg-green-500/10 text-green-300',
        trial: 'bg-amber-500/10 text-amber-300',
        expired: 'bg-red-500/10 text-red-300',
        cancelled: 'bg-gray-500/10 text-gray-400',
    }
    return map[status] || 'bg-gray-500/10 text-gray-400'
}

const statusLabel = (status) => {
    const map = { active: 'Actif', trial: 'Essai', expired: 'Expiré', cancelled: 'Annulé' }
    return map[status] || status || '—'
}

onMounted(async () => {
    try {
        const { data } = await api.get('/super-admin/dashboard')
        stats.value = data
    } catch (e) {
        console.error('Failed to load stats', e)
    } finally {
        loading.value = false
    }
})
</script>
