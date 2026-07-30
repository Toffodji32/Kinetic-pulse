<template>
    <div class="p-6">
        <div class="mb-8">
            <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Gestion des retraits</h2>
            <p class="text-[#464554] font-medium">Approuver ou rejeter les demandes de retrait des salles</p>
        </div>

        <div v-if="stats" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div class="bg-amber-50 rounded-xl p-4 shadow-sm border-l-4 border-amber-500">
                <p class="text-2xl font-black text-amber-600">{{ stats.pendingWithdrawals.count }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-amber-700">En attente</p>
            </div>
            <div class="bg-amber-50 rounded-xl p-4 shadow-sm border-l-4 border-amber-500">
                <p class="text-2xl font-black text-amber-600">{{ formatAmount(stats.pendingWithdrawals.volume) }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-amber-700">Volume en attente</p>
            </div>
            <div class="bg-emerald-50 rounded-xl p-4 shadow-sm border-l-4 border-emerald-500">
                <p class="text-2xl font-black text-emerald-600">{{ stats.completedThisMonth.count }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-emerald-700">Validés ce mois</p>
            </div>
            <div class="bg-emerald-50 rounded-xl p-4 shadow-sm border-l-4 border-emerald-500">
                <p class="text-2xl font-black text-emerald-600">{{ formatAmount(stats.completedThisMonth.volume) }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-emerald-700">Volume validé ce mois</p>
            </div>
            <div class="bg-blue-50 rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                <p class="text-2xl font-black text-blue-600">{{ formatAmount(stats.totalCirculation) }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-blue-700">En circulation</p>
            </div>
            <div class="bg-purple-50 rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                <p class="text-2xl font-black text-purple-600">{{ formatAmount(stats.totalCommissions) }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-purple-700">Commissions perçues</p>
            </div>
        </div>

        <div class="flex gap-2 mb-4">
            <el-button v-for="s in statuses" :key="s.value" @click="loadWithdrawals(s.value)"
                :type="currentStatus === s.value ? 'primary' : 'default'" size="small" round>
                {{ s.label }}
            </el-button>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <el-table :data="items" style="width: 100%" v-loading="loading" empty-text="Aucun retrait trouvé.">
                <el-table-column label="Date" min-width="160">
                    <template #default="{ row }">{{ formatDate(row.requestedAt) }}</template>
                </el-table-column>
                <el-table-column label="Salle" min-width="150">
                    <template #default="{ row }"><strong>{{ row.gym?.name }}</strong></template>
                </el-table-column>
                <el-table-column label="Montant" min-width="120">
                    <template #default="{ row }">{{ formatAmount(row.amount) }}</template>
                </el-table-column>
                <el-table-column label="Mobile Money" min-width="180">
                    <template #default="{ row }">{{ row.mobileMoneyNumber }} ({{ (row.mobileMoneyOperator || '').toUpperCase() }})</template>
                </el-table-column>
                <el-table-column label="Statut" min-width="120">
                    <template #default="{ row }">
                        <el-tag :type="statusTag(row.status)" size="small" round>{{ statusLabel(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Actions" min-width="180" align="right" v-if="currentStatus === 'pending'">
                    <template #default="{ row }">
                        <el-button size="small" type="success" plain @click="approve(row)">Approuver</el-button>
                        <el-button size="small" type="danger" plain @click="openReject(row)">Rejeter</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="meta.pages > 1" class="flex justify-center py-4">
                <el-pagination v-model:current-page="currentPage" :page-size="20" :total="meta.total"
                    layout="prev, pager, next" background @current-change="(p) => loadWithdrawals(currentStatus, p)" />
            </div>
        </div>

        <el-dialog v-model="showRejectDialog" title="Rejeter le retrait" width="480px" :append-to-body="true">
            <p v-if="rejectTarget" class="mb-4">
                <strong>Salle :</strong> {{ rejectTarget.gym?.name }}<br>
                <strong>Montant :</strong> {{ formatAmount(rejectTarget.amount) }}
            </p>
            <el-input v-model="rejectReason" type="textarea" :rows="3" placeholder="Raison du rejet (obligatoire)" />
            <template #footer>
                <el-button @click="showRejectDialog = false">Annuler</el-button>
                <el-button type="danger" :disabled="!rejectReason.trim() || rejecting" @click="confirmReject" :loading="rejecting">
                    Confirmer le rejet
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { ElNotification } from 'element-plus'

const store = useWalletStore()
const items = ref([])
const meta = ref({ page: 1, total: 0, pages: 1 })
const currentPage = ref(1)
const currentStatus = ref('pending')
const loading = ref(false)
const stats = ref(null)
const showRejectDialog = ref(false)
const rejectTarget = ref(null)
const rejectReason = ref('')
const rejecting = ref(false)

const statuses = [
    { value: 'pending', label: 'En attente' },
    { value: 'processing', label: 'En cours' },
    { value: 'completed', label: 'Effectués' },
    { value: 'rejected', label: 'Rejetés' },
    { value: 'all', label: 'Tous' },
]

function formatAmount(v) { return (v || 0).toLocaleString('fr-FR') + ' FCFA' }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' }
function statusLabel(s) { return { pending: 'En attente', approved: 'Approuvé', processing: 'En cours', completed: 'Effectué', rejected: 'Rejeté' }[s] || s }
function statusTag(s) { return { pending: 'warning', approved: 'info', processing: 'warning', completed: 'success', rejected: 'danger' }[s] || '' }

function notify(type, message) {
    ElNotification({ type, title: type === 'success' ? 'Succès' : 'Erreur', message, duration: 4000 })
}

async function loadWithdrawals(status, page = 1) {
    currentStatus.value = status
    currentPage.value = page
    loading.value = true
    try {
        const data = await store.fetchPendingWithdrawals(page, status === 'all' ? undefined : status)
        items.value = data.data
        meta.value = { page: data.page, total: data.total, pages: data.pages }
    } catch {
        notify('error', 'Erreur de chargement')
    } finally {
        loading.value = false
    }
}

async function approve(w) {
    try {
        await store.approveWithdrawal(w.id)
        notify('success', `Retrait #${w.id} approuvé et envoyé à FedaPay.`)
        loadWithdrawals(currentStatus.value, currentPage.value)
        loadStats()
    } catch (e) {
        notify('error', e.response?.data?.error || "Erreur lors de l'approbation")
    }
}

function openReject(w) {
    rejectTarget.value = w
    rejectReason.value = ''
    showRejectDialog.value = true
}

async function confirmReject() {
    if (!rejectTarget.value) return
    rejecting.value = true
    try {
        await store.rejectWithdrawal(rejectTarget.value.id, rejectReason.value)
        notify('success', `Retrait #${rejectTarget.value.id} rejeté.`)
        showRejectDialog.value = false
        rejectTarget.value = null
        rejectReason.value = ''
        loadWithdrawals(currentStatus.value, currentPage.value)
        loadStats()
    } catch (e) {
        notify('error', e.response?.data?.error || 'Erreur lors du rejet')
    } finally {
        rejecting.value = false
    }
}

async function loadStats() {
    try {
        stats.value = await store.fetchWalletStats()
    } catch { }
}

onMounted(() => {
    loadWithdrawals('pending')
    loadStats()
})
</script>
