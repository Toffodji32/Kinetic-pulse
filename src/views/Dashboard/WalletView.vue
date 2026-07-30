<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Porte-monnaie</h2>
                <p class="text-[#464554] font-medium">Solde et transactions de votre salle</p>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl"><Loading /></el-icon>
        </div>

        <template v-else-if="wallet">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-emerald-50 rounded-xl p-6 shadow-sm border-l-4 border-emerald-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">Disponible</p>
                    <p class="text-3xl font-black text-emerald-600">{{ formatAmount(wallet.balanceAvailable) }}</p>
                </div>
                <div class="bg-amber-50 rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">En attente</p>
                    <p class="text-3xl font-black text-amber-600">{{ formatAmount(wallet.balancePending) }}</p>
                </div>
                <div class="bg-blue-50 rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 mb-1">En cours de retrait</p>
                    <p class="text-3xl font-black text-blue-600">{{ formatAmount(wallet.balancePendingWithdrawal) }}</p>
                </div>
                <div class="bg-purple-50 rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                    <p class="text-xs font-bold uppercase tracking-widest text-purple-700 mb-1">Gagné au total</p>
                    <p class="text-3xl font-black text-purple-600">{{ formatAmount(wallet.totalEarned) }}</p>
                </div>
            </div>

            <div class="flex items-center gap-4 mb-8">
                <el-button type="primary" size="large" :disabled="!canWithdraw" @click="showDrawer = true"
                    style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                    Demander un retrait
                </el-button>
                <span v-if="!canWithdraw" class="text-sm text-[#464554]">
                    Solde insuffisant (minimum {{ formatAmount(1000) }})
                </span>
            </div>

            <el-drawer v-model="showDrawer" direction="rtl" size="460px" :with-header="false" :append-to-body="true">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-[#131b2e] mb-6">Demande de retrait</h3>

                    <div v-if="withdrawSuccess" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                        <p class="text-emerald-700 font-medium">Demande envoyée !</p>
                        <p class="text-emerald-600 text-sm mt-1">Vous recevrez les fonds sous 48h.</p>
                        <el-button class="mt-3" @click="closeDrawer">Fermer</el-button>
                    </div>

                    <el-form v-else @submit.prevent="submitWithdraw" label-position="top" size="large">
                        <el-form-item label="Montant (FCFA)">
                            <el-input-number v-model="withdrawForm.amount" :min="1000" :max="wallet.balanceAvailable" :step="500" style="width: 100%" />
                            <small class="text-[#464554]">Min {{ formatAmount(1000) }} — Max {{ formatAmount(wallet.balanceAvailable) }}</small>
                        </el-form-item>

                        <el-form-item label="Numéro Mobile Money">
                            <el-input v-model="withdrawForm.number" placeholder="+229 97 XX XX XX" />
                        </el-form-item>

                        <el-form-item label="Opérateur">
                            <el-select v-model="withdrawForm.operator" style="width: 100%">
                                <el-option label="MTN" value="mtn" />
                                <el-option label="Moov" value="moov" />
                            </el-select>
                        </el-form-item>

                        <div v-if="withdrawForm.amount >= 1000" class="bg-[#f2f3ff] rounded-xl p-4 mb-4">
                            <p class="font-bold text-[#131b2e] mb-1">Récapitulatif</p>
                            <p class="text-sm text-[#464554]">Montant : {{ formatAmount(withdrawForm.amount) }}</p>
                            <p class="text-sm text-[#464554]">Numéro : {{ withdrawForm.number || '—' }}</p>
                            <p class="text-sm text-[#464554]">Opérateur : {{ operatorLabel(withdrawForm.operator) }}</p>
                        </div>

                        <div class="flex gap-3 justify-end">
                            <el-button @click="closeDrawer" size="large">Annuler</el-button>
                            <el-button type="primary" size="large" native-type="submit" :loading="submitting"
                                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px;">
                                Confirmer le retrait
                            </el-button>
                        </div>

                        <div v-if="withdrawError" class="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                            <p class="text-red-700">{{ withdrawError }}</p>
                        </div>
                    </el-form>
                </div>
            </el-drawer>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div class="px-6 py-4 border-b border-slate-100">
                    <h3 class="font-bold text-[#131b2e]">Historique des transactions</h3>
                </div>
                <el-table :data="transactions" style="width: 100%" empty-text="Aucune transaction pour le moment.">
                    <el-table-column label="Date" min-width="160">
                        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
                    </el-table-column>
                    <el-table-column label="Type" min-width="120">
                        <template #default="{ row }">
                            <el-tag :type="typeTag(row.type)" size="small" round>{{ typeLabel(row.type) }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="Description" min-width="200">
                        <template #default="{ row }">{{ row.description }}</template>
                    </el-table-column>
                    <el-table-column label="Montant" min-width="120" align="right">
                        <template #default="{ row }">
                            <span :class="row.type === 'credit' || row.type === 'refund' ? 'text-green-600' : 'text-red-600'">
                                {{ row.type === 'credit' || row.type === 'refund' ? '+' : '-' }}{{ formatAmount(row.amount) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Solde après" min-width="120" align="right">
                        <template #default="{ row }">{{ formatAmount(row.balanceAfter) }}</template>
                    </el-table-column>
                </el-table>
                <div v-if="transactionsMeta.pages > 1" class="flex justify-center py-4">
                    <el-pagination v-model:current-page="txPage" :page-size="20" :total="transactionsMeta.total"
                        layout="prev, pager, next" background @current-change="loadPage" />
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100">
                    <h3 class="font-bold text-[#131b2e]">Mes retraits</h3>
                </div>
                <el-table :data="withdrawals" style="width: 100%" empty-text="Aucun retrait pour le moment.">
                    <el-table-column label="Date" min-width="160">
                        <template #default="{ row }">{{ formatDate(row.requestedAt) }}</template>
                    </el-table-column>
                    <el-table-column label="Montant" min-width="120">
                        <template #default="{ row }">{{ formatAmount(row.amount) }}</template>
                    </el-table-column>
                    <el-table-column label="Mobile Money" min-width="180">
                        <template #default="{ row }">{{ (row.mobileMoneyOperator || '').toUpperCase() }} {{ row.mobileMoneyNumber }}</template>
                    </el-table-column>
                    <el-table-column label="Statut" min-width="120">
                        <template #default="{ row }">
                            <el-tag :type="statusTag(row.status)" size="small" round>{{ statusLabel(row.status) }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { Loading } from '@element-plus/icons-vue'

const store = useWalletStore()
const wallet = computed(() => store.wallet)
const transactions = computed(() => store.transactions)
const transactionsMeta = computed(() => store.transactionsMeta)
const withdrawals = computed(() => store.withdrawals)
const loading = computed(() => store.loading)

const showDrawer = ref(false)
const submitting = ref(false)
const withdrawSuccess = ref(false)
const withdrawError = ref('')
const withdrawForm = ref({ amount: 1000, number: '', operator: '' })
const txPage = ref(1)

const canWithdraw = computed(() => wallet.value && wallet.value.balanceAvailable >= 1000)

function formatAmount(v) { return (v || 0).toLocaleString('fr-FR') + ' FCFA' }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' }
function typeLabel(t) { return { credit: 'Crédit', debit: 'Débit', commission: 'Commission', withdrawal: 'Retrait', refund: 'Remboursement' }[t] || t }
function typeTag(t) { return { credit: 'success', debit: 'danger', commission: 'warning', withdrawal: 'danger', refund: 'success' }[t] || '' }
function statusLabel(s) { return { pending: 'En attente', approved: 'Approuvé', processing: 'En cours', completed: 'Effectué', rejected: 'Rejeté' }[s] || s }
function statusTag(s) { return { pending: 'warning', approved: 'info', processing: 'warning', completed: 'success', rejected: 'danger' }[s] || '' }
function operatorLabel(o) { return { mtn: 'MTN', moov: 'Moov' }[o] || o }

function closeDrawer() {
    showDrawer.value = false
    withdrawSuccess.value = false
    withdrawError.value = ''
    withdrawForm.value = { amount: 1000, number: '', operator: '' }
}

async function submitWithdraw() {
    submitting.value = true
    withdrawError.value = ''
    try {
        await store.requestWithdrawal(withdrawForm.value.amount, withdrawForm.value.number, withdrawForm.value.operator)
        withdrawSuccess.value = true
    } catch (e) {
        withdrawError.value = e.response?.data?.error || "Erreur lors de la demande"
    } finally {
        submitting.value = false
    }
}

async function loadPage(page) {
    txPage.value = page
    await store.fetchTransactions(page)
}

onMounted(async () => {
    await Promise.all([
        store.fetchWallet(),
        store.fetchTransactions(),
        store.fetchWithdrawals(),
    ])
})
</script>
