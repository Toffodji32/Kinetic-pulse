<template>
    <div class="min-h-screen bg-[#faf8ff] flex flex-col">
        <!-- HEADER -->
        <header class="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 sticky top-0 z-40">
            <div class="flex items-center gap-3">
                <router-link :to="gymSlug ? `/shop/${gymSlug}` : '/shop'" class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span class="material-symbols-outlined text-white text-base">bolt</span>
                    </div>
                    <span class="font-black text-[#131b2e] text-base tracking-tight hidden sm:block">KINETIC</span>
                </router-link>
            </div>

            <div class="flex items-center gap-2">
                <router-link v-if="gymSlug"
                    :to="`/shop/${gymSlug}/cart`"
                    class="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span class="material-symbols-outlined text-[#464554] text-2xl">shopping_cart</span>
                    <span v-if="cartStore.totalItems > 0"
                        class="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                        {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
                    </span>
                </router-link>

                <button @click="showMobileNav = !showMobileNav" class="lg:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span class="material-symbols-outlined text-[#464554] text-2xl">menu</span>
                </button>

                <router-link v-if="authStore.isAuthenticated" to="/shop/orders"
                    class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#464554] hover:bg-gray-50 transition-colors">
                    <span class="material-symbols-outlined text-lg">receipt_long</span>
                    Mes commandes
                </router-link>
            </div>
        </header>

        <!-- MOBILE NAV DRAWER -->
        <el-drawer v-model="showMobileNav" direction="right" size="280px" :with-header="false">
            <div class="flex flex-col h-full p-4">
                <div class="flex items-center justify-between mb-6">
                    <span class="font-bold text-[#131b2e]">Menu</span>
                    <button @click="showMobileNav = false" class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span class="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>
                <nav class="space-y-1 flex-1">
                    <router-link :to="gymSlug ? `/shop/${gymSlug}` : '/shop'" @click="showMobileNav = false"
                        class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#464554] hover:bg-gray-50 transition-colors">
                        <span class="material-symbols-outlined text-lg">storefront</span>
                        Boutique
                    </router-link>
                    <router-link :to="gymSlug ? `/shop/${gymSlug}/cart` : '/shop/cart'" @click="showMobileNav = false"
                        class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#464554] hover:bg-gray-50 transition-colors">
                        <span class="material-symbols-outlined text-lg">shopping_cart</span>
                        Panier ({{ cartStore.totalItems }})
                    </router-link>
                    <router-link v-if="authStore.isAuthenticated" :to="gymSlug ? `/shop/${gymSlug}/orders` : '/shop/orders'" @click="showMobileNav = false"
                        class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#464554] hover:bg-gray-50 transition-colors">
                        <span class="material-symbols-outlined text-lg">receipt_long</span>
                        Mes commandes
                    </router-link>
                    <router-link v-if="!authStore.isAuthenticated" :to="gymSlug ? `/shop/${gymSlug}/login` : '/shop/login'" @click="showMobileNav = false"
                        class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <span class="material-symbols-outlined text-lg">login</span>
                        Connexion
                    </router-link>
                </nav>
            </div>
        </el-drawer>

        <!-- MAIN CONTENT -->
        <main class="flex-1 overflow-y-auto">
            <router-view v-slot="{ Component }">
                <transition name="fade-up" mode="out-in">
                    <component :is="Component" :gym-slug="gymSlug" />
                </transition>
            </router-view>
        </main>

        <!-- MOBILE BOTTOM NAV -->
        <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-1 z-50 shadow-2xl safe-area-bottom">
            <router-link :to="gymSlug ? `/shop/${gymSlug}` : '/shop'"
                class="flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[44px] min-h-[44px] justify-center transition-colors"
                :class="route.path === (gymSlug ? `/shop/${gymSlug}` : '/shop') ? 'text-indigo-600' : 'text-gray-400'">
                <span class="material-symbols-outlined text-2xl">storefront</span>
                <span class="text-[10px] font-medium leading-none">Boutique</span>
            </router-link>
            <router-link :to="gymSlug ? `/shop/${gymSlug}/cart` : '/shop/cart'"
                class="flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[44px] min-h-[44px] justify-center transition-colors relative"
                :class="route.path.includes('/cart') ? 'text-indigo-600' : 'text-gray-400'">
                <span class="material-symbols-outlined text-2xl">shopping_cart</span>
                <span v-if="cartStore.totalItems > 0" class="absolute top-0 right-1/4 bg-indigo-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}</span>
                <span class="text-[10px] font-medium leading-none">Panier</span>
            </router-link>
            <router-link v-if="authStore.isAuthenticated" :to="gymSlug ? `/shop/${gymSlug}/orders` : '/shop/orders'"
                class="flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[44px] min-h-[44px] justify-center transition-colors"
                :class="route.path.includes('/orders') ? 'text-indigo-600' : 'text-gray-400'">
                <span class="material-symbols-outlined text-2xl">receipt_long</span>
                <span class="text-[10px] font-medium leading-none">Commandes</span>
            </router-link>
            <router-link v-if="!authStore.isAuthenticated" :to="gymSlug ? `/shop/${gymSlug}/login` : '/shop/login'"
                class="flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[44px] min-h-[44px] justify-center transition-colors"
                :class="route.path.includes('/login') ? 'text-indigo-600' : 'text-gray-400'">
                <span class="material-symbols-outlined text-2xl">login</span>
                <span class="text-[10px] font-medium leading-none">Connexion</span>
            </router-link>
        </nav>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const showMobileNav = ref(false)

const gymSlug = computed(() => route.params.gymSlug || null)
</script>

<style scoped>
.safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
