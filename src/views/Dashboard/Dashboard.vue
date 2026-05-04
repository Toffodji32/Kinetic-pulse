<template>
    <div class="bg-[#faf8ff] min-h-screen">

        <!-- Header Section -->
        <div class="mb-10 flex justify-between items-end">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Executive Summary</h2>
                <p class="text-[#464554] font-medium">Detailed performance metrics for your fitness empire.</p>
            </div>
            <div class="flex gap-3">
                <button
                    class="flex items-center gap-2 px-5 py-2.5 bg-[#e2e7ff] text-[#131b2e] font-semibold rounded-lg hover:bg-[#dae2fd] transition-colors">
                    <span class="material-symbols-outlined text-[20px]">calendar_today</span>
                    Last 30 Days
                </button>
                <button @click="dash.fetchStats()"
                    class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-600/20">
                    <span class="material-symbols-outlined text-[20px]">refresh</span>
                    Actualiser
                </button>
            </div>
        </div>

        <!-- Loading global -->
        <div v-if="dash.loading" class="flex items-center justify-center py-20 text-indigo-600 font-bold">
            <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Chargement des stats...
        </div>

        <!-- Erreur globale -->
        <div v-else-if="dash.error" class="bg-red-50 text-red-600 px-6 py-4 rounded-xl mb-6 font-semibold">
            {{ dash.error }}
        </div>

        <template v-else>

            <!-- Alertes Stock -->
            <div v-if="dash.outOfStock > 0" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                <div class="flex items-center">
                    <span class="material-symbols-outlined text-red-500 mr-2">warning</span>
                    <p class="text-red-700 font-semibold">Alerte Stock</p>
                </div>
                <p class="text-red-600 mt-1">
                    {{ dash.outOfStock }} produit(s) en rupture de stock.
                    <router-link to="/admin/products" class="underline hover:text-red-800">Gérer le stock</router-link>
                </p>
            </div>

            <!-- KPI Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <!-- Revenue Card — totalRevenue + todayRevenue -->
                <div
                    class="col-span-1 lg:col-span-2 bg-indigo-600 rounded-xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-600/10">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-4">
                            <span class="p-2 bg-white/20 rounded-lg material-symbols-outlined">payments</span>
                        </div>
                        <p class="text-white/70 font-semibold mb-1">Total Revenue</p>
                        <!-- dash.totalRevenue vient du getter du store -->
                        <h3 class="text-4xl font-black font-headline mb-4">
                            {{ formatCurrency(totalRevenue) }}
                        </h3>
                        <div class="flex gap-4 text-sm font-medium">
                            <div class="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                                <span class="opacity-70">Today:</span>
                                {{ formatCurrency(todayRevenue) }}
                            </div>
                            <div class="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                                <span class="opacity-70">Orders:</span>
                                {{ dash.stats?.orders?.total ?? 0 }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Subscriptions Card — active + expired -->
                <div class="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div class="p-2 bg-[#e1e0ff] text-indigo-600 rounded-lg">
                            <span class="material-symbols-outlined">card_membership</span>
                        </div>
                        <span class="text-[#464554] font-bold text-xs uppercase tracking-wider">Subscriptions</span>
                    </div>
                    <div>
                        <!-- total = actifs + expirés -->
                        <h3 class="text-3xl font-black font-headline mt-4">
                            {{ activeSubscriptionsCount + expiredSubscriptionsCount }}
                        </h3>
                        <div class="mt-4 flex flex-col gap-2">
                            <!-- barre de progression active/total -->
                            <div class="w-full bg-[#f2f3ff] h-2 rounded-full overflow-hidden">
                                <div class="bg-indigo-600 h-full rounded-full transition-all"
                                    :style="{ width: retentionRate + '%' }"></div>
                            </div>
                            <div class="flex justify-between text-xs font-semibold">
                                <span class="text-green-600">Active: {{ activeSubscriptionsCount }}</span>
                                <span class="text-red-600">Expired: {{ expiredSubscriptionsCount }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Clients Card -->
                <div class="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div class="p-2 bg-green-100 text-green-700 rounded-lg">
                            <span class="material-symbols-outlined">group</span>
                        </div>
                        <span class="text-[#464554] font-bold text-xs uppercase tracking-wider">Total Clients</span>
                    </div>
                    <div>
                        <h3 class="text-3xl font-black font-headline mt-4">
                            {{ dash.totalClients }}
                        </h3>
                        <p class="text-[#464554] text-sm font-medium mt-1">
                            {{ dash.stats?.users?.total ?? 0 }} utilisateurs système
                        </p>
                    </div>
                </div>

                <!-- Check-ins aujourd'hui -->
                <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-indigo-500">
                    <p class="text-[#464554] text-xs font-bold uppercase tracking-widest mb-1">Today Check-ins</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-3xl font-black font-headline">
                            {{ dash.todayCheckins }}
                        </h3>
                        <span class="text-green-600 font-bold text-sm">entrées</span>
                    </div>
                    <div class="mt-4 space-y-3">
                        <div class="flex items-center justify-between text-xs font-medium text-[#464554]">
                            <span>Abonnements actifs</span>
                            <span>{{ activeSubscriptionsCount }}</span>
                        </div>
                        <div class="flex items-center justify-between text-xs font-medium text-[#464554]">
                            <span>Abonnements expirés</span>
                            <span class="text-red-500">{{ expiredSubscriptionsCount }}</span>
                        </div>
                        <div class="flex items-center justify-between text-xs font-medium text-indigo-600 font-bold">
                            <span>Taux de présence</span>
                            <span>
                                {{
                                    activeSubscriptionsCount > 0
                                        ? Math.round((dash.todayCheckins / activeSubscriptionsCount) * 100)
                                        : 0
                                }}%
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Orders & Products -->
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <span
                            class="p-2 bg-[#f2f3ff] text-[#131b2e] rounded-lg material-symbols-outlined">shopping_bag</span>
                        <p class="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">COMMERCE
                        </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-[10px] text-[#464554] font-bold uppercase">Orders</p>
                            <p class="text-xl font-black font-headline">{{ dash.stats?.orders?.total ?? 0 }}</p>
                        </div>
                        <div>
                            <p class="text-[10px] text-[#464554] font-bold uppercase">Products</p>
                            <p class="text-xl font-black font-headline">{{ dash.stats?.products?.total ?? 0 }}</p>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-slate-100">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-xs text-red-600 font-bold flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">warning</span>
                                {{ productStore.outOfStock.length }} Out of stock
                            </span>
                            <router-link to="/admin/products" class="text-indigo-600 text-xs font-bold hover:underline">
                                Manage Stock
                            </router-link>
                        </div>
                        <div v-if="productStore.outOfStock.length > 0" class="space-y-1">
                            <div v-for="product in productStore.outOfStock.slice(0, 3)" :key="product.id"
                                class="text-xs text-red-600">
                                • {{ product.name }}
                            </div>
                            <div v-if="productStore.outOfStock.length > 3" class="text-xs text-indigo-600 font-bold">
                                +{{ productStore.outOfStock.length - 3 }} autres...
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions — avec router-link -->
                <div class="col-span-1 lg:col-span-2 bg-[#f2f3ff] rounded-xl p-6 shadow-sm">
                    <h4 class="font-bold text-sm mb-4">Quick Management Actions</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <router-link to="/admin/clients"
                            class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow group">
                            <div
                                class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <span class="material-symbols-outlined">person_add</span>
                            </div>
                            <span class="text-xs font-bold">Add Client</span>
                        </router-link>
                        <router-link to="/admin/subscriptions"
                            class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow group">
                            <div
                                class="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <span class="material-symbols-outlined">verified</span>
                            </div>
                            <span class="text-xs font-bold">Subscription</span>
                        </router-link>
                        <router-link to="/admin/payments"
                            class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow group">
                            <div
                                class="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <span class="material-symbols-outlined">add_card</span>
                            </div>
                            <span class="text-xs font-bold">Register Pay</span>
                        </router-link>
                        <router-link to="/admin/products"
                            class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-shadow group">
                            <div
                                class="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                <span class="material-symbols-outlined">add_box</span>
                            </div>
                            <span class="text-xs font-bold">Add Product</span>
                        </router-link>
                    </div>
                </div>

            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                <!-- Revenue Chart — barres statiques car pas de données historiques dans l'API -->
                <div class="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h4 class="font-bold text-lg font-headline">Revenue Trajectory</h4>
                            <p class="text-sm text-[#464554]">Monthly growth vs previous period</p>
                        </div>
                        <div class="flex gap-2">
                            <span class="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-[#f2f3ff] rounded-full">
                                <span class="w-2 h-2 rounded-full bg-indigo-600"></span> Current
                            </span>
                            <span class="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-[#f2f3ff] rounded-full">
                                <span class="w-2 h-2 rounded-full bg-slate-300"></span> Last Month
                            </span>
                        </div>
                    </div>
                    <div class="h-64 flex items-end justify-between gap-4 pt-4">
                        <div v-for="(bar, i) in chartBars" :key="i" class="flex-1 bg-[#f2f3ff] relative group h-full">
                            <div class="absolute bottom-0 w-full bg-indigo-200 rounded-t transition-all"
                                :style="{ height: bar.prev }"></div>
                            <div class="absolute bottom-0 w-full bg-indigo-600 rounded-t transition-all group-hover:opacity-80"
                                :style="{ height: bar.curr }"></div>
                        </div>
                    </div>
                    <div
                        class="flex justify-between mt-4 text-[10px] font-bold text-[#464554] uppercase tracking-tighter">
                        <span v-for="month in months" :key="month">{{ month }}</span>
                    </div>
                </div>

                <!-- Member Retention — calculé depuis active + expired -->
                <div class="bg-white rounded-xl p-8 shadow-sm">
                    <h4 class="font-bold text-lg font-headline mb-8">Member Retention</h4>
                    <div class="relative w-48 h-48 mx-auto mb-8">
                        <div class="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                            :style="{ background: `conic-gradient(#4648d4 0deg ${retentionDeg}deg, #ba1a1a ${retentionDeg}deg 360deg)` }">
                            <div
                                class="absolute inset-0 m-4 bg-white rounded-full flex flex-col items-center justify-center">
                                <p class="text-3xl font-black font-headline">{{ retentionRate }}%</p>
                                <p class="text-[10px] font-bold text-[#464554]">RETENTION</p>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-indigo-600"></span>
                                <span class="text-sm font-semibold">Active Subscriptions</span>
                            </div>
                            <span class="text-sm font-bold">{{ activeSubscriptionsCount }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-red-600"></span>
                                <span class="text-sm font-semibold">Expired/Churned</span>
                            </div>
                            <span class="text-sm font-bold">{{ expiredSubscriptionsCount }}</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Activity Feeds -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

                <!-- Check-in Feed — données réelles via checkinStore -->
                <div class="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <h4 class="font-bold text-lg font-headline">Live Check-in Feed</h4>
                        <span class="flex items-center gap-1 text-xs text-green-600 font-bold">
                            <span class="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                            Live Now
                        </span>
                    </div>
                    <div v-if="checkinStore.checkins.length === 0" class="text-center text-[#464554] text-sm py-8">
                        Aucun check-in aujourd'hui
                    </div>
                    <div class="space-y-6">
                        <div v-for="checkin in recentCheckins" :key="checkin.id" class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                {{ checkin.client?.charAt(0) ?? '?' }}
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-bold">{{ checkin.client }}</p>
                                <p class="text-xs text-[#464554]">Membership: {{ checkin.subscription ?? '—' }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs font-bold">{{ formatTime(checkin.checkinTime) }}</p>
                                <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                    :class="checkin.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'">
                                    {{ checkin.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Payments — données réelles via paymentStore -->
                <div class="bg-white rounded-xl p-8 shadow-sm">
                    <h4 class="font-bold text-lg font-headline mb-6">Recent Payments</h4>
                    <div class="space-y-4">
                        <div v-for="payment in recentPayments" :key="payment.id" class="p-4 bg-[#f2f3ff] rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-xs font-black text-indigo-600">{{ payment.reference }}</span>
                                <span class="text-xs font-bold">{{ formatCurrency(payment.amount) }}</span>
                            </div>
                            <p class="text-[11px] font-bold">{{ payment.client }}</p>
                            <p class="text-[10px] text-[#464554] mt-1">
                                {{ formatTime(payment.date) }} • {{ payment.method }}
                            </p>
                        </div>
                        <div v-if="recentPayments.length === 0" class="text-center text-sm text-[#464554] py-4">
                            Aucun paiement récent
                        </div>
                    </div>
                </div>

                <!-- Recent Orders — données réelles via orderStore -->
                <div class="bg-white rounded-xl p-8 shadow-sm">
                    <h4 class="font-bold text-lg font-headline mb-6">E-com Orders</h4>
                    <div class="space-y-5">
                        <div v-for="order in recentOrders" :key="order.id" class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-[#e2e7ff] rounded flex items-center justify-center">
                                <span class="material-symbols-outlined text-sm">inventory_2</span>
                            </div>
                            <div class="flex-1">
                                <p class="text-xs font-bold truncate">
                                    Order #{{ order.id }} — {{ order.client }}
                                </p>
                                <p class="text-[10px] font-bold uppercase" :class="{
                                    'text-green-600': order.status === 'paid',
                                    'text-amber-500': order.status === 'pending',
                                    'text-red-500': order.status === 'cancelled',
                                }">
                                    {{ order.status }}
                                </p>
                            </div>
                            <span class="material-symbols-outlined text-slate-300">chevron_right</span>
                        </div>
                        <div v-if="recentOrders.length === 0" class="text-center text-sm text-[#464554] py-4">
                            Aucune commande récente
                        </div>
                    </div>
                    <router-link to="/admin/orders"
                        class="w-full mt-6 py-2.5 border-2 border-[#f2f3ff] text-indigo-600 text-xs font-bold rounded-lg hover:bg-[#f2f3ff] transition-colors block text-center">
                        View All Orders
                    </router-link>
                </div>

            </div>

        </template>

        <!-- FAB → scan QR -->
        <router-link to="/scan"
            class="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
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

// ── Chargement au montage ────────────────────────
onMounted(async () => {
    await dash.fetchStats()
    await checkinStore.fetchAll()
    await paymentStore.fetchAll()
    await orderStore.fetchAll()
    await subscriptionStore.fetchAll()
    await productStore.fetchAll()
})

// ── Valeurs corrigées à partir des stores ────────
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

// conic-gradient en degrés (360 = 100%)
const retentionDeg = computed(() => Math.round((retentionRate.value / 100) * 360))

// ── Slices "recent" pour les feeds ──────────────
// on prend les 3 derniers de chaque liste
const recentCheckins = computed(() => [...checkinStore.checkins].slice(0, 3))
const recentPayments = computed(() => [...paymentStore.payments].slice(0, 3))
const recentOrders = computed(() => [...orderStore.orders].slice(0, 3))

// ── Formatters ───────────────────────────────────
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

// ── Chart (statique — pas de données historiques dans l'API) ──
const chartBars = [
    { prev: '40%', curr: '55%' },
    { prev: '45%', curr: '65%' },
    { prev: '50%', curr: '40%' },
    { prev: '60%', curr: '85%' },
    { prev: '70%', curr: '75%' },
    { prev: '65%', curr: '95%' },
]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
</script>