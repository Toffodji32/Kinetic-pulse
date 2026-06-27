<template>
    <div class="max-w-4xl mx-auto px-4 py-10">

        <h1 class="text-3xl font-black text-gray-800 mb-8">Finaliser la commande</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Formulaire -->
            <div class="lg:col-span-2">
                <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">

                    <!-- Mode de livraison -->
                    <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <h2 class="font-black text-gray-800 mb-4">Mode de livraison</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="border-2 rounded-xl p-4 cursor-pointer transition-all" :class="form.delivery_type === 'retrait'
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'" @click="form.delivery_type = 'retrait'">
                                <el-icon class="text-2xl text-indigo-600 mb-2">
                                    <Location />
                                </el-icon>
                                <p class="font-bold text-gray-800">Retrait en salle</p>
                                <p class="text-xs text-gray-500 mt-1">Gratuit — disponible sous 24h</p>
                            </div>

                            <div class="border-2 rounded-xl p-4 cursor-pointer transition-all" :class="form.delivery_type === 'livraison'
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'" @click="form.delivery_type = 'livraison'">
                                <el-icon class="text-2xl text-indigo-600 mb-2">
                                    <Van />
                                </el-icon>
                                <p class="font-bold text-gray-800">Livraison à domicile</p>
                                <p class="text-xs text-gray-500 mt-1">{{ formatCurrency(DELIVERY_FEE) }} — 2 à 5 jours
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Adresse -->
                    <Transition name="fade">
                        <div v-if="form.delivery_type === 'livraison'" class="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <h2 class="font-black text-gray-800 mb-4">Adresse de livraison</h2>
                            <el-form-item label="Adresse complète" prop="delivery_address">
                                <el-input v-model="form.delivery_address" type="textarea" :rows="3"
                                    placeholder="12 rue des Sports, Cotonou" />
                            </el-form-item>
                        </div>
                    </Transition>

                    <!-- Infos contact -->
                    <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <h2 class="font-black text-gray-800 mb-4">Informations de contact</h2>
                        <div class="bg-indigo-50 rounded-xl p-4 flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                {{ currentUser?.name?.charAt(0) }}
                            </div>
                            <div>
                                <p class="font-bold text-gray-800">{{ currentUser?.name }}</p>
                                <p class="text-sm text-gray-500">{{ currentUser?.email }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Paiement -->
                    <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <h2 class="font-black text-gray-800 mb-2">Paiement</h2>
                        <p class="text-sm text-gray-500 mb-4">
                            Votre paiement est sécurisé via FedaPay.
                            La commande sera confirmée après validation du paiement.
                        </p>
                        <div class="grid grid-cols-3 gap-3">
                            <div
                                class="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-1">
                                <span class="text-xl">💵</span>
                                <span class="text-xs font-bold text-gray-600">Espèces</span>
                            </div>
                            <div
                                class="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-1">
                                <span class="text-xl">💳</span>
                                <span class="text-xs font-bold text-gray-600">Carte</span>
                            </div>
                            <div
                                class="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-1">
                                <span class="text-xl">📱</span>
                                <span class="text-xs font-bold text-gray-600">Mobile Money</span>
                            </div>
                        </div>
                    </div>

                </el-form>
            </div>

            <!-- Récapitulatif -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                    <h2 class="font-black text-gray-800 text-lg mb-4">Votre commande</h2>

                    <div class="space-y-3 mb-6">
                        <div v-for="item in cartStore.items" :key="item.product.id"
                            class="flex justify-between items-center text-sm">
                            <div class="flex items-center gap-2">
                                <span
                                    class="bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {{ item.quantity }}
                                </span>
                                <span class="text-gray-700">{{ item.product.name }}</span>
                            </div>
                            <span class="font-semibold text-gray-800">
                                {{ formatCurrency(item.price * item.quantity) }}
                            </span>
                        </div>
                    </div>

                    <div class="border-t pt-4 space-y-2 mb-6">
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>Sous-total</span>
                            <span>{{ formatCurrency(cartStore.total) }}</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>Livraison</span>
                            <span :class="form.delivery_type === 'livraison' ? 'text-gray-800' : 'text-green-600'">
                                {{ form.delivery_type === 'livraison' ? formatCurrency(DELIVERY_FEE) : 'Gratuit' }}
                            </span>
                        </div>
                        <div class="flex justify-between font-black text-gray-800 text-lg pt-2 border-t">
                            <span>Total</span>
                            <span class="text-indigo-600">{{ formatCurrency(orderTotal) }}</span>
                        </div>
                    </div>

                    <!-- Bouton checkout → déclenche FedaPay -->
                    <el-button type="primary" size="large" class="w-full" :loading="loading"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
                        @click="handleOrder">
                        <span v-if="!loading">Payer {{ formatCurrency(orderTotal) }}</span>
                        <span v-else>Traitement...</span>
                    </el-button>

                    <p class="text-xs text-gray-400 text-center mt-3">
                        Paiement sécurisé via FedaPay
                    </p>
                </div>
            </div>

        </div>

        <!-- Bouton FedaPay invisible — déclenché programmatiquement -->
        <button id="fedapay-btn" style="display: none;"></button>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useShopStore } from '@/stores/shop'
import { useAuthStore } from '@/stores/auth'
import { useGymAuthStore } from '@/stores/gymAuth'
import Swal from 'sweetalert2'
import { Location, Van } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const gymSlug = computed(() => route.params.gymSlug || '')
const cartStore = useCartStore()
const shopStore = useShopStore()
const authStore = useAuthStore()
const gymAuthStore = useGymAuthStore()

const currentUser = computed(() => authStore.user || gymAuthStore.user)

// ── Frais de livraison en FCFA ────────────────────
const DELIVERY_FEE = 1500

const formRef = ref(null)
const loading = ref(false)

const form = ref({
    delivery_type: 'retrait',
    delivery_address: '',
})

const rules = {
    delivery_address: [
        {
            validator: (rule, value, callback) => {
                if (form.value.delivery_type === 'livraison' && !value.trim()) {
                    callback(new Error('Adresse de livraison requise'))
                } else {
                    callback()
                }
            },
            trigger: 'blur',
        },
    ],
}

// ── Total en FCFA ─────────────────────────────────
const orderTotal = computed(() =>
    cartStore.total + (form.value.delivery_type === 'livraison' ? DELIVERY_FEE : 0)
)

// ── Étape 1 : validations avant paiement ─────────
async function handleOrder() {
    if (cartStore.isEmpty) {
        Swal.fire({
            icon: 'warning', title: 'Panier vide',
            text: 'Ajoutez des produits avant de commander.',
            confirmButtonColor: '#4f46e5',
        })
        return
    }

    if (form.value.delivery_type === 'livraison' && !form.value.delivery_address.trim()) {
        Swal.fire({
            icon: 'warning', title: 'Adresse requise',
            text: 'Veuillez saisir votre adresse de livraison.',
            confirmButtonColor: '#4f46e5',
        })
        return
    }

    // tout est ok → on lance FedaPay
    launchFedaPay()
}

// ── Étape 2 : lancer le widget FedaPay ───────────
function launchFedaPay() {
    loading.value = true

    const user = currentUser.value
    const totalAmount = Math.round(orderTotal.value)

    const nameParts = (user?.name || 'Client').split(' ')
    const firstname = nameParts[0] || 'Client'
    const lastname = nameParts.slice(1).join(' ') || ''

    // @ts-ignore — FedaPay est chargé via CDN
    FedaPay.init('#fedapay-btn', {
        public_key: 'pk_sandbox_hJix3Vgf3L9UNj3Fs4EObNRo', // ← remplace par ta vraie clé
        transaction: {
            amount: totalAmount,
            description: `Commande Kinetic Gym — ${cartStore.count} article(s)`,
            currency: { iso: 'XOF' }, // FCFA
        },
        customer: {
            email: user?.email || 'client@example.com',
            firstname: firstname,
            lastname: lastname,
        },

        // ── Paiement réussi ──────────────────────────
        onComplete: async (response) => {
            const transaction = response.transaction

            // vérifier que le paiement est bien approuvé
            if (transaction.status !== 'approved') {
                loading.value = false
                Swal.fire({
                    icon: 'warning',
                    title: 'Paiement non complété',
                    text: `Statut : ${transaction.status}. Votre commande n'a pas été enregistrée.`,
                    confirmButtonColor: '#4f46e5',
                })
                return
            }

            // ── Enregistrer la commande côté Symfony ────
            try {
                const result = await shopStore.createOrder({
                    items: cartStore.items.map(i => ({
                        product_id: i.product.id,
                        quantity: i.quantity,
                    })),
                    delivery_type: form.value.delivery_type,
                    delivery_address: form.value.delivery_type === 'livraison'
                        ? form.value.delivery_address
                        : null,
                    delivery_fee: form.value.delivery_type === 'livraison' ? DELIVERY_FEE : 0,
                    fedapay_transaction_id: transaction.id,
                }, gymSlug.value)

                // vider le panier
                cartStore.clear()

                await Swal.fire({
                    icon: 'success',
                    title: 'Commande confirmée !',
                    html: `
            <p>Commande <strong>#${result.order_id}</strong> enregistrée avec succès.</p>
            <p class="mt-2 text-sm text-gray-500">
              ${form.value.delivery_type === 'livraison'
                            ? 'Vous serez livré sous 2 à 5 jours ouvrés.'
                            : 'Votre commande sera disponible en salle sous 24h.'}
            </p>
            <p class="mt-3 font-bold text-indigo-600">
              Total payé : ${formatCurrency(result.total)}
            </p>
          `,
                    confirmButtonColor: '#4f46e5',
                    confirmButtonText: 'Voir mes commandes',
                })

                router.push(gymSlug.value ? `/shop/${gymSlug.value}/orders` : '/shop/orders')

            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Paiement reçu mais erreur commande',
                    text: 'Votre paiement a été reçu mais une erreur est survenue. Contactez-nous avec votre référence : ' + transaction.id,
                    confirmButtonColor: '#4f46e5',
                })
            } finally {
                loading.value = false
            }
        },
    })

    // déclencher le widget FedaPay
    document.querySelector('#fedapay-btn').click()
}

// ── Formatage FCFA ────────────────────────────────
function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: 0,
    }).format(value ?? 0)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>