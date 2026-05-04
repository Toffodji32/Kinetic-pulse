<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">

        <!-- Header -->
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Abonnements</h2>
                <p class="text-[#464554] font-medium">Gestion de tous les abonnements</p>
            </div>
            <el-button type="primary" size="large" @click="openCreateModal()"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2">
                    <Plus />
                </el-icon>
                Nouvel abonnement
            </el-button>
        </div>

        <!-- Stats rapides -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-indigo-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Total</p>
                <p class="text-3xl font-black text-[#131b2e]">{{ subStore.subscriptions.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Actifs</p>
                <p class="text-3xl font-black text-green-600">{{ subStore.activeSubscriptions.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-400">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Expirés</p>
                <p class="text-3xl font-black text-red-500">{{ subStore.subscriptions.length -
                    subStore.activeSubscriptions.length }}</p>
            </div>
        </div>

        <!-- Filtres + Recherche -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
            <el-input v-model="search" placeholder="Rechercher par client, type..." size="large" clearable
                style="max-width: 320px;">
                <template #prefix><el-icon>
                        <Search />
                    </el-icon></template>
            </el-input>

            <el-select v-model="filterStatus" placeholder="Tous les statuts" size="large" clearable
                style="width: 180px;">
                <el-option label="Actif" value="Actif" />
                <el-option label="Expiré" value="Expiré" />
            </el-select>

            <span class="text-[#464554] text-sm font-medium ml-auto">
                {{ filteredSubs.length }} abonnement(s)
            </span>
        </div>

        <!-- Loading -->
        <div v-if="subStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <!-- Tableau -->
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <el-table :data="paginatedSubs" style="width: 100%" empty-text="Aucun abonnement trouvé">

                <!-- Client -->
                <el-table-column label="Client" min-width="180">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 py-1">
                            <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                                :style="{ backgroundColor: getAvatarColor(row.client) }">
                                {{ row.client?.charAt(0) }}
                            </div>
                            <span class="font-bold text-[#131b2e]">{{ row.client }}</span>
                        </div>
                    </template>
                </el-table-column>

                <!-- Type -->
                <el-table-column label="Type" min-width="150">
                    <template #default="{ row }">
                        <span class="font-semibold text-indigo-600">{{ row.type }}</span>
                    </template>
                </el-table-column>

                <!-- Prix -->
                <el-table-column label="Prix" min-width="100">
                    <template #default="{ row }">
                        <span class="font-bold text-[#131b2e]">{{ row.price }} FCFA</span>
                    </template>
                </el-table-column>

                <!-- Dates -->
                <el-table-column label="Période" min-width="200">
                    <template #default="{ row }">
                        <div class="text-sm">
                            <span class="text-[#464554]">{{ row.startDate }}</span>
                            <span class="text-[#464554] mx-1">→</span>
                            <span class="font-semibold"
                                :class="row.status === 'Actif' ? 'text-green-600' : 'text-red-500'">
                                {{ row.endDate }}
                            </span>
                        </div>
                    </template>
                </el-table-column>

                <!-- Statut -->
                <el-table-column label="Statut" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'Actif' ? 'success' : 'danger'" size="small" round>
                            {{ row.status }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- Actions -->
                <el-table-column label="Actions" min-width="180" align="center">
                    <template #default="{ row }">
                        <div class="flex gap-2 justify-center">
                            <el-button size="small" @click="openDetail(row)"
                                style="background-color: #e0e7ff; color: #4f46e5; border: none; border-radius: 8px; font-weight: 600;">
                                <el-icon class="mr-1">
                                    <View />
                                </el-icon>
                                Voir
                            </el-button>
                            <el-button size="small" type="success" plain @click="handleRenew(row)"
                                style="border-radius: 8px;">
                                <el-icon>
                                    <Refresh />
                                </el-icon>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>

            </el-table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
                :total="filteredSubs.length" layout="total, sizes, prev, pager, next" background />
        </div>

        <!-- ═══════════════════════════════════════
         MODAL CRÉATION ABONNEMENT
    ═══════════════════════════════════════ -->
        <el-dialog v-model="showCreateModal" title="Nouvel abonnement" width="500px" :close-on-click-modal="false"
            @closed="resetCreateForm">
            <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-position="top" size="large">
                <!-- Sélection client -->
                <el-form-item label="Client" prop="client_id">
                    <el-select v-model="createForm.client_id" placeholder="Rechercher un client..." filterable
                        style="width: 100%" :loading="clientStore.loading">
                        <el-option v-for="c in clientStore.clients" :key="c.id" :label="`${c.firstName} ${c.lastName}`"
                            :value="c.id" />
                    </el-select>
                </el-form-item>

                <!-- Sélection type d'abonnement -->
                <el-form-item label="Type d'abonnement" prop="subscription_type_id">
                    <el-select v-model="createForm.subscription_type_id" placeholder="Choisir un type..."
                        style="width: 100%" :loading="typeStore.loading" @change="onTypeChange">
                        <el-option v-for="t in typeStore.types" :key="t.id" :value="t.id"
                            :label="`${t.name} — ${t.price} FCFA / ${t.durationDays} jours`" />
                    </el-select>
                </el-form-item>

                <!-- Aperçu du type sélectionné -->
                <div v-if="selectedType" class="bg-[#f2f3ff] rounded-xl p-4 mb-2">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-bold text-indigo-600">{{ selectedType.name }}</p>
                            <p class="text-sm text-[#464554]">Durée : {{ selectedType.durationDays }} jours</p>
                        </div>
                        <p class="text-2xl font-black text-[#131b2e]">{{ selectedType.price }} FCFA</p>
                    </div>
                    <div class="mt-3 text-xs text-[#464554] flex gap-4">
                        <span>Début : <strong>{{ today }}</strong></span>
                        <span>Fin : <strong>{{ computedEndDate }}</strong></span>
                    </div>
                </div>

            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="subStore.loading" @click="handleCreate"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Créer l'abonnement
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- ═══════════════════════════════════════
         DRAWER DÉTAIL ABONNEMENT
    ═══════════════════════════════════════ -->
        <el-drawer v-model="showDetail" direction="rtl" size="440px" :with-header="false">
            <div v-if="selectedSub" class="p-6">

                <!-- En-tête -->
                <div class="flex flex-col items-center mb-8 pt-4">
                    <div class="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl text-white mb-4"
                        :style="{ backgroundColor: getAvatarColor(selectedSub.client) }">
                        {{ selectedSub.client?.charAt(0) }}
                    </div>
                    <h2 class="text-2xl font-black text-[#131b2e]">{{ selectedSub.client }}</h2>
                    <el-tag :type="selectedSub.status === 'Actif' ? 'success' : 'danger'" size="large" round
                        class="mt-2">
                        {{ selectedSub.status }}
                    </el-tag>
                </div>

                <!-- Détails -->
                <div class="space-y-3 mb-8">
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Type</span>
                        <span class="font-bold text-indigo-600">{{ selectedSub.type }}</span>
                    </div>
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Prix</span>
                        <span class="font-bold text-[#131b2e]">{{ selectedSub.price }} FCFA</span>
                    </div>
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Début</span>
                        <span class="font-bold text-[#131b2e]">{{ selectedSub.startDate }}</span>
                    </div>
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Fin</span>
                        <span class="font-bold"
                            :class="selectedSub.status === 'Actif' ? 'text-green-600' : 'text-red-500'">
                            {{ selectedSub.endDate }}
                        </span>
                    </div>
                </div>

                <!-- Historique des abonnements du client -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="text-sm font-bold uppercase tracking-widest text-[#464554]">Historique client</p>
                            <p class="text-xs text-slate-500">Tous les abonnements de {{ selectedSub.client }}</p>
                        </div>
                        <span class="text-xs font-semibold text-[#4f46e5]">{{ clientHistory.length }} ligne(s)</span>
                    </div>
                    <div class="space-y-3">
                        <div v-if="clientHistory.length === 0"
                            class="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                            Aucune donnée historique disponible.
                        </div>
                        <div v-for="history in paginatedClientHistory" :key="history.id"
                            class="bg-white rounded-xl p-4 border shadow-sm">
                            <div class="flex justify-between items-center gap-4">
                                <div>
                                    <p class="font-semibold text-[#131b2e]">{{ history.type }}</p>
                                    <p class="text-sm text-[#6b7280]">{{ history.startDate }} → {{ history.endDate }}
                                    </p>
                                </div>
                                <el-tag :type="history.status === 'Actif' ? 'success' : 'danger'" size="small" round>
                                    {{ history.status }}
                                </el-tag>
                            </div>
                        </div>
                    </div>

                    <div v-if="clientHistory.length > historyPageSize" class="mt-4">
                        <el-pagination v-model:current-page="historyPage" :page-size="historyPageSize"
                            :total="clientHistory.length" layout="prev, pager, next" background />
                    </div>
                </div>

                <!-- Bouton renouveler -->
                <el-button type="success" size="large" class="w-full mb-3"
                    style="border-radius: 12px; font-weight: 700;" @click="handleRenew(selectedSub)">
                    <el-icon class="mr-2">
                        <Refresh />
                    </el-icon>
                    Renouveler l'abonnement
                </el-button>

                <!-- Bouton nouvel abonnement pour ce client -->
                <el-button type="primary" size="large" class="w-full"
                    style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
                    @click="openCreateModalForClient(selectedSub)">
                    <el-icon class="mr-2">
                        <Plus />
                    </el-icon>
                    Nouveau type d'abonnement
                </el-button>

            </div>
        </el-drawer>

    </div>
</template>

<script setup>
import { useClientStore } from '@/stores/client'
import { useSubscriptionStore } from '@/stores/subscription'
import { useSubscriptionTypeStore } from '@/stores/subscriptionType'
import {
    Loading,
    Plus,
    Refresh,
    Search, View
} from '@element-plus/icons-vue'
import Swal from 'sweetalert2'
import { computed, onMounted, ref } from 'vue'

const subStore = useSubscriptionStore()
const typeStore = useSubscriptionTypeStore()
const clientStore = useClientStore()

// ── État ─────────────────────────────────────────
const search = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const historyPage = ref(1)
const historyPageSize = ref(4)
const showCreateModal = ref(false)
const showDetail = ref(false)
const selectedSub = ref(null)
const selectedType = ref(null)
const createFormRef = ref(null)

const createForm = ref({
    client_id: null,
    subscription_type_id: null,
})

const createRules = {
    client_id: [{ required: true, message: 'Sélectionnez un client', trigger: 'change' }],
    subscription_type_id: [{ required: true, message: "Sélectionnez un type d'abonnement", trigger: 'change' }],
}

// ── Chargement initial ───────────────────────────
onMounted(async () => {
    await subStore.fetchAll()
    await typeStore.fetchAll()
    await clientStore.fetchAll()
})

// ── Dates calculées pour l'aperçu ───────────────
const today = new Date().toLocaleDateString('fr-FR')

const computedEndDate = computed(() => {
    if (!selectedType.value) return '—'
    const end = new Date()
    end.setDate(end.getDate() + selectedType.value.durationDays)
    return end.toLocaleDateString('fr-FR')
})

// ── Les abonnements les plus récents par client ──
const currentSubscriptions = computed(() => {
    const grouped = {}
    subStore.subscriptions.forEach(sub => {
        const key = sub.client_id ?? sub.client
        const existing = grouped[key]
        if (!existing) {
            grouped[key] = sub
            return
        }

        const existingDate = new Date(existing.startDate)
        const currentDate = new Date(sub.startDate)
        if (currentDate > existingDate) {
            grouped[key] = sub
        }
    })
    return Object.values(grouped)
})

const clientHistory = computed(() => subStore.clientSubscriptions || [])

// ── Quand on change le type → aperçu ────────────
function onTypeChange(typeId) {
    selectedType.value = typeStore.types.find(t => t.id === typeId) || null
}

// ── Filtres + pagination ─────────────────────────
const filteredSubs = computed(() => {
    let list = currentSubscriptions.value
    const q = search.value.toLowerCase()

    if (q) {
        list = list.filter(s =>
            `${s.client} ${s.type}`.toLowerCase().includes(q)
        )
    }
    if (filterStatus.value) {
        list = list.filter(s => s.status === filterStatus.value)
    }
    return list
})

const paginatedSubs = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredSubs.value.slice(start, start + pageSize.value)
})

const paginatedClientHistory = computed(() => {
    const start = (historyPage.value - 1) * historyPageSize.value
    return clientHistory.value.slice(start, start + historyPageSize.value)
})

// ── Ouvrir modal création (vide ou pré-rempli) ───
function openCreateModal(clientId = null) {
    createForm.value = {
        client_id: clientId,
        subscription_type_id: null,
    }
    selectedType.value = null
    showCreateModal.value = true
}

// ── Ouvrir modal depuis le détail (client pré-rempli) ──
function openCreateModalForClient(sub) {
    // on cherche l'id du client dans la liste
    const client = clientStore.clients.find(
        c => `${c.firstName} ${c.lastName}` === sub.client
    )
    showDetail.value = false
    openCreateModal(client?.id || null)
}

// ── Créer un abonnement ──────────────────────────
async function handleCreate() {
    await createFormRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            await subStore.create({
                client_id: createForm.value.client_id,
                subscription_type_id: createForm.value.subscription_type_id,
            })

            showCreateModal.value = false

            Swal.fire({
                icon: 'success',
                title: 'Abonnement créé !',
                text: `L'abonnement a été créé avec succès.`,
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'Super !',
            })

            resetCreateForm()
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: subStore.error || "Impossible de créer l'abonnement.",
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Ouvrir le détail ─────────────────────────────
async function openDetail(sub) {
    selectedSub.value = sub
    historyPage.value = 1
    const clientId = sub.client_id ?? clientStore.clients.find(c => `${c.firstName} ${c.lastName}` === sub.client)?.id
    if (clientId) {
        await subStore.fetchByClient(clientId)
    }
    showDetail.value = true
}

// ── Renouveler un abonnement ─────────────────────
async function handleRenew(sub) {
    const result = await Swal.fire({
        icon: 'question',
        title: 'Renouveler cet abonnement ?',
        html: `<p>Un nouvel abonnement <strong>${sub.type}</strong> sera créé pour <strong>${sub.client}</strong>.</p>`,
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, renouveler',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
        await subStore.renew(sub.id)
        showDetail.value = false

        Swal.fire({
            icon: 'success',
            title: 'Renouvelé !',
            text: `L'abonnement de ${sub.client} a été renouvelé avec succès.`,
            confirmButtonColor: '#4f46e5',
            timer: 2500,
            showConfirmButton: false,
        })
    } catch {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: subStore.error || "Impossible de renouveler l'abonnement.",
            confirmButtonColor: '#4f46e5',
        })
    }
}

// ── Reset ────────────────────────────────────────
function resetCreateForm() {
    createForm.value = { client_id: null, subscription_type_id: null }
    selectedType.value = null
    createFormRef.value?.resetFields()
}

// ── Helpers ──────────────────────────────────────
function getAvatarColor(name) {
    const colors = [
        '#4f46e5', '#7c3aed', '#db2777', '#059669',
        '#d97706', '#dc2626', '#0284c7', '#65a30d',
    ]
    if (!name) return colors[0]
    return colors[name.charCodeAt(0) % colors.length]
}
</script>