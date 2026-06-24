<template>
    <div class="max-w-4xl mx-auto px-4 py-10">

        <h1 class="text-3xl font-black text-gray-800 mb-8">Mes commandes</h1>

        <!-- Loading -->
        <div v-if="shopStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <!-- Vide -->
        <div v-else-if="shopStore.orders.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm">
            <el-icon class="text-7xl text-gray-200 mb-4">
                <Box />
            </el-icon>
            <p class="text-gray-400 font-medium text-lg mb-6">Vous n'avez pas encore de commande</p>
            <router-link :to="gymSlug ? `/shop/${gymSlug}` : '/shop'">
                <el-button type="primary" size="large"
                    style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px;">
                    Découvrir la boutique
                </el-button>
            </router-link>
        </div>

        <!-- Liste commandes -->
        <div v-else class="space-y-6">
            <div v-for="order in shopStore.orders" :key="order.id"
                class="bg-white rounded-2xl shadow-sm overflow-hidden">

                <!-- En-tête commande -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <div>
                        <p class="font-black text-indigo-600">Commande #{{ order.id }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ formatDateTime(order.date) }}</p>
                    </div>
                    <el-tag :type="statusTagType(order.status)" size="large" round>
                        {{ statusLabel(order.status) }}
                    </el-tag>
                </div>

                <!-- Articles -->
                <div class="px-6 py-4">
                    <div class="space-y-3">
                        <div v-for="item in order.items" :key="item.product" class="flex items-center gap-4">
                            <div
                                class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img v-if="item.image" :src="mediaUrl(item.image)"
                                    class="w-full h-full object-cover" />
                                <el-icon v-else class="text-gray-300 text-xl">
                                    <ShoppingBag />
                                </el-icon>
                            </div>
                            <div class="flex-1">
                                <p class="font-semibold text-gray-800 text-sm">{{ item.product }}</p>
                                <p class="text-xs text-gray-500">{{ formatCurrency(item.price) }} × {{ item.quantity }}
                                </p>
                            </div>
                            <span class="font-bold text-gray-800 text-sm">
                                {{ formatCurrency(item.price * item.quantity) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Footer commande -->
                <div class="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                    <span class="text-sm text-gray-500">{{ order.items.length }} article(s)</span>
                    <span class="font-black text-indigo-600 text-lg">
                        Total : {{ formatCurrency(order.total) }}
                    </span>
                </div>

                <!-- ══════════════════════════════════
             SUIVI LIVRAISON
        ══════════════════════════════════ -->
                <div v-if="order.delivery_type === 'livraison'"
                    class="px-6 py-5 border-t border-indigo-50 bg-indigo-50/30">

                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <p class="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
                                Suivi de livraison
                            </p>
                            <p class="text-xs text-gray-500">
                                Adresse : <span class="font-medium text-gray-700">{{ order.delivery_address }}</span>
                            </p>
                        </div>
                        <el-tag :type="deliveryTagType(order.delivery_status)" size="small" round>
                            {{ deliveryLabel(order.delivery_status) }}
                        </el-tag>
                    </div>

                    <!-- Stepper visuel -->
                    <div class="flex items-start justify-between mt-4">
                        <div v-for="(step, i) in deliverySteps" :key="step.value"
                            class="flex flex-col items-center flex-1">
                            <!-- Ligne de connexion + cercle -->
                            <div class="flex items-center w-full">
                                <!-- Ligne gauche -->
                                <div v-if="i > 0" class="flex-1 h-0.5 transition-colors duration-500" :class="isDeliveryReached(order.delivery_status, step.value)
                                    ? 'bg-indigo-600'
                                    : 'bg-gray-200'" />

                                <!-- Cercle étape -->
                                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500"
                                    :class="isDeliveryReached(order.delivery_status, step.value)
                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-400'">
                                    <!-- Icône check si étape passée -->
                                    <el-icon
                                        v-if="isDeliveryReached(order.delivery_status, step.value) && order.delivery_status !== step.value">
                                        <Check />
                                    </el-icon>
                                    <!-- Numéro si étape courante ou future -->
                                    <span v-else class="text-xs font-bold">{{ i + 1 }}</span>
                                </div>

                                <!-- Ligne droite -->
                                <div v-if="i < deliverySteps.length - 1"
                                    class="flex-1 h-0.5 transition-colors duration-500" :class="isDeliveryReached(order.delivery_status, deliverySteps[i + 1].value)
                                        ? 'bg-indigo-600'
                                        : 'bg-gray-200'" />
                            </div>

                            <!-- Label + icône étape -->
                            <div class="flex flex-col items-center mt-2">
                                <el-icon class="text-base mb-0.5" :class="isDeliveryReached(order.delivery_status, step.value)
                                    ? 'text-indigo-600'
                                    : 'text-gray-300'">
                                    <component :is="step.icon" />
                                </el-icon>
                                <span class="text-[10px] font-bold text-center leading-tight" :class="isDeliveryReached(order.delivery_status, step.value)
                                    ? 'text-indigo-600'
                                    : 'text-gray-400'">
                                    {{ step.label }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Message contextuel selon étape -->
                    <div class="mt-4 text-center">
                        <p class="text-xs text-gray-500 italic">
                            {{ deliveryMessage(order.delivery_status) }}
                        </p>
                    </div>

                </div>

                <!-- Retrait en salle -->
                <div v-else-if="order.delivery_type === 'retrait'"
                    class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                    <el-icon class="text-indigo-500">
                        <Location />
                    </el-icon>
                    <p class="text-sm text-gray-600 font-medium">
                        Retrait en salle — disponible sous 24h après validation
                    </p>
                </div>

                <!-- Message statut commande -->
                <div v-if="order.status === 'pending'"
                    class="px-6 py-3 bg-amber-50 border-t border-amber-100 flex items-center gap-2">
                    <el-icon class="text-amber-500">
                        <Clock />
                    </el-icon>
                    <p class="text-amber-700 text-sm font-medium">
                        En attente de confirmation — paiement à effectuer à la livraison ou au retrait.
                    </p>
                </div>

                <div v-else-if="order.status === 'paid'"
                    class="px-6 py-3 bg-green-50 border-t border-green-100 flex items-center gap-2">
                    <el-icon class="text-green-600">
                        <CircleCheck />
                    </el-icon>
                    <p class="text-green-700 text-sm font-medium">
                        Commande confirmée et payée. Merci !
                    </p>
                </div>

                <div v-else-if="order.status === 'cancelled'"
                    class="px-6 py-3 bg-red-50 border-t border-red-100 flex items-center gap-2">
                    <el-icon class="text-red-500">
                        <CircleClose />
                    </el-icon>
                    <p class="text-red-600 text-sm font-medium">Commande annulée.</p>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { mediaUrl } from '@/utils/media'
import { useShopStore } from '@/stores/shop'
import {
    Loading, Box, ShoppingBag, Clock,
    CircleCheck, CircleClose, Location, Check,
    Promotion, SetUp, Van, House,
} from '@element-plus/icons-vue'

const route = useRoute()
const gymSlug = computed(() => route.params.gymSlug || '')
const shopStore = useShopStore()

// ── Étapes de livraison avec icônes ──────────────
const deliverySteps = [
    { value: 'pending', label: 'Reçue', icon: Promotion },
    { value: 'preparing', label: 'Préparation', icon: SetUp },
    { value: 'shipped', label: 'Expédiée', icon: Van },
    { value: 'delivered', label: 'Livrée', icon: House },
]

function loadOrders() {
    shopStore.fetchMyOrders(gymSlug.value)
}

onMounted(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 30000)
    onUnmounted(() => clearInterval(interval))
})

// ── Vérifie si une étape est atteinte ────────────
function isDeliveryReached(current, step) {
    const order = ['pending', 'preparing', 'shipped', 'delivered']
    const currentIdx = order.indexOf(current)
    const stepIdx = order.indexOf(step)
    return currentIdx >= stepIdx && currentIdx !== -1
}

// ── Message contextuel selon étape ───────────────
function deliveryMessage(status) {
    const messages = {
        pending: 'Votre commande a été reçue et est en attente de traitement.',
        preparing: 'Votre commande est en cours de préparation dans notre entrepôt.',
        shipped: 'Votre commande est en route ! Elle sera livrée très prochainement.',
        delivered: 'Votre commande a été livrée. Nous espérons que vous êtes satisfait !',
    }
    return messages[status] ?? 'Statut de livraison inconnu.'
}

// ── Tag couleur livraison ─────────────────────────
function deliveryTagType(status) {
    return {
        pending: 'info',
        preparing: 'warning',
        shipped: 'primary',
        delivered: 'success',
    }[status] ?? 'info'
}

function deliveryLabel(status) {
    return {
        pending: 'Reçue',
        preparing: 'En préparation',
        shipped: 'En route',
        delivered: 'Livrée',
    }[status] ?? '—'
}

// ── Helpers commande ─────────────────────────────
function statusLabel(status) {
    return { pending: 'En attente', paid: 'Confirmée', cancelled: 'Annulée' }[status] ?? status
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
        hour: '2-digit', minute: '2-digit',
    })
}
</script>