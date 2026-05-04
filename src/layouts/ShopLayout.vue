<template>
    <div class="min-h-screen bg-gray-50">

        <!-- Navbar boutique - masquée sur la page de login -->
        <nav v-if="route.name !== 'shop-login'" class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

                <router-link to="/shop" class="text-2xl font-black text-indigo-600 tracking-tight">
                    Kinetic <span class="text-gray-800">Shop</span>
                </router-link>

                <div class="flex items-center gap-6">
                    <router-link to="/shop" class="text-gray-500 hover:text-indigo-600 font-medium transition-colors">
                        Catalogue
                    </router-link>

                    <router-link v-if="authStore.isAuthenticated" to="/shop/orders"
                        class="text-gray-500 hover:text-indigo-600 font-medium transition-colors">
                        Mes commandes
                    </router-link>

                    <!-- Panier -->
                    <router-link to="/shop/cart" class="relative">
                        <el-button type="primary"
                            style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px;">
                            <el-icon class="mr-2">
                                <ShoppingCart />
                            </el-icon>
                            Panier
                            <span v-if="cartStore.count > 0"
                                class="ml-2 bg-white text-indigo-600 text-xs font-black rounded-full w-5 h-5 inline-flex items-center justify-center">
                                {{ cartStore.count }}
                            </span>
                        </el-button>
                    </router-link>

                    <!-- Auth -->
                    <template v-if="authStore.isAuthenticated">
                        <span class="text-sm font-medium text-gray-600">{{ authStore.user?.name }}</span>
                        <el-button size="small" plain @click="handleLogout" style="border-radius: 8px;">
                            Déconnexion
                        </el-button>
                    </template>
                    <template v-else>
                        <router-link to="/shop/login">
                            <el-button style="border-radius: 8px;">Connexion</el-button>
                        </router-link>
                    </template>

                </div>
            </div>
        </nav>

        <!-- Contenu -->
        <RouterView />

    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { ShoppingCart } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
    authStore.logout()
    router.push('/shop/login')
}
</script>