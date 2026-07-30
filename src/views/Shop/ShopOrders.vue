<template>
  <div class="min-h-screen bg-[#faf8ff] pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2">
            <span class="material-symbols-outlined text-[#131b2e] text-2xl">arrow_back</span>
          </button>
          <h1 class="font-black text-[#131b2e] text-lg">Mes commandes</h1>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-4">
      <!-- Loading skeletons -->
      <div v-if="shopStore.loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl shadow-sm p-5">
          <div class="flex justify-between items-center mb-4">
            <div class="space-y-2">
              <div class="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
              <div class="h-3 bg-gray-100 rounded animate-pulse w-24"></div>
            </div>
            <div class="h-7 bg-gray-100 rounded-full animate-pulse w-24"></div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-100 rounded animate-pulse w-full"></div>
            <div class="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
          </div>
          <div class="flex justify-between mt-4 pt-4 border-t border-gray-100">
            <div class="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
            <div class="h-5 bg-gray-100 rounded animate-pulse w-28"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="shopStore.orders.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-5xl text-gray-300">inventory_2</span>
        </div>
        <p class="text-[#131b2e] font-bold text-xl mb-1">Aucune commande</p>
        <p class="text-sm text-[#464554] mb-8">Vous n'avez pas encore passé de commande</p>
        <router-link :to="gymSlug ? `/shop/${gymSlug}` : '/shop'">
          <el-button type="primary" size="large" style="border-radius:12px;background-color:#4f46e5;border-color:#4f46e5;">
            <span class="material-symbols-outlined text-base mr-1">storefront</span>
            Découvrir la boutique
          </el-button>
        </router-link>
      </div>

      <!-- Orders list -->
      <div v-else class="space-y-4">
        <div v-for="order in shopStore.orders" :key="order.id" class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <!-- Order header -->
          <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <div>
              <p class="font-black text-[#4f46e5]">Commande #{{ order.id }}</p>
              <p class="text-xs text-[#464554] mt-0.5">{{ formatDateTime(order.date) }}</p>
            </div>
            <el-tag :type="statusTagType(order.status)" size="large" round>
              {{ statusLabel(order.status) }}
            </el-tag>
          </div>

          <!-- Items preview -->
          <div class="px-5 py-4">
            <div class="space-y-2">
              <div v-for="item in order.items" :key="item.product" class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img v-if="item.image" :src="mediaUrl(item.image)" class="w-full h-full object-cover" />
                  <span v-else class="material-symbols-outlined text-gray-300 text-lg">shopping_bag</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-[#131b2e] text-sm truncate">{{ item.product }}</p>
                  <p class="text-xs text-[#464554]">{{ formatCurrency(item.price) }} × {{ item.quantity }}</p>
                </div>
                <span class="font-bold text-[#131b2e] text-sm flex-shrink-0">{{ formatCurrency(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>

          <!-- Order footer -->
          <div class="px-5 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
            <span class="text-sm text-[#464554]">{{ order.items.length }} article(s)</span>
            <span class="font-black text-[#4f46e5]">Total : {{ formatCurrency(order.total) }}</span>
          </div>

          <!-- Delivery tracking -->
          <div v-if="order.delivery_type === 'livraison'" class="px-5 py-4 border-t border-indigo-50 bg-indigo-50/30">
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-[#4f46e5] mb-0.5">Suivi de livraison</p>
                <p class="text-xs text-[#464554]">Adresse : <span class="font-medium text-[#131b2e]">{{ order.delivery_address }}</span></p>
              </div>
              <el-tag :type="deliveryTagType(order.delivery_status)" size="small" round>
                {{ deliveryLabel(order.delivery_status) }}
              </el-tag>
            </div>

            <!-- Stepper -->
            <div class="flex items-start justify-between mt-3">
              <div v-for="(step, i) in deliverySteps" :key="step.value" class="flex flex-col items-center flex-1">
                <div class="flex items-center w-full">
                  <div v-if="i > 0" class="flex-1 h-0.5 transition-colors duration-500" :class="isDeliveryReached(order.delivery_status, step.value) ? 'bg-[#4f46e5]' : 'bg-gray-200'" />
                  <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 text-[10px] font-bold"
                    :class="isDeliveryReached(order.delivery_status, step.value) ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'bg-white border-gray-300 text-[#464554]'">
                    <span v-if="isDeliveryReached(order.delivery_status, step.value) && order.delivery_status !== step.value" class="material-symbols-outlined text-xs">check</span>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <div v-if="i < deliverySteps.length - 1" class="flex-1 h-0.5 transition-colors duration-500" :class="isDeliveryReached(order.delivery_status, deliverySteps[i + 1].value) ? 'bg-[#4f46e5]' : 'bg-gray-200'" />
                </div>
                <span class="text-[9px] font-bold text-center mt-1 leading-tight" :class="isDeliveryReached(order.delivery_status, step.value) ? 'text-[#4f46e5]' : 'text-[#464554]'">
                  {{ step.label }}
                </span>
              </div>
            </div>

            <p class="text-xs text-[#464554] italic text-center mt-3">{{ deliveryMessage(order.delivery_status) }}</p>
          </div>

          <!-- Pickup info -->
          <div v-else-if="order.delivery_type === 'retrait'" class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
            <span class="material-symbols-outlined text-[#4f46e5] text-lg">location_on</span>
            <p class="text-sm text-[#464554] font-medium">Retrait en salle — disponible sous 24h après validation</p>
          </div>

          <!-- Status messages -->
          <div v-if="order.status === 'pending'" class="px-5 py-3 bg-amber-50 border-t border-amber-100 flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500 text-lg">schedule</span>
            <p class="text-amber-700 text-sm font-medium">En attente de confirmation — paiement à effectuer à la livraison ou au retrait.</p>
          </div>
          <div v-else-if="order.status === 'paid'" class="px-5 py-3 bg-green-50 border-t border-green-100 flex items-center gap-2">
            <span class="material-symbols-outlined text-green-600 text-lg">check_circle</span>
            <p class="text-green-700 text-sm font-medium">Commande confirmée et payée. Merci !</p>
          </div>
          <div v-else-if="order.status === 'cancelled'" class="px-5 py-3 bg-red-50 border-t border-red-100 flex items-center gap-2">
            <span class="material-symbols-outlined text-red-500 text-lg">cancel</span>
            <p class="text-red-600 text-sm font-medium">Commande annulée.</p>
          </div>
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

const route = useRoute()
const gymSlug = computed(() => route.params.gymSlug || '')
const shopStore = useShopStore()

// ── Étapes de livraison avec icônes ──────────────
const deliverySteps = [
    { value: 'pending', label: 'Reçue', icon: 'pending' },
    { value: 'preparing', label: 'Préparation', icon: 'build' },
    { value: 'shipped', label: 'Expédiée', icon: 'local_shipping' },
    { value: 'delivered', label: 'Livrée', icon: 'home' },
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

<style scoped>
</style>
