<template>
    <div>
        <div class="mb-8">
            <h2 class="text-2xl font-black font-headline tracking-tight text-white">Salles de sport</h2>
            <p class="text-gray-400 font-medium">{{ gyms.length }} salle{{ gyms.length > 1 ? 's' : '' }} enregistrée{{ gyms.length > 1 ? 's' : '' }}</p>
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
                                <th class="text-left px-4 py-3 font-semibold">Contact</th>
                                <th class="text-left px-4 py-3 font-semibold">Abonnement</th>
                                <th class="text-center px-4 py-3 font-semibold">Utilisateurs</th>
                                <th class="text-center px-4 py-3 font-semibold">Clients</th>
                                <th class="text-left px-4 py-3 font-semibold">Inscrit le</th>
                                <th class="text-center px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                            <tr v-for="gym in gyms" :key="gym.id"
                                class="hover:bg-white/[0.02] transition-colors">
                                <td class="px-4 py-4">
                                    <div class="flex items-center gap-3">
                                        <div v-if="gym.logo" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                            <img :src="gym.logo" class="w-full h-full object-cover" />
                                        </div>
                                        <div v-else
                                            class="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-300 font-bold flex-shrink-0">
                                            {{ gym.name?.charAt(0).toUpperCase() || 'G' }}
                                        </div>
                                        <div>
                                            <p class="font-semibold text-white">{{ gym.name }}</p>
                                            <p class="text-xs text-gray-500">/{{ gym.slug }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-4">
                                    <p class="text-gray-300">{{ gym.email || '—' }}</p>
                                    <p class="text-xs text-gray-500">{{ gym.phone || '' }}</p>
                                </td>
                                <td class="px-4 py-4">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                        :class="statusClass(gym.subscription?.status)">
                                        <span class="w-1.5 h-1.5 rounded-full"
                                            :class="statusDotClass(gym.subscription?.status)"></span>
                                        {{ statusLabel(gym.subscription?.status) }}
                                    </span>
                                    <p v-if="gym.subscription?.planType" class="text-xs text-gray-500 mt-1">
                                        {{ gym.subscription.planType }}
                                    </p>
                                </td>
                                <td class="px-4 py-4 text-center text-gray-300 font-semibold">{{ gym.usersCount }}</td>
                                <td class="px-4 py-4 text-center text-gray-300 font-semibold">{{ gym.clientsCount }}</td>
                                <td class="px-4 py-4 text-gray-400 text-xs">{{ formatDate(gym.createdAt) }}</td>
                                <td class="px-4 py-4 text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <router-link :to="`/super-admin/gyms/${gym.id}`"
                                            class="px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                            Détails
                                        </router-link>
                                        <select :value="gym.subscription?.status"
                                            @change="toggleStatus(gym.id, $event.target.value)"
                                            class="bg-[#0f0f13] text-xs text-gray-300 border border-white/10 rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none focus:border-indigo-500">
                                            <option value="trial">Essai</option>
                                            <option value="active">Actif</option>
                                            <option value="expired">Expiré</option>
                                            <option value="cancelled">Annulé</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="gyms.length === 0" class="text-center py-16 text-gray-500">
                    <span class="material-symbols-outlined text-4xl mb-2">fitness_center</span>
                    <p>Aucune salle enregistrée</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { ElMessage } from 'element-plus'

const loading = ref(true)
const gyms = ref([])

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
    const map = {
        active: 'Actif',
        trial: 'Essai',
        expired: 'Expiré',
        cancelled: 'Annulé',
    }
    return map[status] || status || '—'
}

const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const toggleStatus = async (gymId, newStatus) => {
    try {
        await api.post(`/super-admin/gyms/${gymId}/toggle-status`, { status: newStatus })
        ElMessage.success('Statut mis à jour')
        const idx = gyms.value.findIndex(g => g.id === gymId)
        if (idx !== -1) {
            gyms.value[idx].subscription.status = newStatus
        }
    } catch (e) {
        ElMessage.error(e.response?.data?.error || 'Erreur lors de la mise à jour')
    }
}

onMounted(async () => {
    try {
        const { data } = await api.get('/super-admin/gyms')
        gyms.value = data
    } catch (e) {
        console.error('Failed to load gyms', e)
    } finally {
        loading.value = false
    }
})
</script>
