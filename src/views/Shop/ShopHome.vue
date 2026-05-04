<template>
    <div class="max-w-6xl mx-auto px-4 py-10">

        <!-- Hero -->
        <div class="bg-indigo-600 rounded-3xl p-10 mb-10 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div class="relative z-10 max-w-lg">
                <p class="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-3">Boutique Kinetic Gym</p>
                <h1 class="text-4xl font-black tracking-tight mb-4">
                    Suppléments, équipements<br />& accessoires fitness
                </h1>
                <p class="text-indigo-200 mb-6">Livraison à domicile ou retrait en salle disponible.</p>
                <el-button size="large"
                    style="background: white; color: #4f46e5; border: none; border-radius: 12px; font-weight: 700;"
                    @click="scrollToCatalog">
                    Voir le catalogue
                </el-button>
            </div>
        </div>

        <!-- Filtres catégories -->
        <div class="flex flex-wrap gap-3 mb-8" ref="catalogRef">
            <el-button v-for="cat in ['Tous', ...categoryStore.categories.map(c => c.name)]" :key="cat"
                :type="filterCategory === cat ? 'primary' : 'default'" @click="filterCategory = cat"
                style="border-radius: 20px;" :style="filterCategory === cat
                    ? 'background-color: #4f46e5; border-color: #4f46e5;'
                    : ''">
                {{ cat }}
            </el-button>
        </div>

        <!-- Recherche -->
        <div class="mb-8">
            <el-input v-model="search" placeholder="Rechercher un produit..." size="large" clearable
                style="max-width: 400px;">
                <template #prefix><el-icon>
                        <Search />
                    </el-icon></template>
            </el-input>
        </div>

        <!-- Loading -->
        <div v-if="shopStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <!-- Grille produits -->
        <div v-else-if="filteredProducts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="product in filteredProducts" :key="product.id"
                class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 group">
                <!-- Image -->
                <div class="h-48 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                    <img v-if="product.image" :src="`http://127.0.0.1:8000${product.image}`"
                        class="w-full h-full object-cover" />
                    <el-icon v-else class="text-6xl text-gray-200">
                        <ShoppingBag />
                    </el-icon>

                    <!-- Badge stock faible -->
                    <div v-if="product.quantity <= 5"
                        class="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Plus que {{ product.quantity }} !
                    </div>
                </div>

                <!-- Infos -->
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-1">{{ product.name }}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2 mb-3">{{ product.description }}</p>

                    <div class="flex justify-between items-center">
                        <span class="text-xl font-black text-indigo-600">{{ formatCurrency(product.price) }}</span>
                        <el-button type="primary" size="small" @click="addToCart(product)"
                            style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 8px;">
                            <el-icon class="mr-1">
                                <ShoppingCart />
                            </el-icon>
                            Ajouter
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vide -->
        <div v-else class="text-center py-20">
            <el-icon class="text-6xl text-gray-200 mb-4">
                <ShoppingBag />
            </el-icon>
            <p class="text-gray-400 font-medium">Aucun produit trouvé</p>
        </div>

        <!-- Toast panier -->
        <Transition name="slide-up">
            <div v-if="showCartToast"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 z-50">
                <el-icon class="text-green-400">
                    <CircleCheck />
                </el-icon>
                <span class="font-medium">Ajouté au panier !</span>
                <router-link to="/shop/cart" class="text-indigo-400 font-bold hover:text-indigo-300">
                    Voir le panier →
                </router-link>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useCategoryStore } from '@/stores/category'
import { useShopStore } from '@/stores/shop'
import {
    CircleCheck,
    Loading,
    Search,
    ShoppingBag, ShoppingCart
} from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'

const shopStore = useShopStore()
const cartStore = useCartStore()
const categoryStore = useCategoryStore()

const search = ref('')
const filterCategory = ref('Tous')
const showCartToast = ref(false)
const catalogRef = ref(null)


onMounted(async () => {
    await categoryStore.fetchAll()
    await shopStore.fetchProducts()
})

const filteredProducts = computed(() => {
    let list = shopStore.products
    const q = search.value.toLowerCase()

    if (q) list = list.filter(p => p.name.toLowerCase().includes(q))
    if (filterCategory.value && filterCategory.value !== 'Tous') {
        list = list.filter(p => {
            // Gère les cas où category peut être un objet ou une chaîne
            const prodCategory = typeof p.category === 'object' ? p.category?.name : p.category
            return prodCategory === filterCategory.value
        })
    }
    return list
})

function addToCart(product) {
    cartStore.addItem(product)
    showCartToast.value = true
    setTimeout(() => showCartToast.value = false, 2500)
}

function scrollToCatalog() {
    catalogRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency', currency: 'EUR'
    }).format(value ?? 0)
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translate(-50%, 20px);
}
</style>