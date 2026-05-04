<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">

        <!-- Header -->
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Paiements</h2>
                <p class="text-[#464554] font-medium">Historique et enregistrement des paiements</p>
            </div>
            <el-button type="primary" size="large" @click="showCreateModal = true"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2">
                    <Plus />
                </el-icon>
                Nouveau paiement
            </el-button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-indigo-600 rounded-xl p-6 text-white shadow-xl shadow-indigo-600/10">
                <p class="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Total encaissé</p>
                <p class="text-3xl font-black">{{ formatCurrency(paymentStore.totalAmount) }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Abonnements</p>
                <p class="text-3xl font-black text-[#131b2e]">{{ paymentStore.subscriptionPayments.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Commandes</p>
                <p class="text-3xl font-black text-[#131b2e]">{{ paymentStore.orderPayments.length }}</p>
            </div>
        </div>

        <!-- Filtres -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
            <el-input v-model="search" placeholder="Rechercher par client, référence..." size="large" clearable
                style="max-width: 320px;">
                <template #prefix><el-icon>
                        <Search />
                    </el-icon></template>
            </el-input>

            <el-select v-model="filterType" placeholder="Tous les types" size="large" clearable style="width: 180px;">
                <el-option label="Abonnement" value="subscription" />
                <el-option label="Commande" value="order" />
            </el-select>

            <el-select v-model="filterMethod" placeholder="Tous les modes" size="large" clearable style="width: 180px;">
                <el-option label="Espèces" value="especes" />
                <el-option label="Carte bancaire" value="carte" />
                <el-option label="Mobile Money" value="mobile_money" />
            </el-select>

            <span class="text-[#464554] text-sm font-medium ml-auto">
                {{ filteredPayments.length }} paiement(s)
            </span>
        </div>

        <!-- Loading -->
        <div v-if="paymentStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <!-- Tableau -->
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <el-table :data="paginatedPayments" style="width: 100%" empty-text="Aucun paiement trouvé">
                <!-- Référence -->
                <el-table-column label="Référence" min-width="150">
                    <template #default="{ row }">
                        <span class="font-black text-indigo-600 text-sm">{{ row.reference }}</span>
                    </template>
                </el-table-column>

                <!-- Client -->
                <el-table-column label="Client" min-width="180">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2 py-1">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                :style="{ backgroundColor: getAvatarColor(row.client) }">
                                {{ row.client?.charAt(0) }}
                            </div>
                            <span class="font-semibold text-[#131b2e]">{{ row.client }}</span>
                        </div>
                    </template>
                </el-table-column>

                <!-- Montant -->
                <el-table-column label="Montant" min-width="120">
                    <template #default="{ row }">
                        <span class="font-black text-[#131b2e]">{{ formatCurrency(row.amount) }}</span>
                    </template>
                </el-table-column>

                <!-- Mode -->
                <el-table-column label="Mode" min-width="140">
                    <template #default="{ row }">
                        <el-tag :type="getMethodTagType(row.method)" size="small" round>
                            {{ getMethodLabel(row.method) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- Type -->
                <el-table-column label="Type" min-width="120" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.type === 'subscription' ? 'success' : 'warning'" size="small" round>
                            {{ row.type === 'subscription' ? 'Abonnement' : 'Commande' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- Date -->
                <el-table-column label="Date" min-width="160">
                    <template #default="{ row }">
                        <span class="text-[#464554] text-sm">{{ formatDateTime(row.date) }}</span>
                    </template>
                </el-table-column>

                <!-- Actions -->
                <el-table-column label="" min-width="80" align="center">
                    <template #default="{ row }">
                        <el-button size="small" @click="openDetail(row)"
                            style="background-color: #e0e7ff; color: #4f46e5; border: none; border-radius: 8px;">
                            <el-icon>
                                <View />
                            </el-icon>
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
                :total="filteredPayments.length" layout="total, sizes, prev, pager, next" background />
        </div>

        <!-- ═══════════════════════════════════════
         MODAL NOUVEAU PAIEMENT
    ═══════════════════════════════════════ -->
        <el-dialog v-model="showCreateModal" title="Enregistrer un paiement" width="540px" :close-on-click-modal="false"
            @closed="resetForm">
            <!-- Onglets abonnement / commande -->
            <el-tabs v-model="paymentTab" class="mb-2">
                <el-tab-pane label="Paiement abonnement" name="subscription" />
                <el-tab-pane label="Paiement commande" name="order" />
            </el-tabs>

            <el-form ref="formRef" :model="form" :rules="currentRules" label-position="top" size="large">
                <!-- Client commun aux deux -->
                <el-form-item label="Client" prop="client_id">
                    <el-select v-model="form.client_id" placeholder="Rechercher un client..." filterable
                        style="width: 100%" @change="onClientChange">
                        <el-option v-for="c in clientStore.clients" :key="c.id" :label="`${c.firstName} ${c.lastName}`"
                            :value="c.id" />
                    </el-select>
                </el-form-item>

                <!-- ── CAS 1 : Abonnement ── -->
                <template v-if="paymentTab === 'subscription'">
                    <el-form-item label="Abonnement" prop="subscription_id">
                        <el-select v-model="form.subscription_id" placeholder="Choisir un abonnement..."
                            style="width: 100%" :disabled="!form.client_id">
                            <el-option v-for="s in clientSubscriptions" :key="s.id" :value="s.id"
                                :label="`${s.type} — ${s.price} FCFA (${s.status})`" />
                            <template #empty>
                                <p class="text-center text-sm text-[#464554] py-4">
                                    {{ form.client_id ? 'Aucun abonnement pour ce client' : 'Sélectionnez d\'abord un client' }}
                                </p>
                            </template>
                        </el-select>
                    </el-form-item>

                    <!-- Aperçu montant abonnement -->
                    <div v-if="selectedSubscription" class="bg-[#f2f3ff] rounded-xl p-4 mb-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-bold text-indigo-600">{{ selectedSubscription.type }}</p>
                                <p class="text-sm text-[#464554]">{{ selectedSubscription.status }}</p>
                            </div>
                            <p class="text-2xl font-black text-[#131b2e]">{{ selectedSubscription.price }} FCFA</p>
                        </div>
                    </div>
                </template>

                <!-- ── CAS 2 : Commande ── -->
                <template v-if="paymentTab === 'order'">
                    <el-form-item label="Commande" prop="order_id">
                        <el-select v-model="form.order_id" placeholder="Choisir une commande..." style="width: 100%"
                            :disabled="!form.client_id">
                            <el-option v-for="o in clientOrders" :key="o.id" :value="o.id"
                                :label="`Commande #${o.id} — ${formatCurrency(o.total)} (${o.status})`" />
                            <template #empty>
                                <p class="text-center text-sm text-[#464554] py-4">
                                    {{ form.client_id ? 'Aucune commande en attente' : 'Sélectionnez d\'abord un client' }}
                                </p>
                            </template>
                        </el-select>
                    </el-form-item>

                    <!-- Aperçu montant commande -->
                    <div v-if="selectedOrder" class="bg-[#f2f3ff] rounded-xl p-4 mb-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-bold text-indigo-600">Commande #{{ selectedOrder.id }}</p>
                                <p class="text-sm text-[#464554]">{{ selectedOrder.items?.length ?? 0 }} article(s)</p>
                            </div>
                            <p class="text-2xl font-black text-[#131b2e]">{{ formatCurrency(selectedOrder.total) }}</p>
                        </div>
                    </div>
                </template>

                <!-- Mode de paiement commun -->
                <el-form-item label="Mode de paiement" prop="payment_method">
                    <el-radio-group v-model="form.payment_method" size="large" class="w-full">
                        <el-radio-button value="especes" style="flex: 1; text-align: center;">
                            💵 Espèces
                        </el-radio-button>
                        <el-radio-button value="carte" style="flex: 1; text-align: center;">
                            💳 Carte
                        </el-radio-button>
                        <el-radio-button value="mobile_money" style="flex: 1; text-align: center;">
                            📱 Mobile Money
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>

            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="paymentStore.loading" @click="handleCreate"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Enregistrer le paiement
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- ═══════════════════════════════════════
         DRAWER DÉTAIL PAIEMENT
    ═══════════════════════════════════════ -->
        <el-drawer v-model="showDetail" direction="rtl" size="420px" :with-header="false">
            <div v-if="selectedPayment" class="p-6">

                <!-- En-tête -->
                <div class="flex flex-col items-center mb-8 pt-4">
                    <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <el-icon class="text-indigo-600 text-3xl">
                            <Wallet />
                        </el-icon>
                    </div>
                    <h2 class="text-xl font-black text-indigo-600">{{ selectedPayment.reference }}</h2>
                    <p class="text-[#464554] text-sm mt-1">{{ formatDateTime(selectedPayment.date) }}</p>
                </div>

                <!-- Détails -->
                <div class="space-y-3">
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Client</span>
                        <span class="font-bold text-[#131b2e]">{{ selectedPayment.client }}</span>
                    </div>
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Montant</span>
                        <span class="text-xl font-black text-indigo-600">{{ formatCurrency(selectedPayment.amount)
                            }}</span>
                    </div>
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between items-center">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Mode</span>
                        <el-tag :type="getMethodTagType(selectedPayment.method)" round>
                            {{ getMethodLabel(selectedPayment.method) }}
                        </el-tag>
                    </div>
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between items-center">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Type</span>
                        <el-tag :type="selectedPayment.type === 'subscription' ? 'success' : 'warning'" round>
                            {{ selectedPayment.type === 'subscription' ? 'Abonnement' : 'Commande' }}
                        </el-tag>
                    </div>
                </div>

            </div>
        </el-drawer>

    </div>
</template>

<script setup>
import { useClientStore } from '@/stores/client'
import { useOrderStore } from '@/stores/order'
import { usePaymentStore } from '@/stores/payment'
import { useSubscriptionStore } from '@/stores/subscription'
import {
    Loading,
    Plus, Search, View,
    Wallet
} from '@element-plus/icons-vue'
import Swal from 'sweetalert2'
import { computed, onMounted, ref, watch } from 'vue'

const paymentStore = usePaymentStore()
const subStore = useSubscriptionStore()
const orderStore = useOrderStore()
const clientStore = useClientStore()

// ── État ─────────────────────────────────────────
const search = ref('')
const filterType = ref('')
const filterMethod = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showCreateModal = ref(false)
const showDetail = ref(false)
const selectedPayment = ref(null)
const paymentTab = ref('subscription')
const formRef = ref(null)

const form = ref({
    client_id: null,
    subscription_id: null,
    order_id: null,
    payment_method: 'especes',
})

// ── Règles dynamiques selon l'onglet ─────────────
const currentRules = computed(() => {
    const base = {
        client_id: [{ required: true, message: 'Client obligatoire', trigger: 'change' }],
        payment_method: [{ required: true, message: 'Mode de paiement requis', trigger: 'change' }],
    }
    if (paymentTab.value === 'subscription') {
        base.subscription_id = [{ required: true, message: 'Abonnement requis', trigger: 'change' }]
    } else {
        base.order_id = [{ required: true, message: 'Commande requise', trigger: 'change' }]
    }
    return base
})

// ── Chargement initial ───────────────────────────
onMounted(async () => {
    await paymentStore.fetchAll()
    await subStore.fetchAll()
    await orderStore.fetchAll()
    await clientStore.fetchAll()
})

// ── Abonnements du client sélectionné ───────────
const clientSubscriptions = computed(() => {
    if (!form.value.client_id) return []
    const client = clientStore.clients.find(c => c.id === form.value.client_id)
    if (!client) return []
    return subStore.subscriptions.filter(
        s => s.client === `${client.firstName} ${client.lastName}`
    )
})

// ── Commandes en attente du client sélectionné ──
const clientOrders = computed(() => {
    if (!form.value.client_id) return []
    const client = clientStore.clients.find(c => c.id === form.value.client_id)
    if (!client) return []
    return orderStore.orders.filter(
        o => o.client === `${client.firstName} ${client.lastName}`
            && o.status === 'pending'
    )
})

// ── Abonnement / commande sélectionné(e) ────────
const selectedSubscription = computed(() =>
    clientSubscriptions.value.find(s => s.id === form.value.subscription_id) || null
)

const selectedOrder = computed(() =>
    clientOrders.value.find(o => o.id === form.value.order_id) || null
)

// ── Reset champ lié quand client change ──────────
function onClientChange() {
    form.value.subscription_id = null
    form.value.order_id = null
}

// ── Reset champ lié quand onglet change ──────────
watch(paymentTab, () => {
    form.value.subscription_id = null
    form.value.order_id = null
})

// ── Filtres + pagination ─────────────────────────
const filteredPayments = computed(() => {
    let list = paymentStore.payments
    const q = search.value.toLowerCase()

    if (q) {
        list = list.filter(p =>
            `${p.client} ${p.reference}`.toLowerCase().includes(q)
        )
    }
    if (filterType.value) list = list.filter(p => p.type === filterType.value)
    if (filterMethod.value) list = list.filter(p => p.method === filterMethod.value)

    return list
})

const paginatedPayments = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredPayments.value.slice(start, start + pageSize.value)
})

// ── Créer un paiement ────────────────────────────
async function handleCreate() {
    await formRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            if (paymentTab.value === 'subscription') {
                await paymentStore.createForSubscription(
                    form.value.client_id,
                    form.value.subscription_id,
                    form.value.payment_method
                )
            } else {
                await paymentStore.createForOrder(
                    form.value.client_id,
                    form.value.order_id,
                    form.value.payment_method
                )
            }

            showCreateModal.value = false

            Swal.fire({
                icon: 'success',
                title: 'Paiement enregistré !',
                text: 'Le paiement a été enregistré avec succès.',
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'Super !',
            })

            resetForm()
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: paymentStore.error || 'Impossible d\'enregistrer le paiement.',
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Ouvrir détail ────────────────────────────────
function openDetail(payment) {
    selectedPayment.value = payment
    showDetail.value = true
}

// ── Reset formulaire ─────────────────────────────
function resetForm() {
    form.value = {
        client_id: null,
        subscription_id: null,
        order_id: null,
        payment_method: 'especes',
    }
    formRef.value?.resetFields()
}

// ── Helpers ──────────────────────────────────────
function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency', currency: 'XOF'
    }).format(value ?? 0)
}

function formatDateTime(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

function getMethodLabel(method) {
    const labels = {
        especes: 'Espèces',
        carte: 'Carte bancaire',
        mobile_money: 'Mobile Money',
    }
    return labels[method] ?? method
}

function getMethodTagType(method) {
    const types = {
        especes: 'success',
        carte: 'primary',
        mobile_money: 'warning',
    }
    return types[method] ?? 'info'
}

function getAvatarColor(name) {
    const colors = [
        '#4f46e5', '#7c3aed', '#db2777', '#059669',
        '#d97706', '#dc2626', '#0284c7', '#65a30d',
    ]
    if (!name) return colors[0]
    return colors[name.charCodeAt(0) % colors.length]
}
</script>