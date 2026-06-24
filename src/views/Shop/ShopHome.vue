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
                <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
        </div>

        <!-- Loading -->
        <div v-if="shopStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl"><Loading /></el-icon>
        </div>

        <!-- Grille produits -->
        <div v-else-if="filteredProducts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="product in filteredProducts" :key="product.id"
                class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 group">

                <!-- Image -->
                <div class="h-48 bg-gray-50 flex items-center justify-center overflow-hidden relative cursor-pointer"
                    @click="openDetail(product)">
                    <img v-if="product.image" :src="mediaUrl(product.image)"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <el-icon v-else class="text-6xl text-gray-200"><ShoppingBag /></el-icon>

                    <!-- Overlay voir -->
                    <div class="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div class="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 font-bold text-indigo-600 text-sm">
                            <el-icon><View /></el-icon>
                            Voir
                        </div>
                    </div>

                    <!-- Badge stock faible -->
                    <div v-if="product.quantity > 0 && product.quantity <= 5"
                        class="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Plus que {{ product.quantity }} !
                    </div>
                    <!-- Badge rupture -->
                    <div v-if="product.quantity === 0"
                        class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Rupture de stock
                    </div>
                </div>

                <!-- Infos -->
                <div class="p-4">
                    <div class="flex items-start justify-between gap-2 mb-1">
                        <h3 class="font-bold text-gray-800 leading-tight">{{ product.name }}</h3>
                        <span v-if="product.category"
                            class="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                            {{ product.category }}
                        </span>
                    </div>
                    <p class="text-xs text-gray-500 line-clamp-2 mb-3">{{ product.description }}</p>

                    <div class="flex justify-between items-center gap-2">
                        <span class="text-xl font-black text-indigo-600">{{ formatCurrency(product.price) }}</span>
                        <div class="flex gap-2">
                            <el-button type="primary" size="small" @click="addToCart(product)"
                                :disabled="product.quantity === 0"
                                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 8px;">
                                <el-icon class="mr-1"><ShoppingCart /></el-icon>
                                Ajouter
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vide -->
        <div v-else class="text-center py-20">
            <el-icon class="text-6xl text-gray-200 mb-4"><ShoppingBag /></el-icon>
            <p class="text-gray-400 font-medium">Aucun produit trouvé</p>
        </div>

        <!-- ═══════════════════════════════════════
             MODAL DÉTAIL PRODUIT
        ═══════════════════════════════════════ -->
        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="showModal"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4"
                    @click.self="closeModal">

                    <!-- Backdrop -->
                    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

                    <!-- Carte modale -->
                    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">

                        <!-- Bouton fermer -->
                        <button @click="closeModal"
                            class="absolute top-4 right-4 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                            <el-icon class="text-gray-600"><Close /></el-icon>
                        </button>

                        <!-- Image produit -->
                        <div class="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                            <img v-if="selectedProduct?.image"
                                :src="mediaUrl(selectedProduct.image)"
                                class="w-full h-full object-cover" />
                            <el-icon v-else class="text-9xl text-indigo-100"><ShoppingBag /></el-icon>

                            <!-- Badges -->
                            <div class="absolute top-4 left-4 flex flex-col gap-2">
                                <span v-if="selectedProduct?.category"
                                    class="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    {{ selectedProduct.category }}
                                </span>
                                <span v-if="selectedProduct?.quantity > 0 && selectedProduct?.quantity <= 5"
                                    class="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    Plus que {{ selectedProduct.quantity }} en stock !
                                </span>
                                <span v-if="selectedProduct?.quantity === 0"
                                    class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    Rupture de stock
                                </span>
                            </div>
                        </div>

                        <!-- Contenu scrollable -->
                        <div class="p-6 overflow-y-auto flex-1">

                            <!-- Nom + prix -->
                            <div class="flex justify-between items-start mb-3 gap-4">
                                <h2 class="text-2xl font-black text-gray-900 leading-tight">
                                    {{ selectedProduct?.name }}
                                </h2>
                                <span class="text-3xl font-black text-indigo-600 flex-shrink-0">
                                    {{ formatCurrency(selectedProduct?.price) }}
                                </span>
                            </div>

                            <!-- Description -->
                            <p v-if="selectedProduct?.description" class="text-gray-500 leading-relaxed mb-6">
                                {{ selectedProduct.description }}
                            </p>
                            <p v-else class="text-gray-400 italic mb-6">Aucune description disponible.</p>

                            <!-- Infos stock -->
                            <div class="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full flex items-center justify-center"
                                        :class="selectedProduct?.quantity > 0 ? 'bg-green-100' : 'bg-red-100'">
                                        <el-icon :class="selectedProduct?.quantity > 0 ? 'text-green-600' : 'text-red-500'">
                                            <CircleCheck v-if="selectedProduct?.quantity > 0" />
                                            <CircleClose v-else />
                                        </el-icon>
                                    </div>
                                    <div>
                                        <p class="font-bold text-gray-800 text-sm">
                                            {{ selectedProduct?.quantity > 0 ? 'En stock' : 'Rupture de stock' }}
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            {{ selectedProduct?.quantity }} unité(s) disponible(s)
                                        </p>
                                    </div>
                                </div>
                                <!-- Barre stock visuelle -->
                                <div class="w-24">
                                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full rounded-full transition-all"
                                            :class="selectedProduct?.quantity > 10 ? 'bg-green-500' : selectedProduct?.quantity > 0 ? 'bg-amber-500' : 'bg-red-500'"
                                            :style="{ width: Math.min(((selectedProduct?.quantity ?? 0) / 50) * 100, 100) + '%' }" />
                                    </div>
                                </div>
                            </div>

                            <!-- Sélecteur quantité + bouton panier -->
                            <div class="flex items-center gap-3">
                                <!-- Quantité -->
                                <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                    <button @click="modalQty = Math.max(1, modalQty - 1)"
                                        class="w-10 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 font-bold">
                                        −
                                    </button>
                                    <span class="w-10 text-center font-black text-gray-800">{{ modalQty }}</span>
                                    <button @click="modalQty = Math.min(selectedProduct?.quantity ?? 1, modalQty + 1)"
                                        :disabled="modalQty >= (selectedProduct?.quantity ?? 0)"
                                        class="w-10 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 font-bold disabled:opacity-30">
                                        +
                                    </button>
                                </div>

                                <!-- Bouton ajouter -->
                                <el-button type="primary" size="large" class="flex-1"
                                    :disabled="selectedProduct?.quantity === 0"
                                    @click="addToCartFromModal"
                                    style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 14px; font-weight: 700; height: 44px;">
                                    <el-icon class="mr-2"><ShoppingCart /></el-icon>
                                    {{ selectedProduct?.quantity === 0 ? 'Indisponible' : `Ajouter ${modalQty > 1 ? modalQty + ' articles' : 'au panier'}` }}
                                </el-button>
                            </div>

                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Toast panier -->
        <Transition name="slide-up">
            <div v-if="showCartToast"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 z-50">
                <el-icon class="text-green-400"><CircleCheck /></el-icon>
                <span class="font-medium">{{ toastMessage }}</span>
                <router-link :to="gymSlug ? `/shop/${gymSlug}/cart` : '/shop/cart'" class="text-indigo-400 font-bold hover:text-indigo-300">
                    Voir le panier →
                </router-link>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { mediaUrl } from '@/utils/media'
import { useCategoryStore } from '@/stores/category'
import { useShopStore } from '@/stores/shop'
import {
    CircleCheck,
    CircleClose,
    Close,
    Loading,
    Search,
    ShoppingBag,
    ShoppingCart,
    View,
} from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const gymSlug = computed(() => route.params.gymSlug || '')

const shopStore     = useShopStore()
const cartStore     = useCartStore()
const categoryStore = useCategoryStore()

// ── État ──────────────────────────────────────────────────────────────────
const search          = ref('')
const filterCategory  = ref('Tous')
const showCartToast   = ref(false)
const toastMessage    = ref('Ajouté au panier !')
const catalogRef      = ref(null)
const showModal       = ref(false)
const selectedProduct = ref(null)
const modalQty        = ref(1)

// ── Chargement ────────────────────────────────────────────────────────────
async function loadCategories() {
    if (gymSlug.value) {
        try {
            const { data } = await (await import('@/plugins/axios')).default.get(`/shop/${gymSlug.value}/categories`)
            categoryStore.categories = data
        } catch {}
    } else {
        await categoryStore.fetchAll()
    }
}

onMounted(async () => {
    await loadCategories()
    await shopStore.fetchProducts(gymSlug.value)
})

// ── Filtres ───────────────────────────────────────────────────────────────
const filteredProducts = computed(() => {
    let list = shopStore.products
    const q  = search.value.toLowerCase()

    if (q) list = list.filter(p => p.name.toLowerCase().includes(q))
    if (filterCategory.value && filterCategory.value !== 'Tous') {
        list = list.filter(p => {
            const cat = typeof p.category === 'object' ? p.category?.name : p.category
            return cat === filterCategory.value
        })
    }
    return list
})

// ── Modal ─────────────────────────────────────────────────────────────────
function openDetail(product) {
    selectedProduct.value = product
    modalQty.value = 1
    showModal.value = true
    document.body.style.overflow = 'hidden'
}

function closeModal() {
    showModal.value = false
    document.body.style.overflow = ''
}

// ── Panier ────────────────────────────────────────────────────────────────
function addToCart(product) {
    cartStore.addItem(product)
    toastMessage.value = `${product.name} ajouté au panier !`
    triggerToast()
}

function addToCartFromModal() {
    for (let i = 0; i < modalQty.value; i++) {
        cartStore.addItem(selectedProduct.value)
    }
    const qty = modalQty.value
    toastMessage.value = qty > 1
        ? `${qty} × ${selectedProduct.value.name} ajoutés !`
        : `${selectedProduct.value.name} ajouté au panier !`
    closeModal()
    triggerToast()
}

function triggerToast() {
    showCartToast.value = true
    setTimeout(() => showCartToast.value = false, 2500)
}

// ── Helpers ───────────────────────────────────────────────────────────────
function scrollToCatalog() {
    catalogRef.value?.scrollIntoView({ behavior: 'smooth' })
}


function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value ?? 0) + ' FCFA'
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
.modal-fade-enter-from .relative {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
}

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