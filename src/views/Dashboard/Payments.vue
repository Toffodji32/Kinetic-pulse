<template>
  <div class="bg-[#faf8ff] min-h-screen p-4 sm:p-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black font-headline tracking-tight text-indigo-600">Paiements</h2>
        <p class="text-[#464554] font-medium text-sm sm:text-base">Historique et enregistrement des paiements</p>
      </div>
      <el-button type="primary" size="large" @click="showCreateModal = true" class="hidden sm:inline-flex"
        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700; padding: 12px 20px;">
        <span class="material-symbols-outlined text-lg mr-1">add</span>
        Nouveau paiement
      </el-button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-indigo-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl shadow-indigo-600/10">
        <p class="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">Total encaissé</p>
        <p class="text-lg sm:text-3xl font-black">{{ formatCurrency(paymentStore.totalAmount) }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-green-500">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#464554] mb-1">Abonnements</p>
        <p class="text-xl sm:text-3xl font-black text-[#131b2e]">{{ paymentStore.subscriptionPayments.length }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-amber-500">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#464554] mb-1">Commandes</p>
        <p class="text-xl sm:text-3xl font-black text-[#131b2e]">{{ paymentStore.orderPayments.length }}</p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-2xl p-3 sm:p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
      <el-input v-model="search" placeholder="Rechercher par client, référence..." size="large" clearable style="max-width: 100%; width: 100%; sm:max-width: 320px; sm:width: auto;">
        <template #prefix><span class="material-symbols-outlined text-lg text-[#464554]">search</span></template>
      </el-input>
      <el-select v-model="filterType" placeholder="Tous les types" size="large" clearable style="width: 100%; sm:width: 180px;" class="sm:!w-[180px]">
        <el-option label="Abonnement" value="subscription" />
        <el-option label="Commande" value="order" />
      </el-select>
      <el-select v-model="filterMethod" placeholder="Tous les modes" size="large" clearable style="width: 100%; sm:width: 180px;" class="sm:!w-[180px]">
        <el-option label="Espèces" value="especes" />
        <el-option label="Carte bancaire" value="carte" />
        <el-option label="Mobile Money" value="mobile_money" />
      </el-select>
      <span class="text-[#464554] text-sm font-medium sm:ml-auto">{{ filteredPayments.length }} paiement(s)</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="paymentStore.loading" class="space-y-3 sm:space-y-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-100 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-100 rounded w-24 mb-2"></div>
            <div class="h-3 bg-gray-100 rounded w-40"></div>
          </div>
          <div class="h-6 bg-gray-100 rounded w-20"></div>
        </div>
      </div>
    </div>

    <template v-else>

      <!-- Mobile cards -->
      <div class="sm:hidden space-y-3 mb-6">
        <div v-for="payment in paginatedPayments" :key="payment.id" @click="openDetail(payment)"
          class="bg-white rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
          <div class="flex items-start justify-between mb-2">
            <span class="font-black text-indigo-600 text-xs">{{ payment.reference }}</span>
            <span class="font-black text-[#131b2e] text-sm">{{ formatCurrency(payment.amount) }}</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" :style="{ backgroundColor: getAvatarColor(payment.client) }">{{ payment.client?.charAt(0) }}</div>
            <span class="font-semibold text-[#131b2e] text-sm truncate">{{ payment.client }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <el-tag :type="getMethodTagType(payment.method)" size="small" round>{{ getMethodLabel(payment.method) }}</el-tag>
            <el-tag :type="payment.type === 'subscription' ? 'success' : 'warning'" size="small" round>
              {{ payment.type === 'subscription' ? 'Abonnement' : 'Commande' }}
            </el-tag>
            <span class="text-[#464554]">{{ formatDateTime(payment.date) }}</span>
          </div>
        </div>
        <!-- Empty mobile -->
        <div v-if="paginatedPayments.length === 0" class="flex flex-col items-center py-12">
          <span class="material-symbols-outlined text-5xl text-gray-200 mb-3">payments</span>
          <p class="text-[#464554] font-medium mb-3">Aucun paiement trouvé</p>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <el-table :data="paginatedPayments" style="width: 100%" empty-text="Aucun paiement trouvé">
          <el-table-column label="Référence" min-width="150">
            <template #default="{ row }">
              <span class="font-black text-indigo-600 text-sm">{{ row.reference }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Client" min-width="180">
            <template #default="{ row }">
              <div class="flex items-center gap-2 py-1">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" :style="{ backgroundColor: getAvatarColor(row.client) }">{{ row.client?.charAt(0) }}</div>
                <span class="font-semibold text-[#131b2e]">{{ row.client }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Montant" min-width="120">
            <template #default="{ row }">
              <span class="font-black text-[#131b2e]">{{ formatCurrency(row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Mode" min-width="140">
            <template #default="{ row }">
              <el-tag :type="getMethodTagType(row.method)" size="small" round>{{ getMethodLabel(row.method) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Type" min-width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.type === 'subscription' ? 'success' : 'warning'" size="small" round>{{ row.type === 'subscription' ? 'Abonnement' : 'Commande' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Date" min-width="160">
            <template #default="{ row }">
              <span class="text-[#464554] text-sm">{{ formatDateTime(row.date) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="" min-width="80" align="center">
            <template #default="{ row }">
              <el-button size="small" @click="openDetail(row)" style="background-color: #e0e7ff; color: #4f46e5; border: none; border-radius: 8px; min-height: 36px; min-width: 44px;">
                <span class="material-symbols-outlined text-sm">visibility</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </template>

    <!-- Pagination -->
    <div class="flex justify-center">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
        :total="filteredPayments.length" layout="total, sizes, prev, pager, next" background />
    </div>

    <!-- Mobile FAB -->
    <button @click="showCreateModal = true"
      class="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
      <span class="material-symbols-outlined text-2xl">add</span>
    </button>

    <!-- ═══════════════════════════════════════
         MODAL NOUVEAU PAIEMENT (responsive)
    ═══════════════════════════════════════ -->
    <div class="sm:hidden">
      <el-drawer v-model="showCreateModal" direction="btt" size="90%" :close-on-click-modal="false" @closed="resetForm" title="Enregistrer un paiement">
        <template #default>
          <el-tabs v-model="paymentTab" class="mb-2 px-2">
            <el-tab-pane label="Abonnement" name="subscription" />
            <el-tab-pane label="Commande" name="order" />
          </el-tabs>
          <el-form ref="formRef" :model="form" :rules="currentRules" label-position="top" size="large" class="px-2">
            <el-form-item label="Client" prop="client_id">
              <el-select v-model="form.client_id" placeholder="Rechercher un client..." filterable style="width: 100%" @change="onClientChange">
                <el-option v-for="c in clientStore.clients" :key="c.id" :label="`${c.firstName} ${c.lastName}`" :value="c.id" />
              </el-select>
            </el-form-item>
            <template v-if="paymentTab === 'subscription'">
              <el-form-item label="Abonnement" prop="subscription_id">
                <el-select v-model="form.subscription_id" placeholder="Choisir un abonnement..." style="width: 100%" :disabled="!form.client_id">
                  <el-option v-for="s in clientSubscriptions" :key="s.id" :value="s.id" :label="`${s.type} — ${s.price} FCFA (${s.status})`" />
                  <template #empty>
                    <p class="text-center text-sm text-[#464554] py-4">{{ form.client_id ? 'Aucun abonnement pour ce client' : 'Sélectionnez d\'abord un client' }}</p>
                  </template>
                </el-select>
              </el-form-item>
              <div v-if="selectedSubscription" class="bg-[#f2f3ff] rounded-xl p-4 mb-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-bold text-indigo-600">{{ selectedSubscription.type }}</p>
                    <p class="text-sm text-[#464554]">{{ selectedSubscription.status }}</p>
                  </div>
                  <p class="text-xl font-black text-[#131b2e]">{{ selectedSubscription.price }} FCFA</p>
                </div>
              </div>
            </template>
            <template v-if="paymentTab === 'order'">
              <el-form-item label="Commande" prop="order_id">
                <el-select v-model="form.order_id" placeholder="Choisir une commande..." style="width: 100%" :disabled="!form.client_id">
                  <el-option v-for="o in clientOrders" :key="o.id" :value="o.id" :label="`Commande #${o.id} — ${formatCurrency(o.total)} (${o.status})`" />
                  <template #empty>
                    <p class="text-center text-sm text-[#464554] py-4">{{ form.client_id ? 'Aucune commande en attente' : 'Sélectionnez d\'abord un client' }}</p>
                  </template>
                </el-select>
              </el-form-item>
              <div v-if="selectedOrder" class="bg-[#f2f3ff] rounded-xl p-4 mb-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-bold text-indigo-600">Commande #{{ selectedOrder.id }}</p>
                    <p class="text-sm text-[#464554]">{{ selectedOrder.items?.length ?? 0 }} article(s)</p>
                  </div>
                  <p class="text-xl font-black text-[#131b2e]">{{ formatCurrency(selectedOrder.total) }}</p>
                </div>
              </div>
            </template>
            <el-form-item label="Mode de paiement" prop="payment_method">
              <el-radio-group v-model="form.payment_method" size="large" class="w-full flex flex-col sm:flex-row gap-2">
                <el-radio-button value="especes" style="flex: 1; text-align: center;">💵 Espèces</el-radio-button>
                <el-radio-button value="carte" style="flex: 1; text-align: center;">💳 Carte</el-radio-button>
                <el-radio-button value="mobile_money" style="flex: 1; text-align: center;">📱 Mobile Money</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div class="flex gap-3">
            <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px; flex: 1; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="paymentStore.loading" @click="handleCreate"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; flex: 1; min-height: 44px;">
              Enregistrer
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>
    <div class="hidden sm:block">
      <el-dialog v-model="showCreateModal" title="Enregistrer un paiement" width="540px" :close-on-click-modal="false" @closed="resetForm">
        <el-tabs v-model="paymentTab" class="mb-2">
          <el-tab-pane label="Paiement abonnement" name="subscription" />
          <el-tab-pane label="Paiement commande" name="order" />
        </el-tabs>
        <el-form ref="formRef" :model="form" :rules="currentRules" label-position="top" size="large">
          <el-form-item label="Client" prop="client_id">
            <el-select v-model="form.client_id" placeholder="Rechercher un client..." filterable style="width: 100%" @change="onClientChange">
              <el-option v-for="c in clientStore.clients" :key="c.id" :label="`${c.firstName} ${c.lastName}`" :value="c.id" />
            </el-select>
          </el-form-item>
          <template v-if="paymentTab === 'subscription'">
            <el-form-item label="Abonnement" prop="subscription_id">
              <el-select v-model="form.subscription_id" placeholder="Choisir un abonnement..." style="width: 100%" :disabled="!form.client_id">
                <el-option v-for="s in clientSubscriptions" :key="s.id" :value="s.id" :label="`${s.type} — ${s.price} FCFA (${s.status})`" />
                <template #empty>
                  <p class="text-center text-sm text-[#464554] py-4">{{ form.client_id ? 'Aucun abonnement pour ce client' : 'Sélectionnez d\'abord un client' }}</p>
                </template>
              </el-select>
            </el-form-item>
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
          <template v-if="paymentTab === 'order'">
            <el-form-item label="Commande" prop="order_id">
              <el-select v-model="form.order_id" placeholder="Choisir une commande..." style="width: 100%" :disabled="!form.client_id">
                <el-option v-for="o in clientOrders" :key="o.id" :value="o.id" :label="`Commande #${o.id} — ${formatCurrency(o.total)} (${o.status})`" />
                <template #empty>
                  <p class="text-center text-sm text-[#464554] py-4">{{ form.client_id ? 'Aucune commande en attente' : 'Sélectionnez d\'abord un client' }}</p>
                </template>
              </el-select>
            </el-form-item>
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
          <el-form-item label="Mode de paiement" prop="payment_method">
            <el-radio-group v-model="form.payment_method" size="large" class="w-full">
              <el-radio-button value="especes" style="flex: 1; text-align: center;">💵 Espèces</el-radio-button>
              <el-radio-button value="carte" style="flex: 1; text-align: center;">💳 Carte</el-radio-button>
              <el-radio-button value="mobile_money" style="flex: 1; text-align: center;">📱 Mobile Money</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="paymentStore.loading" @click="handleCreate"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; min-height: 44px;">
              Enregistrer le paiement
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- ═══════════════════════════════════════
         DRAWER DÉTAIL PAIEMENT
    ═══════════════════════════════════════ -->
    <el-drawer v-model="showDetail" direction="rtl" size="420px" :with-header="false" class="!w-full sm:!w-[420px]">
      <div v-if="selectedPayment" class="p-4 sm:p-6 overflow-y-auto h-full">
        <div class="flex flex-col items-center mb-8 pt-4">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-indigo-600 text-2xl sm:text-3xl">account_balance_wallet</span>
          </div>
          <h2 class="text-lg sm:text-xl font-black text-indigo-600">{{ selectedPayment.reference }}</h2>
          <p class="text-[#464554] text-xs sm:text-sm mt-1">{{ formatDateTime(selectedPayment.date) }}</p>
        </div>
        <div class="space-y-3">
          <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Client</span>
            <span class="font-bold text-[#131b2e]">{{ selectedPayment.client }}</span>
          </div>
          <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Montant</span>
            <span class="text-lg sm:text-xl font-black text-indigo-600">{{ formatCurrency(selectedPayment.amount) }}</span>
          </div>
          <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between items-center">
            <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Mode</span>
            <el-tag :type="getMethodTagType(selectedPayment.method)" round>{{ getMethodLabel(selectedPayment.method) }}</el-tag>
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
