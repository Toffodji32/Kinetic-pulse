<template>
    <div>
        <div class="mb-8">
            <h2 class="text-2xl font-black font-headline tracking-tight text-white">Abonnements</h2>
            <p class="text-gray-400 font-medium">Tous les abonnements SaaS des salles de sport</p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20 text-indigo-400 font-bold">
            <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Chargement...
        </div>

        <template v-else>
            <div class="bg-[#16161d] border border-white/5 rounded-xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th class="text-left px-4 py-3 font-semibold">Salle</th>
                                <th class="text-left px-4 py-3 font-semibold">Statut</th>
                                <th class="text-left px-4 py-3 font-semibold">Formule</th>
                                <th class="text-left px-4 py-3 font-semibold">Montant</th>
                                <th class="text-left px-4 py-3 font-semibold">Fin d'essai</th>
                                <th class="text-left px-4 py-3 font-semibold">Début</th>
                                <th class="text-left px-4 py-3 font-semibold">Fin</th>
                                <th class="text-left px-4 py-3 font-semibold">Transaction</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                            <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-white/[0.02] transition-colors">
                                <td class="px-4 py-4">
                                    <div>
                                        <p class="font-semibold text-white">{{ sub.gym?.name || '—' }}</p>
                                        <p class="text-xs text-gray-500">{{ sub.gym?.email || '' }}</p>
                                    </div>
                                </td>
                                <td class="px-4 py-4">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                        :class="statusClass(sub.status)">
                                        <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(sub.status)"></span>
                                        {{ statusLabel(sub.status) }}
                                    </span>
                                </td>
                                <td class="px-4 py-4 text-gray-300 capitalize">{{ sub.planType || '—' }}</td>
                                <td class="px-4 py-4 text-gray-300 font-semibold">{{ formatCurrency(sub.amount) }}</td>
                                <td class="px-4 py-4 text-gray-400 text-xs">{{ formatDate(sub.trialEndsAt) || '—' }}</td>
                                <td class="px-4 py-4 text-gray-400 text-xs">{{ formatDate(sub.startsAt) || '—' }}</td>
                                <td class="px-4 py-4 text-gray-400 text-xs">{{ formatDate(sub.endsAt) || '—' }}</td>
                                <td class="px-4 py-4 text-gray-400 text-xs font-mono">{{ sub.fedapayTransactionId || '—' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="subscriptions.length === 0" class="text-center py-16 text-gray-500">
                    <span class="material-symbols-outlined text-4xl mb-2">workspace_premium</span>
                    <p>Aucun abonnement trouvé</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

const loading = ref(true)
const subscriptions = ref([])

const formatCurrency = (val) => {
    if (!val && val !== 0) return '—'
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val) + ' FCFA'
}

const formatDate = (d) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
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

const statusDotClass = (status) => {
    const map = {
        active: 'bg-green-400',
        trial: 'bg-amber-400',
        expired: 'bg-red-400',
        cancelled: 'bg-gray-400',
    }
    return map[status] || 'bg-gray-400'
}

const statusLabel = (status) => {
    const map = { active: 'Actif', trial: 'Essai', expired: 'Expiré', cancelled: 'Annulé' }
    return map[status] || status || '—'
}

onMounted(async () => {
    try {
        const { data } = await api.get('/super-admin/subscriptions')
        subscriptions.value = data
    } catch (e) {
        console.error('Failed to load subscriptions', e)
    } finally {
        loading.value = false
    }
})
</script>
