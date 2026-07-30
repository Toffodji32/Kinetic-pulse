<template>
  <div class="min-h-screen bg-[#faf8ff] pb-36 md:pb-10">
    <!-- Header -->
    <div class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2">
            <span class="material-symbols-outlined text-[#131b2e] text-2xl">arrow_back</span>
          </button>
          <h1 class="font-black text-[#131b2e] text-lg">Mon panier</h1>
        </div>
        <span class="text-sm text-[#464554]" v-if="!cartStore.isEmpty">{{ cartStore.count }} article(s)</span>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-4">
      <!-- Empty cart -->
      <div v-if="cartStore.isEmpty" class="flex flex-col items-center justify-center py-20">
        <div class="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-5xl text-gray-300">shopping_cart</span>
        </div>
        <p class="text-[#131b2e] font-bold text-xl mb-1">Votre panier est vide</p>
        <p class="text-sm text-[#464554] mb-8">Ajoutez des produits depuis la boutique</p>
        <router-link :to="gymShopPath()">
          <el-button type="primary" size="large" style="border-radius:12px;background-color:#4f46e5;border-color:#4f46e5;font-weight:700;">
            <span class="material-symbols-outlined text-base mr-1">storefront</span>
            Découvrir la boutique
          </el-button>
        </router-link>
      </div>

      <!-- Cart content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Items list -->
        <div class="lg:col-span-2 space-y-3">
          <div v-for="item in cartStore.items" :key="item.product.id"
            class="bg-white rounded-2xl shadow-sm p-4 flex gap-3 items-center">
            <!-- Image -->
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              <img v-if="item.product.image" :src="mediaUrl(item.product.image)" class="w-full h-full object-cover" />
              <span v-else class="material-symbols-outlined text-3xl text-gray-200">shopping_bag</span>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-[#131b2e] text-sm truncate">{{ item.product.name }}</h3>
              <p class="text-[#4f46e5] font-black text-sm">{{ formatCurrency(item.price) }}</p>
              <p class="text-xs text-[#464554]">{{ formatCurrency(item.price * item.quantity) }}</p>
            </div>

            <!-- Quantity controls -->
            <div class="flex items-center gap-1">
              <button @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                class="min-w-[36px] min-h-[36px] rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <span class="material-symbols-outlined text-sm text-[#464554]">remove</span>
              </button>
              <span class="w-8 text-center font-bold text-[#131b2e] text-sm">{{ item.quantity }}</span>
              <button @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                class="min-w-[36px] min-h-[36px] rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <span class="material-symbols-outlined text-sm text-[#464554]">add</span>
              </button>
            </div>

            <!-- Delete -->
            <button @click="cartStore.removeItem(item.product.id)"
              class="min-w-[36px] min-h-[36px] rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors">
              <span class="material-symbols-outlined text-[#ef4444] text-xl">delete</span>
            </button>
          </div>

          <!-- Clear cart -->
          <div class="flex justify-end pt-2">
            <button @click="confirmClear" class="h-9 px-4 text-sm text-[#ef4444] font-medium rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-base">delete_sweep</span>
              Vider le panier
            </button>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm p-5 lg:sticky lg:top-24">
            <h2 class="font-black text-[#131b2e] text-lg mb-5">Récapitulatif</h2>

            <div class="space-y-3 mb-5">
              <div class="flex justify-between text-sm text-[#464554]">
                <span>Sous-total</span>
                <span class="font-semibold">{{ formatCurrency(cartStore.total) }}</span>
              </div>
              <div class="flex justify-between text-sm text-[#464554]">
                <span>Livraison</span>
                <span class="text-green-600 font-semibold">Calculé au checkout</span>
              </div>
              <div class="border-t pt-3 flex justify-between font-black text-[#131b2e] text-base">
                <span>Total estimé</span>
                <span class="text-[#4f46e5]">{{ formatCurrency(cartStore.total) }}</span>
              </div>
            </div>

            <router-link :to="gymShopPath('/checkout')">
              <el-button type="primary" size="large" class="w-full"
                style="border-radius:12px;background-color:#4f46e5;border-color:#4f46e5;font-weight:700;height:48px;">
                Commander
                <span class="material-symbols-outlined text-base ml-1">arrow_forward</span>
              </el-button>
            </router-link>

            <router-link :to="gymShopPath()" class="block text-center mt-3 text-[#4f46e5] text-sm font-medium hover:underline">
              ← Continuer mes achats
            </router-link>
          </div>
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

<style scoped>
</style>
