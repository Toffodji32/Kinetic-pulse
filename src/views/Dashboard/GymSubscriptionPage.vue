<template>
    <div>
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Abonnement</h2>
                <p class="text-[#464554] font-medium">Choisissez la formule adaptée à votre salle</p>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
            <el-icon class="is-loading text-4xl text-indigo-600">
                <Loading />
            </el-icon>
        </div>

        <div v-else-if="!subscription" class="text-center py-20 text-gray-500">
            Impossible de charger les informations.
            <el-button type="primary" @click="load" class="ml-4">Réessayer</el-button>
        </div>

        <template v-else>

            <!-- Statut actuel -->
            <div class="mb-8">
                <div class="flex items-center justify-between p-6 rounded-xl border-2 max-w-2xl"
                    :class="statusClass">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-full flex items-center justify-center"
                            :class="statusIconBg">
                            <span class="material-symbols-outlined text-3xl"
                                :class="statusIconColor">{{ statusIcon }}</span>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-gray-800">{{ statusLabel }}</p>
                            <p class="text-sm text-gray-500">{{ statusDescription }}</p>
                        </div>
                    </div>
                    <el-tag :type="statusTagType" effect="dark" round size="large">
                        {{ statusTagText }}
                    </el-tag>
                </div>
            </div>

            <!-- Choix des formules -->
            <div v-if="subscription.status === 'trial' || subscription.status === 'expired'"
                class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">

                <!-- Basic -->
                <div class="bg-white rounded-2xl shadow-sm border-2 p-8 flex flex-col"
                    :class="selectedPlan === 'basic' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-100'">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-black text-gray-800">Basic</h3>
                        <el-tag v-if="currentPlanType === 'basic' && subscription.status === 'active'" type="success" effect="dark" round>Actuel</el-tag>
                    </div>
                    <p class="text-3xl font-black text-gray-800 mb-2">{{ formatAmount(15000) }}</p>
                    <p class="text-sm text-gray-500 mb-6">/ mois</p>
                    <ul class="space-y-3 mb-8 flex-1">
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Gestion des clients
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Accès par QR code
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Dashboard temps réel
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Abonnements et paiements
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-400">
                            <span class="material-symbols-outlined text-base">cancel</span>
                            Boutique en ligne
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-400">
                            <span class="material-symbols-outlined text-base">cancel</span>
                            Suivi des commandes
                        </li>
                    </ul>
                    <button v-if="subscription.status !== 'active' || currentPlanType !== 'basic'"
                        @click="selectPlan('basic')"
                        class="w-full h-12 rounded-xl font-bold text-white transition-all"
                        :class="selectedPlan === 'basic'
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-gray-400 hover:bg-gray-500'">
                        {{ selectedPlan === 'basic' ? 'Sélectionné' : 'Choisir Basic' }}
                    </button>
                    <p v-else class="text-center text-green-600 font-semibold text-sm">
                        <span class="material-symbols-outlined align-middle text-base">check_circle</span>
                        Formule active
                    </p>
                </div>

                <!-- Premium -->
                <div class="bg-white rounded-2xl shadow-sm border-2 p-8 flex flex-col relative"
                    :class="selectedPlan === 'premium' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-100'">
                    <div class="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                        Recommandé
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-black text-gray-800">Premium</h3>
                        <el-tag v-if="currentPlanType === 'premium' && subscription.status === 'active'" type="success" effect="dark" round>Actuel</el-tag>
                    </div>
                    <p class="text-3xl font-black text-gray-800 mb-2">{{ formatAmount(25000) }}</p>
                    <p class="text-sm text-gray-500 mb-6">/ mois</p>
                    <ul class="space-y-3 mb-8 flex-1">
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Tout le plan Basic
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Boutique en ligne dédiée
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Gestion des produits et stocks
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Commandes et livraisons
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-600">
                            <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                            Vente aux membres et externes
                        </li>
                    </ul>
                    <button v-if="subscription.status !== 'active' || currentPlanType !== 'premium'"
                        @click="selectPlan('premium')"
                        class="w-full h-12 rounded-xl font-bold text-white transition-all"
                        :class="selectedPlan === 'premium'
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-gray-400 hover:bg-gray-500'">
                        {{ selectedPlan === 'premium' ? 'Sélectionné' : 'Choisir Premium' }}
                    </button>
                    <p v-else class="text-center text-green-600 font-semibold text-sm">
                        <span class="material-symbols-outlined align-middle text-base">check_circle</span>
                        Formule active
                    </p>
                </div>

            </div>

            <!-- Résumé si déjà actif -->
            <div v-else-if="subscription.status === 'active'" class="max-w-2xl">
                <div class="bg-white rounded-2xl shadow-sm p-8">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Récapitulatif</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-50 rounded-xl p-4 text-center">
                            <p class="text-2xl font-black text-indigo-600">{{ formatAmount(subscription.amount) }}</p>
                            <p class="text-xs text-gray-500 mt-1">Prix / mois</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4 text-center">
                            <p class="text-2xl font-black text-indigo-600">{{ currentPlanLabel }}</p>
                            <p class="text-xs text-gray-500 mt-1">Formule</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4 text-center">
                            <p class="text-2xl font-black text-indigo-600">{{ subscription.daysLeft ?? '-' }}</p>
                            <p class="text-xs text-gray-500 mt-1">Jours restants</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4 text-center">
                            <p class="text-2xl font-black text-indigo-600">{{ formatDate(subscription.endsAt) }}</p>
                            <p class="text-xs text-gray-500 mt-1">Expire le</p>
                        </div>
                    </div>

                    <!-- Upgrade vers Premium si actuellement Basic -->
                    <div v-if="currentPlanType === 'basic'" class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-amber-600">upgrade</span>
                            <p class="text-sm text-amber-700 font-medium">Passez à Premium pour activer la boutique</p>
                        </div>
                        <button @click="selectedPlan = 'premium'" class="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 transition-all">
                            Passer à Premium
                        </button>
                    </div>
                </div>
            </div>

            <!-- Bouton Paiement -->
            <div v-if="selectedPlan && subscription.status !== 'active'" class="mt-8 max-w-md">
                <div class="bg-white rounded-2xl shadow-sm p-6">
                    <p class="text-sm text-gray-500 mb-4">
                        Vous avez sélectionné la formule <strong class="text-gray-800">{{ selectedPlan === 'basic' ? 'Basic' : 'Premium' }}</strong>
                        à <strong class="text-indigo-600">{{ formatAmount(selectedPlan === 'basic' ? 15000 : 25000) }}</strong>/mois.
                    </p>
                    <button id="fedapay-sub-btn"
                        @click="launchFedaPay" :disabled="paying"
                        class="w-full h-12 rounded-xl font-bold text-white transition-all"
                        :class="paying ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'">
                        {{ paying ? 'Paiement en cours...' : `Payer ${formatAmount(selectedPlan === 'basic' ? 15000 : 25000)}` }}
                    </button>
                </div>
            </div>
        </template>

        <button id="fedapay-btn" style="display: none;"></button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGymAuthStore } from '@/stores/gymAuth'
import { Loading } from '@element-plus/icons-vue'
import Swal from 'sweetalert2'

const gymAuthStore = useGymAuthStore()
const loading = ref(true)
const paying = ref(false)
const selectedPlan = ref(null)

const subscription = computed(() => gymAuthStore.subscription)
const currentPlanType = computed(() => subscription.value?.planType || 'premium')

const currentPlanLabel = computed(() => {
    return currentPlanType.value === 'premium' ? 'Premium' : 'Basic'
})

const statusLabel = computed(() => {
    const s = subscription.value?.status
    if (s === 'active') return 'Premium - ' + (currentPlanType.value === 'premium' ? 'Boutique incluse' : 'Sans boutique')
    if (s === 'trial') return 'Essai gratuit (Premium)'
    if (s === 'expired') return 'Expiré'
    if (s === 'cancelled') return 'Annulé'
    return 'Inconnu'
})

const statusDescription = computed(() => {
    const s = subscription.value
    if (!s) return ''
    if (s.status === 'active') return `Valable jusqu'au ${formatDate(s.endsAt)}`
    if (s.status === 'trial') return `Essai jusqu'au ${formatDate(s.trialEndsAt)} — toutes les fonctionnalités activées`
    if (s.status === 'expired') return 'Souscrivez à une formule pour continuer'
    if (s.status === 'cancelled') return 'Abonnement annulé'
    return ''
})

const statusIcon = computed(() => {
    const s = subscription.value?.status
    if (s === 'active') return 'verified'
    if (s === 'trial') return 'timer'
    if (s === 'expired') return 'error'
    if (s === 'cancelled') return 'cancel'
    return 'help'
})

const statusClass = computed(() => {
    const s = subscription.value?.status
    if (s === 'active') return 'border-green-200 bg-green-50'
    if (s === 'trial') return 'border-amber-200 bg-amber-50'
    if (s === 'expired') return 'border-red-200 bg-red-50'
    if (s === 'cancelled') return 'border-gray-200 bg-gray-50'
    return 'border-gray-200'
})

const statusIconBg = computed(() => {
    const s = subscription.value?.status
    if (s === 'active') return 'bg-green-100'
    if (s === 'trial') return 'bg-amber-100'
    if (s === 'expired') return 'bg-red-100'
    if (s === 'cancelled') return 'bg-gray-100'
    return 'bg-gray-100'
})

const statusIconColor = computed(() => {
    const s = subscription.value?.status
    if (s === 'active') return 'text-green-600'
    if (s === 'trial') return 'text-amber-600'
    if (s === 'expired') return 'text-red-600'
    if (s === 'cancelled') return 'text-gray-600'
    return 'text-gray-600'
})

const statusTagType = computed(() => {
    const s = subscription.value?.status
    if (s === 'active') return 'success'
    if (s === 'trial') return 'warning'
    if (s === 'expired') return 'danger'
    if (s === 'cancelled') return 'info'
    return 'info'
})

const statusTagText = computed(() => {
    const s = subscription.value?.status
    if (s === 'active') return 'Actif'
    if (s === 'trial') return 'Essai'
    if (s === 'expired') return 'Expiré'
    if (s === 'cancelled') return 'Annulé'
    return 'Inconnu'
})

function selectPlan(plan) {
    selectedPlan.value = plan
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
    })
}

function formatAmount(amount) {
    if (!amount) return '-'
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency', currency: 'XOF', maximumFractionDigits: 0,
    }).format(amount)
}

function launchFedaPay() {
    if (!selectedPlan.value) return
    const amount = selectedPlan.value === 'premium' ? 25000 : 15000
    paying.value = true
    const user = gymAuthStore.user
    const nameParts = (user?.name || 'Propriétaire').split(' ')
    const firstname = nameParts[0] || 'Propriétaire'
    const lastname = nameParts.slice(1).join(' ') || ''

    FedaPay.init('#fedapay-btn', {
        public_key: 'pk_sandbox_hJix3Vgf3L9UNj3Fs4EObNRo',
        transaction: {
            amount: Math.round(amount),
            description: selectedPlan.value === 'premium'
                ? 'Abonnement Premium Kinetic Pulse - 1 mois'
                : 'Abonnement Basic Kinetic Pulse - 1 mois',
            currency: { iso: 'XOF' },
        },
        customer: {
            email: user?.email || 'proprietaire@example.com',
            firstname: firstname,
            lastname: lastname,
        },
        onComplete: async (response) => {
            const transaction = response.transaction

            if (transaction.status !== 'approved') {
                paying.value = false
                Swal.fire({
                    icon: 'warning',
                    title: 'Paiement non complété',
                    text: `Statut: ${transaction.status}.`,
                    confirmButtonColor: '#4f46e5',
                })
                return
            }

            try {
                await gymAuthStore.paySubscription(transaction.id, selectedPlan.value)

                await Swal.fire({
                    icon: 'success',
                    title: selectedPlan.value === 'premium' ? 'Abonnement Premium activé !' : 'Abonnement Basic activé !',
                    html: `<p>Votre formule <strong>${selectedPlan.value === 'premium' ? 'Premium' : 'Basic'}</strong> est maintenant active.</p>`,
                    confirmButtonColor: '#4f46e5',
                })
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Paiement reçu mais erreur de confirmation. Contactez-nous.',
                    confirmButtonColor: '#4f46e5',
                })
            } finally {
                paying.value = false
            }
        },
    })

    document.querySelector('#fedapay-btn').click()
}

async function load() {
    loading.value = true
    try {
        await gymAuthStore.fetchSubscription()
    } catch {
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>
