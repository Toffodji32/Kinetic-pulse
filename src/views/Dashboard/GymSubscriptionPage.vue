<template>
    <div>
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Abonnement</h2>
                <p class="text-[#464554] font-medium">Gerez votre formule SaaS</p>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
            <el-icon class="is-loading text-4xl text-indigo-600">
                <Loading />
            </el-icon>
        </div>

        <div v-else-if="!subscription" class="text-center py-20 text-gray-500">
            Impossible de charger les informations.
            <el-button type="primary" @click="load" class="ml-4">Reessayer</el-button>
        </div>

        <template v-else>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-sm p-8">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">Formule actuelle</h3>

                        <div class="flex items-center justify-between p-6 rounded-xl border-2"
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

                        <div class="mt-6 grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 rounded-xl p-4 text-center">
                                <p class="text-2xl font-black text-indigo-600">{{ subscription.daysLeft ?? '-' }}</p>
                                <p class="text-xs text-gray-500 mt-1">Jours restants</p>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 text-center">
                                <p class="text-2xl font-black text-indigo-600">{{ formatAmount(subscription.amount) }}</p>
                                <p class="text-xs text-gray-500 mt-1">Prix / mois</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="bg-white rounded-2xl shadow-sm p-8">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">Passez a la formule Premium</h3>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-start gap-3 text-sm text-gray-600">
                                <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                                Gestion illimitee des clients
                            </li>
                            <li class="flex items-start gap-3 text-sm text-gray-600">
                                <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                                QR codes illimites
                            </li>
                            <li class="flex items-start gap-3 text-sm text-gray-600">
                                <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                                Envoi d emails automatique
                            </li>
                            <li class="flex items-start gap-3 text-sm text-gray-600">
                                <span class="material-symbols-outlined text-indigo-600 text-base">check_circle</span>
                                Support prioritaire
                            </li>
                        </ul>

                        <div class="text-center mb-6">
                            <p class="text-3xl font-black text-gray-800">{{ formatAmount(subscription.amount) }}</p>
                            <p class="text-sm text-gray-500">/ mois</p>
                        </div>

                        <button v-if="subscription.status !== 'active'" id="fedapay-sub-btn"
                            @click="launchFedaPay" :disabled="paying"
                            class="w-full h-12 rounded-xl font-bold text-white transition-all"
                            :class="paying ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'">
                            {{ paying ? 'Paiement en cours...' : 'Payer maintenant' }}
                        </button>

                        <p v-else class="text-center text-green-600 font-semibold text-sm">
                            <span class="material-symbols-outlined align-middle text-base">check_circle</span>
                            Abonnement actif
                        </p>
                    </div>
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

const subscription = computed(() => gymAuthStore.subscription)

const statusLabel = computed(() => {
    const s = subscription.value?.status
    if (s === 'active') return 'Premium'
    if (s === 'trial') return 'Essai gratuit'
    if (s === 'expired') return 'Expire'
    if (s === 'cancelled') return 'Annule'
    return 'Inconnu'
})

const statusDescription = computed(() => {
    const s = subscription.value
    if (!s) return ''
    if (s.status === 'active') return `Valable jusqu au ${formatDate(s.endsAt)}`
    if (s.status === 'trial') return `Essai jusqu au ${formatDate(s.trialEndsAt)}`
    if (s.status === 'expired') return 'Votre abonnement a expire'
    if (s.status === 'cancelled') return 'Abonnement annule'
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
    if (s === 'expired') return 'Expire'
    if (s === 'cancelled') return 'Annule'
    return 'Inconnu'
})

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
    paying.value = true
    const user = gymAuthStore.user
    const nameParts = (user?.name || 'Proprietaire').split(' ')
    const firstname = nameParts[0] || 'Proprietaire'
    const lastname = nameParts.slice(1).join(' ') || ''

    FedaPay.init('#fedapay-btn', {
        public_key: 'pk_sandbox_hJix3Vgf3L9UNj3Fs4EObNRo',
        transaction: {
            amount: Math.round(subscription.value?.amount || 15000),
            description: 'Abonnement Kinetic Pulse - 1 mois',
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
                    title: 'Paiement non complete',
                    text: `Statut: ${transaction.status}.`,
                    confirmButtonColor: '#4f46e5',
                })
                return
            }

            try {
                await gymAuthStore.paySubscription(transaction.id)

                await Swal.fire({
                    icon: 'success',
                    title: 'Abonnement active !',
                    html: `<p>Votre abonnement est maintenant <strong>actif</strong>.</p>`,
                    confirmButtonColor: '#4f46e5',
                })
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Paiement recu mais erreur de confirmation. Contactez-nous.',
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
        // store already sets subscription to null
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>
