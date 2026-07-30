<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">

        <!-- Header -->
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Commandes</h2>
                <p class="text-[#464554] font-medium">Gestion de toutes les commandes</p>
            </div>
            <el-button type="primary" size="large" @click="showCreateModal = true"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2">
                    <Plus />
                </el-icon>
                Nouvelle commande
            </el-button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-indigo-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Total</p>
                <p class="text-3xl font-black text-[#131b2e]">{{ orderStore.orders.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-amber-400">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">En attente</p>
                <p class="text-3xl font-black text-amber-500">{{ orderStore.pendingOrders.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Validées</p>
                <p class="text-3xl font-black text-green-600">{{ orderStore.paidOrders.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-400">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Annulées</p>
                <p class="text-3xl font-black text-red-500">{{ orderStore.cancelledOrders.length }}</p>
            </div>
        </div>

        <!-- Filtres -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
            <el-input v-model="search" placeholder="Rechercher par client, ID..." size="large" clearable
                style="max-width: 300px;">
                <template #prefix><el-icon>
                        <Search />
                    </el-icon></template>
            </el-input>

            <el-select v-model="filterStatus" placeholder="Tous les statuts" size="large" clearable
                style="width: 180px;">
                <el-option label="En attente" value="pending" />
                <el-option label="Validée" value="paid" />
                <el-option label="Annulée" value="cancelled" />
            </el-select>

            <span class="text-[#464554] text-sm font-medium ml-auto">
                {{ filteredOrders.length }} commande(s)
            </span>
        </div>

        <!-- Loading -->
        <div v-if="orderStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <!-- Tableau -->
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <el-table :data="paginatedOrders" style="width: 100%" empty-text="Aucune commande trouvée">

                <el-table-column label="#" min-width="80">
                    <template #default="{ row }">
                        <div class="flex flex-col">
                            <span class="font-black text-indigo-600">#{{ row.id }}</span>
                            <!-- Badge FedaPay visible dans le tableau -->
                            <span v-if="row.fedapay_transaction_id"
                                class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5 w-fit">
                                FedaPay
                            </span>
                        </div>
                    </template>
                </el-table-column>

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

                <el-table-column label="Articles" min-width="200">
                    <template #default="{ row }">
                        <div class="flex flex-wrap gap-1 py-1">
                            <el-tag v-for="item in row.items?.slice(0, 2)" :key="item.product" size="small"
                                style="background: #f2f3ff; color: #4f46e5; border: none; border-radius: 6px;">
                                {{ item.product }} ×{{ item.quantity }}
                            </el-tag>
                            <el-tag v-if="row.items?.length > 2" size="small" type="info">
                                +{{ row.items.length - 2 }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Total" min-width="120">
                    <template #default="{ row }">
                        <span class="font-black text-[#131b2e]">{{ formatCurrency(row.total) }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="Statut" min-width="130" align="center">
                    <template #default="{ row }">
                        <el-tag :type="statusTagType(row.status)" size="small" round>
                            {{ statusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="Date" min-width="150">
                    <template #default="{ row }">
                        <span class="text-[#464554] text-sm">{{ formatDateTime(row.date) }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="Actions" min-width="200" align="center">
                    <template #default="{ row }">
                        <div class="flex gap-2 justify-center">
                            <el-button size="small" @click="openDetail(row)"
                                style="background-color: #e0e7ff; color: #4f46e5; border: none; border-radius: 8px; font-weight: 600;">
                                <el-icon class="mr-1">
                                    <View />
                                </el-icon>
                                Voir
                            </el-button>
                            <el-button v-if="row.status === 'pending'" size="small" type="success" plain
                                @click="handleValidate(row)" style="border-radius: 8px;">
                                <el-icon>
                                    <CircleCheck />
                                </el-icon>
                            </el-button>
                            <el-button v-if="row.status === 'pending'" size="small" type="danger" plain
                                @click="handleCancel(row)" style="border-radius: 8px;">
                                <el-icon>
                                    <Close />
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
                :total="filteredOrders.length" layout="total, sizes, prev, pager, next" background />
        </div>

        <!-- MODAL CRÉATION -->
        <el-dialog v-model="showCreateModal" title="Nouvelle commande" width="600px" :close-on-click-modal="false"
            @closed="resetCreateForm">
            <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-position="top" size="large">

                <el-form-item label="Client" prop="client_id">
                    <el-select v-model="createForm.client_id" placeholder="Rechercher un client..." filterable
                        style="width: 100%">
                        <el-option v-for="c in clientStore.clients" :key="c.id" :label="`${c.firstName} ${c.lastName}`"
                            :value="c.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="Produits" prop="items">
                    <div class="w-full space-y-3">
                        <div v-for="(item, index) in createForm.items" :key="index"
                            class="flex gap-3 items-center bg-[#f2f3ff] rounded-xl p-3">
                            <el-select v-model="item.product_id" placeholder="Produit..." filterable style="flex: 1"
                                @change="(id) => onProductSelect(id, index)">
                                <el-option v-for="p in productStore.inStock" :key="p.id" :value="p.id"
                                    :label="`${p.name} — ${formatCurrency(p.price)}`" />
                            </el-select>
                            <el-input-number v-model="item.quantity" :min="1" :max="getProductStock(item.product_id)"
                                size="default" style="width: 120px;" />
                            <span class="font-bold text-indigo-600 min-w-[70px] text-right">
                                {{ item.product_id ? formatCurrency(getItemSubtotal(item)) : '—' }}
                            </span>
                            <el-button circle type="danger" plain size="small" @click="removeItem(index)"
                                :disabled="createForm.items.length === 1">
                                <el-icon>
                                    <Minus />
                                </el-icon>
                            </el-button>
                        </div>
                        <el-button plain style="width: 100%; border-radius: 10px; border-style: dashed;"
                            @click="addItem">
                            <el-icon class="mr-2">
                                <Plus />
                            </el-icon>
                            Ajouter un produit
                        </el-button>
                    </div>
                </el-form-item>

                <div class="bg-indigo-600 rounded-xl p-4 flex justify-between items-center mt-2">
                    <span class="text-white font-bold">Total commande</span>
                    <span class="text-white text-2xl font-black">{{ formatCurrency(orderTotal) }}</span>
                </div>

            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="orderStore.loading" @click="handleCreate"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Créer la commande
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- DRAWER DÉTAIL -->
        <el-drawer v-model="showDetail" direction="rtl" size="500px" :with-header="false">
            <div v-if="selectedOrder" class="p-6 h-full overflow-y-auto">

                <!-- En-tête -->
                <div class="flex justify-between items-start mb-6 pt-4">
                    <div>
                        <h2 class="text-2xl font-black text-[#131b2e]">Commande #{{ selectedOrder.id }}</h2>
                        <p class="text-[#464554] text-sm mt-1">{{ formatDateTime(selectedOrder.date) }}</p>
                    </div>
                    <el-tag :type="statusTagType(selectedOrder.status)" size="large" round>
                        {{ statusLabel(selectedOrder.status) }}
                    </el-tag>
                </div>

                <!-- Client -->
                <div class="bg-[#f2f3ff] rounded-xl p-4 flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                        :style="{ backgroundColor: getAvatarColor(selectedOrder.client) }">
                        {{ selectedOrder.client?.charAt(0) }}
                    </div>
                    <div>
                        <p class="font-bold text-[#131b2e]">{{ selectedOrder.client }}</p>
                        <p class="text-xs text-[#464554]">Client</p>
                    </div>
                </div>

                <!-- Articles -->
                <div class="mb-6">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-3">Articles commandés</h3>
                    <div class="space-y-3">
                        <div v-for="item in selectedOrder.items" :key="item.product"
                            class="bg-white border border-indigo-50 rounded-xl p-4 flex justify-between items-center shadow-sm">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-[#f2f3ff] rounded-lg flex items-center justify-center">
                                    <el-icon class="text-indigo-400">
                                        <ShoppingBag />
                                    </el-icon>
                                </div>
                                <div>
                                    <p class="font-bold text-[#131b2e] text-sm">{{ item.product }}</p>
                                    <p class="text-xs text-[#464554]">{{ formatCurrency(item.price) }} × {{
                                        item.quantity }}</p>
                                </div>
                            </div>
                            <span class="font-black text-indigo-600">
                                {{ formatCurrency(item.price * item.quantity) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Total -->
                <div class="bg-indigo-600 rounded-xl p-4 flex justify-between items-center mb-6">
                    <span class="text-white font-bold">Total</span>
                    <span class="text-white text-2xl font-black">{{ formatCurrency(selectedOrder.total) }}</span>
                </div>

                <!-- Dans le drawer, après le bloc Total, si livraison -->
                <div v-if="selectedOrder.delivery_type === 'livraison'"
                    class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p class="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Suivi livraison</p>

                    <p class="text-sm text-gray-600 mb-1">
                        <span class="font-bold">Adresse :</span> {{ selectedOrder.delivery_address }}
                    </p>

                    <!-- Stepper statut livraison -->
                    <div class="flex items-center gap-2 mt-3 mb-4">
                        <div v-for="(step, i) in deliverySteps" :key="step.value" class="flex items-center gap-1">
                            <div class="flex flex-col items-center">
                                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                    :class="isDeliveryReached(selectedOrder.delivery_status, step.value)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-400'">
                                    {{ i + 1 }}
                                </div>
                                <span class="text-[10px] text-gray-500 mt-1 text-center w-14">{{ step.label }}</span>
                            </div>
                            <div v-if="i < deliverySteps.length - 1" class="w-8 h-0.5 mb-4" :class="isDeliveryReached(selectedOrder.delivery_status, deliverySteps[i + 1].value)
                                ? 'bg-indigo-600'
                                : 'bg-gray-200'" />
                        </div>
                    </div>

                    <!-- Changer le statut -->
                    <div v-if="selectedOrder.status === 'paid'" class="flex gap-2 flex-wrap">
                        <el-button v-for="step in deliverySteps" :key="step.value" size="small"
                            :type="selectedOrder.delivery_status === step.value ? 'primary' : 'default'"
                            @click="handleUpdateDelivery(selectedOrder, step.value)" style="border-radius: 8px;">
                            {{ step.label }}
                        </el-button>
                    </div>
                </div>

                <!-- Si retrait en salle -->
                <div v-else-if="selectedOrder.delivery_type === 'retrait'"
                    class="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                    <el-icon class="text-indigo-600">
                        <Location />
                    </el-icon>
                    <p class="text-sm text-gray-600 font-medium">Retrait en salle</p>
                </div>

                <!-- ← NOUVEAU : bloc vérification FedaPay -->
                <div v-if="selectedOrder.fedapay_transaction_id && selectedOrder.status === 'pending'"
                    class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <p class="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">
                        Vérification paiement FedaPay
                    </p>
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <p class="text-sm font-bold text-gray-800">Transaction ID</p>
                            <p class="text-xs text-gray-500 font-mono mt-0.5 break-all">
                                {{ selectedOrder.fedapay_transaction_id }}
                            </p>
                        </div>
                        <el-button size="small" type="warning" plain style="border-radius: 8px; flex-shrink: 0;"
                            @click="openFedaPay(selectedOrder.fedapay_transaction_id)">
                            Vérifier →
                        </el-button>
                    </div>
                    <p class="text-xs text-amber-600 mt-3 flex items-center gap-1">
                        <el-icon>
                            <Warning />
                        </el-icon>
                        Vérifiez que le montant et le statut correspondent avant de valider.
                    </p>
                </div>

                <!-- Actions selon statut -->
                <div class="space-y-3">

                    <template v-if="selectedOrder.status === 'pending'">

                        <el-button type="success" size="large" class="w-full" :loading="orderStore.loading"
                            style="border-radius: 12px; font-weight: 700;" @click="handleValidate(selectedOrder)">
                            <el-icon class="mr-2">
                                <CircleCheck />
                            </el-icon>
                            Valider la commande
                        </el-button>

                        <div class="flex items-center gap-3">
                            <div class="flex-1 h-px bg-gray-200"></div>
                            <span class="text-xs text-gray-400 font-medium">ou</span>
                            <div class="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <el-button type="primary" size="large" class="w-full"
                            style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
                            @click="goToPayment">
                            <el-icon class="mr-2">
                                <Wallet />
                            </el-icon>
                            Enregistrer paiement en caisse
                        </el-button>

                        <el-button type="danger" plain size="large" class="w-full"
                            style="border-radius: 12px; font-weight: 700;" @click="handleCancel(selectedOrder)">
                            <el-icon class="mr-2">
                                <Close />
                            </el-icon>
                            Annuler la commande
                        </el-button>

                    </template>

                    <div v-else-if="selectedOrder.status === 'paid'"
                        class="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                        <el-icon class="text-green-600 text-3xl mb-2">
                            <CircleCheck />
                        </el-icon>
                        <p class="text-green-700 font-black">Commande validée</p>
                        <p class="text-green-600 text-sm mt-1">Remise au client ou en cours de livraison</p>
                        <!-- ← NOUVEAU : afficher la référence FedaPay même après validation -->
                        <p v-if="selectedOrder.fedapay_transaction_id" class="text-xs text-gray-400 font-mono mt-2">
                            Réf : FEDAPAY-{{ selectedOrder.fedapay_transaction_id }}
                        </p>
                    </div>

                    <div v-else-if="selectedOrder.status === 'cancelled'"
                        class="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                        <el-icon class="text-red-500 text-3xl mb-2">
                            <CircleClose />
                        </el-icon>
                        <p class="text-red-600 font-black">Commande annulée</p>
                        <p class="text-red-500 text-sm mt-1">Le stock a été remis à jour automatiquement</p>
                    </div>

                </div>

            </div>
        </el-drawer>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { useClientStore } from '@/stores/client'
import { useProductStore } from '@/stores/product'
import Swal from 'sweetalert2'
import { Location } from '@element-plus/icons-vue'
import {
    Plus, Search, View, Loading, Minus,
    Close, CircleCheck, CircleClose, ShoppingBag, Wallet, Warning
} from '@element-plus/icons-vue'

const router = useRouter()
const orderStore = useOrderStore()
const clientStore = useClientStore()
const productStore = useProductStore()

const deliverySteps = [
    { value: 'pending', label: 'Reçue' },
    { value: 'preparing', label: 'Préparation' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
]

const search = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showCreateModal = ref(false)
const showDetail = ref(false)
const selectedOrder = ref(null)
const createFormRef = ref(null)

const createForm = ref({
    client_id: null,
    items: [{ product_id: null, quantity: 1 }],
})

const createRules = {
    client_id: [{ required: true, message: 'Client obligatoire', trigger: 'change' }],
}

onMounted(async () => {
    await orderStore.fetchAll()
    await clientStore.fetchAll()
    await productStore.fetchAll()
})

const orderTotal = computed(() =>
    createForm.value.items.reduce((sum, item) => {
        const product = productStore.products.find(p => p.id === item.product_id)
        return sum + (product ? product.price * item.quantity : 0)
    }, 0)
)

const filteredOrders = computed(() => {
    let list = orderStore.orders
    const q = search.value.toLowerCase()
    if (q) list = list.filter(o => `${o.client} #${o.id}`.toLowerCase().includes(q))
    if (filterStatus.value) list = list.filter(o => o.status === filterStatus.value)
    return list
})

const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredOrders.value.slice(start, start + pageSize.value)
})

function addItem() { createForm.value.items.push({ product_id: null, quantity: 1 }) }
function removeItem(index) { createForm.value.items.splice(index, 1) }
function onProductSelect(productId, index) { createForm.value.items[index].quantity = 1 }
function getProductStock(productId) {
    return productStore.products.find(p => p.id === productId)?.quantity ?? 99
}
function getItemSubtotal(item) {
    const product = productStore.products.find(p => p.id === item.product_id)
    return product ? product.price * item.quantity : 0
}

async function handleCreate() {
    await createFormRef.value.validate(async (valid) => {
        if (!valid) return

        const validItems = createForm.value.items.filter(i => i.product_id && i.quantity > 0)
        if (validItems.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Ajoutez au moins un produit', confirmButtonColor: '#4f46e5' })
            return
        }

        try {
            const created = await orderStore.create({
                client_id: createForm.value.client_id,
                items: validItems,
            })
            showCreateModal.value = false

            const result = await Swal.fire({
                icon: 'success',
                title: 'Commande créée !',
                html: `<p>Commande <strong>#${created.order_id}</strong> — <strong>${formatCurrency(created.total)}</strong></p><p class="mt-2 text-sm text-gray-500">Voulez-vous enregistrer le paiement maintenant ?</p>`,
                showCancelButton: true,
                confirmButtonColor: '#4f46e5',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Payer maintenant',
                cancelButtonText: 'Plus tard',
            })

            resetCreateForm()
            if (result.isConfirmed) router.push('/admin/payments')
        } catch {
            Swal.fire({
                icon: 'error', title: 'Erreur',
                text: orderStore.error || 'Impossible de créer la commande.',
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

async function handleValidate(order) {
    // ← NOUVEAU : avertissement si commande FedaPay non vérifiée
    if (order.fedapay_transaction_id) {
        const check = await Swal.fire({
            icon: 'warning',
            title: 'Avez-vous vérifié le paiement FedaPay ?',
            html: `<p>Transaction ID : <strong class="font-mono">${order.fedapay_transaction_id}</strong></p><p class="mt-2 text-sm text-gray-500">Assurez-vous que le paiement est bien <strong>approuvé</strong> sur FedaPay avant de valider.</p>`,
            showCancelButton: true,
            confirmButtonColor: '#059669',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, j\'ai vérifié — Valider',
            cancelButtonText: 'Vérifier d\'abord',
            reverseButtons: true,
        })
        if (!check.isConfirmed) {
            // ouvrir FedaPay si l'admin veut vérifier avant
            window.open(`https://app.fedapay.com/transactions/${order.fedapay_transaction_id}`, '_blank')
            return
        }
    } else {
        // commande admin classique → confirmation simple
        const result = await Swal.fire({
            icon: 'question',
            title: 'Valider cette commande ?',
            html: `<p>La commande <strong>#${order.id}</strong> de <strong>${order.client}</strong> sera marquée comme validée.</p>`,
            showCancelButton: true,
            confirmButtonColor: '#059669',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, valider',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
        })
        if (!result.isConfirmed) return
    }

    try {
        await orderStore.validate(order.id)
        if (selectedOrder.value?.id === order.id) {
            selectedOrder.value = { ...selectedOrder.value, status: 'paid' }
        }
        Swal.fire({
            icon: 'success',
            title: 'Commande validée !',
            html: `<p>La commande <strong>#${order.id}</strong> est validée.</p>${order.fedapay_transaction_id ? '<p class="text-sm text-gray-500 mt-1">Un paiement a été créé automatiquement.</p>' : ''}`,
            confirmButtonColor: '#4f46e5',
            timer: 3000,
            showConfirmButton: false,
        })
    } catch {
        Swal.fire({
            icon: 'error', title: 'Erreur',
            text: orderStore.error || 'Impossible de valider la commande.',
            confirmButtonColor: '#4f46e5',
        })
    }
}

async function handleCancel(order) {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Annuler cette commande ?',
        html: `<p>La commande <strong>#${order.id}</strong> sera annulée et le stock remis à jour.</p>`,
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, annuler',
        cancelButtonText: 'Garder',
        reverseButtons: true,
    })
    if (!result.isConfirmed) return

    try {
        await orderStore.cancel(order.id)
        if (selectedOrder.value?.id === order.id) {
            selectedOrder.value = { ...selectedOrder.value, status: 'cancelled' }
        }
        Swal.fire({
            icon: 'success',
            title: 'Commande annulée',
            text: 'Le stock a été remis à jour automatiquement.',
            confirmButtonColor: '#4f46e5',
            timer: 2500,
            showConfirmButton: false,
        })
    } catch {
        Swal.fire({
            icon: 'error', title: 'Erreur',
            text: orderStore.error || "Impossible d'annuler la commande.",
            confirmButtonColor: '#4f46e5',
        })
    }
}

function openDetail(order) {
    selectedOrder.value = order
    showDetail.value = true
}

function isDeliveryReached(current, step) {
    const order = ['pending', 'preparing', 'shipped', 'delivered']
    return order.indexOf(current) >= order.indexOf(step)
}

async function handleUpdateDelivery(order, deliveryStatus) {
    try {
        await orderStore.updateDelivery(order.id, deliveryStatus)
        if (selectedOrder.value?.id === order.id) {
            selectedOrder.value = { ...selectedOrder.value, delivery_status: deliveryStatus }
        }
        Swal.fire({
            icon: 'success', title: 'Livraison mise à jour !',
            confirmButtonColor: '#4f46e5',
            timer: 1500, showConfirmButton: false,
        })
    } catch {
        Swal.fire({ icon: 'error', title: 'Erreur', confirmButtonColor: '#4f46e5' })
    }
}

// ← NOUVEAU
function openFedaPay(transactionId) {
    window.open(`https://sandbox.fedapay.com/transactions/${transactionId}`, '_blank')
}

function goToPayment() {
    showDetail.value = false
    router.push('/admin/payments')
}

function resetCreateForm() {
    createForm.value = { client_id: null, items: [{ product_id: null, quantity: 1 }] }
    createFormRef.value?.resetFields()
}

function statusLabel(status) {
    return { pending: 'En attente', paid: 'Validée', cancelled: 'Annulée' }[status] ?? status
}

function statusTagType(status) {
    return { pending: 'warning', paid: 'success', cancelled: 'danger' }[status] ?? 'info'
}

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency', currency: 'XOF', maximumFractionDigits: 0
    }).format(value ?? 0)
}

function formatDateTime(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

function getAvatarColor(name) {
    const colors = ['#4f46e5', '#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626', '#0284c7', '#65a30d']
    if (!name) return colors[0]
    return colors[name.charCodeAt(0) % colors.length]
}
</script>