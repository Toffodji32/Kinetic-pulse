<template>
    <div class="max-w-4xl mx-auto px-4 py-10">

        <h1 class="text-3xl font-black text-gray-800 mb-8">Mon panier</h1>

        <!-- Panier vide -->
        <div v-if="cartStore.isEmpty" class="text-center py-20 bg-white rounded-2xl shadow-sm">
            <el-icon class="text-7xl text-gray-200 mb-4">
                <ShoppingCart />
            </el-icon>
            <p class="text-gray-400 font-medium text-lg mb-6">Votre panier est vide</p>
            <router-link :to="gymShopPath()">
                <el-button type="primary" size="large"
                    style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px;">
                    Continuer mes achats
                </el-button>
            </router-link>
        </div>

        <!-- Contenu panier -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Liste articles -->
            <div class="lg:col-span-2 space-y-4">
                <div v-for="item in cartStore.items" :key="item.product.id"
                    class="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center">
                    <!-- Image -->
                    <div
                        class="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img v-if="item.product.image" :src="mediaUrl(item.product.image)"
                            class="w-full h-full object-cover" />
                        <el-icon v-else class="text-3xl text-gray-200">
                            <ShoppingBag />
                        </el-icon>
                    </div>

                    <!-- Infos -->
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800">{{ item.product.name }}</h3>
                        <p class="text-indigo-600 font-black">{{ formatCurrency(item.price) }}</p>
                    </div>

                    <!-- Quantité -->
                    <div class="flex items-center gap-2">
                        <el-button circle size="small"
                            @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)">
                            <el-icon>
                                <Minus />
                            </el-icon>
                        </el-button>
                        <span class="font-bold w-8 text-center">{{ item.quantity }}</span>
                        <el-button circle size="small"
                            @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-button>
                    </div>

                    <!-- Sous-total -->
                    <span class="font-black text-gray-800 min-w-[80px] text-right">
                        {{ formatCurrency(item.price * item.quantity) }}
                    </span>

                    <!-- Supprimer -->
                    <el-button circle type="danger" plain size="small" @click="cartStore.removeItem(item.product.id)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                </div>

                <!-- Vider le panier -->
                <div class="text-right">
                    <el-button plain size="small" @click="confirmClear" style="border-radius: 8px;">
                        Vider le panier
                    </el-button>
                </div>
            </div>

            <!-- Récapitulatif -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                    <h2 class="font-black text-gray-800 text-lg mb-6">Récapitulatif</h2>

                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>Sous-total ({{ cartStore.count }} article(s))</span>
                            <span class="font-semibold">{{ formatCurrency(cartStore.total) }}</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>Livraison</span>
                            <span class="text-green-600 font-semibold">Calculé au checkout</span>
                        </div>
                        <div class="border-t pt-3 flex justify-between font-black text-gray-800 text-lg">
                            <span>Total estimé</span>
                            <span class="text-indigo-600">{{ formatCurrency(cartStore.total) }}</span>
                        </div>
                    </div>

                    <!-- Checkout -->
                    <router-link :to="gymShopPath('/checkout')">
                        <el-button type="primary" size="large" class="w-full"
                            style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                            Commander →
                        </el-button>
                    </router-link>

                    <router-link :to="gymShopPath()"
                        class="block text-center mt-4 text-indigo-600 text-sm font-medium hover:underline">
                        ← Continuer mes achats
                    </router-link>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { mediaUrl } from '@/utils/media'
import Swal from 'sweetalert2'
import {
    ShoppingCart, ShoppingBag, Plus, Minus, Delete
} from '@element-plus/icons-vue'

const route = useRoute()
const gymSlug = computed(() => route.params.gymSlug || '')

function gymShopPath(suffix = '') {
    return gymSlug.value ? `/shop/${gymSlug.value}${suffix}` : `/shop${suffix}`
}

const cartStore = useCartStore()

async function confirmClear() {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Vider le panier ?',
        text: 'Tous les articles seront supprimés.',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, vider',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
    })
    if (result.isConfirmed) cartStore.clear()
}

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency', currency: 'XOF', maximumFractionDigits: 0
    }).format(value ?? 0)
}
</script>