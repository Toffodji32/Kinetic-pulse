<template>
    <div>
        <div v-if="loading" class="flex items-center justify-center py-20 text-indigo-400 font-bold">
            <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Chargement...
        </div>

        <div v-else-if="error" class="text-center py-20 text-red-400">{{ error }}</div>

        <template v-else-if="gym">
            <router-link to="/super-admin/gyms"
                class="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
                <span class="material-symbols-outlined text-base">arrow_back</span>
                Retour aux salles
            </router-link>

            <div class="bg-[#16161d] border border-white/5 rounded-xl p-6 mb-6">
                <div class="flex items-center gap-4 mb-6">
                    <div v-if="gym.logo" class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img :src="gym.logo" class="w-full h-full object-cover" />
                    </div>
                    <div v-else
                        class="w-16 h-16 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-300 font-bold text-2xl flex-shrink-0">
                        {{ gym.name?.charAt(0).toUpperCase() || 'G' }}
                    </div>
                    <div>
                        <h2 class="text-2xl font-black font-headline text-white">{{ gym.name }}</h2>
                        <p class="text-gray-400">/{{ gym.slug }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-[#0f0f13] rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                        <p class="text-sm text-white">{{ gym.email || '—' }}</p>
                    </div>
                    <div class="bg-[#0f0f13] rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Téléphone</p>
                        <p class="text-sm text-white">{{ gym.phone || '—' }}</p>
                    </div>
                    <div class="bg-[#0f0f13] rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Adresse</p>
                        <p class="text-sm text-white">{{ gym.address || '—' }}</p>
                    </div>
                    <div class="bg-[#0f0f13] rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Créé le</p>
                        <p class="text-sm text-white">{{ formatDate(gym.createdAt) }}</p>
                    </div>
                    <div class="bg-[#0f0f13] rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Utilisateurs</p>
                        <p class="text-sm text-white">{{ gym.usersCount }}</p>
                    </div>
                    <div class="bg-[#0f0f13] rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Clients</p>
                        <p class="text-sm text-white">{{ gym.clientsCount }}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="bg-[#16161d] border border-white/5 rounded-xl p-6">
                    <h3 class="text-lg font-bold text-white mb-4">Abonnement</h3>
                    <div v-if="gym.subscription" class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-400 text-sm">Statut</span>
                            <span class="text-sm font-semibold"
                                :class="statusTextClass(gym.subscription.status)">
                                {{ statusLabel(gym.subscription.status) }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400 text-sm">Formule</span>
                            <span class="text-sm text-white font-semibold">{{ gym.subscription.planType }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400 text-sm">Montant</span>
                            <span class="text-sm text-white font-semibold">{{ formatCurrency(gym.subscription.amount) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400 text-sm">Fin d'essai</span>
                            <span class="text-sm text-white">{{ formatDate(gym.subscription.trialEndsAt) || '—' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400 text-sm">Début abonnement</span>
                            <span class="text-sm text-white">{{ formatDate(gym.subscription.startsAt) || '—' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400 text-sm">Fin abonnement</span>
                            <span class="text-sm text-white">{{ formatDate(gym.subscription.endsAt) || '—' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400 text-sm">Transaction FedaPay</span>
                            <span class="text-sm text-white">{{ gym.subscription.fedapayTransactionId || '—' }}</span>
                        </div>
                    </div>
                    <p v-else class="text-gray-500 text-sm">Aucun abonnement</p>
                </div>

                <div class="bg-[#16161d] border border-white/5 rounded-xl p-6">
                    <h3 class="text-lg font-bold text-white mb-4">Description</h3>
                    <p class="text-sm text-gray-300">{{ gym.description || 'Aucune description' }}</p>

                    <div class="mt-6 pt-4 border-t border-white/5">
                        <h4 class="text-sm font-semibold text-gray-300 mb-3">Chiffre d'affaire</h4>
                        <p class="text-2xl font-black text-green-400">{{ formatCurrency(gym.totalRevenue) }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-[#16161d] border border-white/5 rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-4">Utilisateurs ({{ gym.users?.length || 0 }})</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th class="text-left px-4 py-3 font-semibold">Nom</th>
                                <th class="text-left px-4 py-3 font-semibold">Email</th>
                                <th class="text-left px-4 py-3 font-semibold">Rôles</th>
                                <th class="text-left px-4 py-3 font-semibold">Créé le</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                            <tr v-for="u in gym.users" :key="u.id" class="hover:bg-white/[0.02]">
                                <td class="px-4 py-3 text-white font-medium">{{ u.name }}</td>
                                <td class="px-4 py-3 text-gray-400">{{ u.email }}</td>
                                <td class="px-4 py-3">
                                    <span v-for="role in u.roles" :key="role"
                                        class="inline-block px-2 py-0.5 rounded text-xs font-semibold mr-1"
                                        :class="role === 'ROLE_SUPER_ADMIN' ? 'bg-indigo-500/20 text-indigo-300' : role === 'ROLE_ADMIN' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'">
                                        {{ role }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-400 text-xs">{{ formatDate(u.createdAt) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-if="!gym.users?.length" class="text-center py-8 text-gray-500">Aucun utilisateur</p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const loading = ref(true)
const error = ref(null)
const gym = ref(null)

const formatCurrency = (val) => {
    if (!val && val !== 0) return '—'
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val) + ' FCFA'
}

const formatDate = (d) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusLabel = (s) => {
    const map = { active: 'Actif', trial: 'Essai', expired: 'Expiré', cancelled: 'Annulé' }
    return map[s] || s || '—'
}

const statusTextClass = (s) => {
    const map = { active: 'text-green-400', trial: 'text-amber-400', expired: 'text-red-400', cancelled: 'text-gray-400' }
    return map[s] || 'text-gray-400'
}

onMounted(async () => {
    try {
        const { data } = await api.get(`/super-admin/gyms/${route.params.id}`)
        gym.value = data
    } catch (e) {
        error.value = e.response?.data?.error || 'Erreur de chargement'
    } finally {
        loading.value = false
    }
})
</script>
