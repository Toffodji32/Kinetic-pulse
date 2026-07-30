<template>
  <div class="bg-[#faf8ff] min-h-screen p-4 sm:p-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-10">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black font-headline tracking-tight text-indigo-600">Résumé exécutif</h2>
        <p class="text-[#464554] font-medium text-sm sm:text-base">Indicateurs de performance détaillés pour votre salle.</p>
      </div>
      <div class="flex gap-2">
        <button class="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#e2e7ff] text-[#131b2e] font-semibold rounded-lg hover:bg-[#dae2fd] transition-colors text-sm min-h-[44px]">
          <span class="material-symbols-outlined text-xl">calendar_today</span>
          <span class="hidden sm:inline">30 derniers jours</span>
        </button>
        <button @click="dash.fetchStats()" class="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-600/20 text-sm min-h-[44px]">
          <span class="material-symbols-outlined text-xl">refresh</span>
          <span class="hidden sm:inline">Actualiser</span>
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="dash.loading" class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm animate-pulse">
          <div class="h-10 w-10 bg-gray-100 rounded-xl mb-3"></div>
          <div class="h-4 bg-gray-100 rounded w-24 mb-2"></div>
          <div class="h-7 bg-gray-100 rounded w-32"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm animate-pulse h-64 sm:h-80"></div>
        <div class="bg-white rounded-2xl shadow-sm animate-pulse h-64 sm:h-80"></div>
      </div>
    </div>

    <!-- Erreur globale -->
    <div v-else-if="dash.error" class="bg-red-50 text-red-600 px-6 py-4 rounded-xl mb-6 font-semibold">
      {{ dash.error }}
    </div>

    <template v-else>

      <!-- Alertes Stock -->
      <div v-if="dash.outOfStock > 0" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-red-500">warning</span>
          <p class="text-red-700 font-semibold">Alerte Stock</p>
        </div>
        <p class="text-red-600 mt-1 text-sm">
          {{ dash.outOfStock }} produit(s) en rupture de stock.
          <router-link to="/admin/products" class="underline hover:text-red-800 font-semibold">Gérer le stock</router-link>
        </p>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8">

        <!-- Revenue Card — totalRevenue + todayRevenue -->
        <div class="col-span-2 bg-indigo-600 rounded-2xl p-5 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-600/10">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-white/80">payments</span>
            </div>
            <p class="text-white/70 font-semibold text-xs sm:text-sm mb-1">Revenu total</p>
            <h3 class="text-2xl sm:text-4xl font-black font-headline mb-3 sm:mb-4">
              {{ formatCurrency(totalRevenue) }}
            </h3>
            <div class="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
              <div class="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <span class="opacity-70">Aujourd'hui :</span>
                {{ formatCurrency(todayRevenue) }}
              </div>
              <div class="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <span class="opacity-70">Commandes :</span>
                {{ dash.stats?.orders?.total ?? 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Abonnements Card -->
        <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 bg-[#e1e0ff] text-indigo-600 rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined">card_membership</span>
            </div>
            <span class="text-[#464554] font-bold text-[10px] uppercase tracking-wider">Abonnements</span>
          </div>
          <div>
            <h3 class="text-2xl sm:text-3xl font-black font-headline">
              {{ activeSubscriptionsCount + expiredSubscriptionsCount }}
            </h3>
            <div class="mt-3 flex flex-col gap-2">
              <div class="w-full bg-[#f2f3ff] h-2 rounded-full overflow-hidden">
                <div class="bg-indigo-600 h-full rounded-full transition-all" :style="{ width: retentionRate + '%' }"></div>
              </div>
              <div class="flex justify-between text-[10px] sm:text-xs font-semibold">
                <span class="text-green-600">Actifs : {{ activeSubscriptionsCount }}</span>
                <span class="text-red-600">Expirés : {{ expiredSubscriptionsCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Clients Card -->
        <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined">group</span>
            </div>
            <span class="text-[#464554] font-bold text-[10px] uppercase tracking-wider">Total clients</span>
          </div>
          <div>
            <h3 class="text-2xl sm:text-3xl font-black font-headline">{{ dash.totalClients }}</h3>
            <p class="text-[#464554] text-xs sm:text-sm font-medium mt-1">{{ dash.stats?.users?.total ?? 0 }} utilisateurs système</p>
          </div>
        </div>

        <!-- Check-ins aujourd'hui -->
        <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-indigo-500">
          <p class="text-[#464554] text-[10px] font-bold uppercase tracking-widest mb-1">Check-ins aujourd'hui</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl sm:text-3xl font-black font-headline">{{ dash.todayCheckins }}</h3>
            <span class="text-green-600 font-bold text-xs">entrées</span>
          </div>
          <div class="mt-4 space-y-2 sm:space-y-3">
            <div class="flex items-center justify-between text-[10px] sm:text-xs font-medium text-[#464554]">
              <span>Abonnements actifs</span>
              <span>{{ activeSubscriptionsCount }}</span>
            </div>
            <div class="flex items-center justify-between text-[10px] sm:text-xs font-medium text-[#464554]">
              <span>Abonnements expirés</span>
              <span class="text-red-500">{{ expiredSubscriptionsCount }}</span>
            </div>
            <div class="flex items-center justify-between text-[10px] sm:text-xs font-medium text-indigo-600 font-bold">
              <span>Taux de présence</span>
              <span>{{ activeSubscriptionsCount > 0 ? Math.round((dash.todayCheckins / activeSubscriptionsCount) * 100) : 0 }}%</span>
            </div>
          </div>
        </div>

        <!-- Orders & Products -->
        <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-[#f2f3ff] text-[#131b2e] rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined">shopping_bag</span>
            </div>
            <span class="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">BOUTIQUE</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-[10px] text-[#464554] font-bold uppercase">Commandes</p>
              <p class="text-lg sm:text-xl font-black font-headline">{{ dash.stats?.orders?.total ?? 0 }}</p>
            </div>
            <div>
              <p class="text-[10px] text-[#464554] font-bold uppercase">Produits</p>
              <p class="text-lg sm:text-xl font-black font-headline">{{ dash.stats?.products?.total ?? 0 }}</p>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100">
            <div class="flex justify-between items-center mb-2">
              <span class="text-[10px] sm:text-xs text-red-600 font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">warning</span>
                {{ productStore.outOfStock.length }} Rupture de stock
              </span>
              <router-link to="/admin/products" class="text-indigo-600 text-[10px] sm:text-xs font-bold hover:underline">Gérer le stock</router-link>
            </div>
            <div v-if="productStore.outOfStock.length > 0" class="space-y-1">
              <div v-for="product in productStore.outOfStock.slice(0, 3)" :key="product.id" class="text-[10px] sm:text-xs text-red-600">• {{ product.name }}</div>
              <div v-if="productStore.outOfStock.length > 3" class="text-[10px] sm:text-xs text-indigo-600 font-bold">+{{ productStore.outOfStock.length - 3 }} autres...</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-span-2 bg-[#f2f3ff] rounded-2xl p-4 sm:p-6 shadow-sm">
          <h4 class="font-bold text-xs sm:text-sm mb-4">Actions rapides</h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <router-link to="/admin/clients" class="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl hover:shadow-md transition-shadow group">
              <div class="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <span class="material-symbols-outlined">person_add</span>
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-center">Ajouter un client</span>
            </router-link>
            <router-link to="/admin/subscriptions" class="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl hover:shadow-md transition-shadow group">
              <div class="w-11 h-11 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                <span class="material-symbols-outlined">verified</span>
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-center">Abonnement</span>
            </router-link>
            <router-link to="/admin/payments" class="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl hover:shadow-md transition-shadow group">
              <div class="w-11 h-11 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <span class="material-symbols-outlined">add_card</span>
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-center">Enregistrer un paiement</span>
            </router-link>
            <router-link to="/admin/products" class="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl hover:shadow-md transition-shadow group">
              <div class="w-11 h-11 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <span class="material-symbols-outlined">add_box</span>
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-center">Ajouter un produit</span>
            </router-link>
          </div>
        </div>

      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">

        <!-- Revenue Chart -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-8 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
            <div>
              <h4 class="font-bold text-base sm:text-lg font-headline">Trajectoire des revenus</h4>
              <p class="text-xs sm:text-sm text-[#464554]">Croissance mensuelle vs période précédente</p>
            </div>
            <div class="flex gap-2">
              <span class="flex items-center gap-2 text-[10px] sm:text-xs font-bold px-3 py-1 bg-[#f2f3ff] rounded-full">
                <span class="w-2 h-2 rounded-full bg-indigo-600"></span> En cours
              </span>
              <span class="flex items-center gap-2 text-[10px] sm:text-xs font-bold px-3 py-1 bg-[#f2f3ff] rounded-full">
                <span class="w-2 h-2 rounded-full bg-slate-300"></span> Mois précédent
              </span>
            </div>
          </div>
          <div class="h-48 sm:h-64 flex items-end justify-between gap-3 sm:gap-4 pt-4">
            <div v-for="(bar, i) in chartBars" :key="i" class="flex-1 bg-[#f2f3ff] relative group h-full">
              <div class="absolute bottom-0 w-full bg-indigo-200 rounded-t transition-all" :style="{ height: bar.prev }"></div>
              <div class="absolute bottom-0 w-full bg-indigo-600 rounded-t transition-all group-hover:opacity-80" :style="{ height: bar.curr }"></div>
            </div>
          </div>
          <div class="flex justify-between mt-3 sm:mt-4 text-[9px] sm:text-[10px] font-bold text-[#464554] uppercase tracking-tighter">
            <span v-for="month in months" :key="month">{{ month }}</span>
          </div>
        </div>

        <!-- Member Retention -->
        <div class="bg-white rounded-2xl p-5 sm:p-8 shadow-sm">
          <h4 class="font-bold text-base sm:text-lg font-headline mb-6 sm:mb-8">Rétention des membres</h4>
          <div class="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto mb-6 sm:mb-8">
            <div class="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden" :style="{ background: `conic-gradient(#4648d4 0deg ${retentionDeg}deg, #ba1a1a ${retentionDeg}deg 360deg)` }">
              <div class="absolute inset-0 m-3 sm:m-4 bg-white rounded-full flex flex-col items-center justify-center">
                <p class="text-2xl sm:text-3xl font-black font-headline">{{ retentionRate }}%</p>
                <p class="text-[9px] sm:text-[10px] font-bold text-[#464554]">RÉTENTION</p>
              </div>
            </div>
          </div>
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-indigo-600"></span>
                <span class="text-xs sm:text-sm font-semibold">Abonnements actifs</span>
              </div>
              <span class="text-xs sm:text-sm font-bold">{{ activeSubscriptionsCount }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-600"></span>
                <span class="text-xs sm:text-sm font-semibold">Expirés/Perdus</span>
              </div>
              <span class="text-xs sm:text-sm font-bold">{{ expiredSubscriptionsCount }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Activity Feeds -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">

        <!-- Check-in Feed -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-8 shadow-sm">
          <div class="flex justify-between items-center mb-5 sm:mb-6">
            <h4 class="font-bold text-base sm:text-lg font-headline">Flux de check-ins en direct</h4>
            <span class="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 font-bold">
              <span class="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              En direct
            </span>
          </div>
          <div v-if="checkinStore.checkins.length === 0" class="text-center text-[#464554] text-sm py-8">
            Aucun check-in aujourd'hui
          </div>
          <div class="space-y-4 sm:space-y-6">
            <div v-for="checkin in recentCheckins" :key="checkin.id" class="flex items-center gap-3 sm:gap-4">
              <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                {{ checkin.client?.charAt(0) ?? '?' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold truncate">{{ checkin.client }}</p>
                <p class="text-xs text-[#464554] truncate">Abonnement : {{ checkin.subscription ?? '—' }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-xs font-bold">{{ formatTime(checkin.checkinTime) }}</p>
                <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" :class="checkin.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'">{{ checkin.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Payments -->
        <div class="bg-white rounded-2xl p-5 sm:p-8 shadow-sm">
          <div class="flex justify-between items-center mb-5 sm:mb-6">
            <h4 class="font-bold text-base sm:text-lg font-headline">Derniers paiements</h4>
            <router-link to="/admin/payments" class="text-indigo-600 text-xs font-bold hover:underline sm:hidden">Voir tout</router-link>
          </div>
          <div class="space-y-3 sm:space-y-4">
            <div v-for="payment in recentPayments" :key="payment.id" class="p-3 sm:p-4 bg-[#f2f3ff] rounded-xl">
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] sm:text-xs font-black text-indigo-600">{{ payment.reference }}</span>
                <span class="text-[10px] sm:text-xs font-bold">{{ formatCurrency(payment.amount) }}</span>
              </div>
              <p class="text-[11px] font-bold truncate">{{ payment.client }}</p>
              <p class="text-[10px] text-[#464554] mt-1 truncate">{{ formatTime(payment.date) }} • {{ payment.method }}</p>
            </div>
            <div v-if="recentPayments.length === 0" class="text-center text-sm text-[#464554] py-4">
              Aucun paiement récent
            </div>
          </div>
          <router-link to="/admin/payments" class="hidden sm:block w-full mt-5 py-2.5 border-2 border-[#f2f3ff] text-indigo-600 text-xs font-bold rounded-xl hover:bg-[#f2f3ff] transition-colors text-center">
            Voir tous les paiements
          </router-link>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white rounded-2xl p-5 sm:p-8 shadow-sm">
          <div class="flex justify-between items-center mb-5 sm:mb-6">
            <h4 class="font-bold text-base sm:text-lg font-headline">Commandes boutique</h4>
            <router-link to="/admin/orders" class="text-indigo-600 text-xs font-bold hover:underline sm:hidden">Voir tout</router-link>
          </div>
          <div class="space-y-4 sm:space-y-5">
            <div v-for="order in recentOrders" :key="order.id" class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#e2e7ff] rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-sm">inventory_2</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold truncate">Commande #{{ order.id }} — {{ order.client }}</p>
                <p class="text-[10px] font-bold uppercase" :class="{ 'text-green-600': order.status === 'paid', 'text-amber-500': order.status === 'pending', 'text-red-500': order.status === 'cancelled' }">{{ order.status }}</p>
              </div>
              <span class="material-symbols-outlined text-slate-300 text-xl">chevron_right</span>
            </div>
            <div v-if="recentOrders.length === 0" class="text-center text-sm text-[#464554] py-4">
              Aucune commande récente
            </div>
          </div>
          <router-link to="/admin/orders" class="hidden sm:block w-full mt-5 py-2.5 border-2 border-[#f2f3ff] text-indigo-600 text-xs font-bold rounded-xl hover:bg-[#f2f3ff] transition-colors text-center">
            Voir toutes les commandes
          </router-link>
        </div>

      </div>

    </template>

    <!-- FAB QR scan -->
    <router-link to="/scan" class="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50">
      <span class="material-symbols-outlined text-2xl">qr_code_scanner</span>
    </router-link>

  </div>
</template>

<script setup>
import { useCheckinStore } from '@/stores/checkin'
import { useDashboardStore } from '@/stores/dashboard'
import { useOrderStore } from '@/stores/order'
import { usePaymentStore } from '@/stores/payment'
import { useProductStore } from '@/stores/product'
import { useSubscriptionStore } from '@/stores/subscription'
import { computed, onMounted } from 'vue'

const dash = useDashboardStore()
const checkinStore = useCheckinStore()
const paymentStore = usePaymentStore()
const orderStore = useOrderStore()
const subscriptionStore = useSubscriptionStore()
const productStore = useProductStore()

onMounted(async () => {
    await dash.fetchStats()
    await checkinStore.fetchAll()
    await paymentStore.fetchAll()
    await orderStore.fetchAll()
    await subscriptionStore.fetchAll()
    await productStore.fetchAll()
})

const totalRevenue = computed(() => paymentStore.totalAmount)

const todayRevenue = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return paymentStore.payments.filter(p => p.date.startsWith(today)).reduce((sum, p) => sum + Number(p.amount), 0)
})

const activeSubscriptionsCount = computed(() => subscriptionStore.activeSubscriptions.length)

const expiredSubscriptionsCount = computed(() => subscriptionStore.expiredSubscriptions.length)
const retentionRate = computed(() => {
    const total = activeSubscriptionsCount.value + expiredSubscriptionsCount.value
    if (!total) return 0
    return Math.round((activeSubscriptionsCount.value / total) * 100)
})

const retentionDeg = computed(() => Math.round((retentionRate.value / 100) * 360))

const recentCheckins = computed(() => [...checkinStore.checkins].slice(0, 3))
const recentPayments = computed(() => [...paymentStore.payments].slice(0, 3))
const recentOrders = computed(() => [...orderStore.orders].slice(0, 3))

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency', currency: 'XOF'
    }).format(value ?? 0)
}

function formatTime(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit'
    })
}

const chartBars = [
    { prev: '40%', curr: '55%' },
    { prev: '45%', curr: '65%' },
    { prev: '50%', curr: '40%' },
    { prev: '60%', curr: '85%' },
    { prev: '70%', curr: '75%' },
    { prev: '65%', curr: '95%' },
]
const months = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin']
</script>
