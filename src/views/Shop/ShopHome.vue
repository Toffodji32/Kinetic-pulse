<template>
  <div class="min-h-screen bg-[#faf8ff] pb-24 md:pb-10">
    <!-- Sticky header -->
    <div class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div class="flex items-center gap-3">
          <button @click="$router.push('/')" class="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2">
            <span class="material-symbols-outlined text-[#131b2e] text-2xl">arrow_back</span>
          </button>
          <div>
            <p class="text-xs text-[#464554] font-medium">Boutique</p>
            <h1 class="font-black text-[#131b2e] leading-tight">Kinetic Pulse</h1>
          </div>
        </div>
        <router-link :to="gymShopPath('/cart')" class="relative min-w-[44px] min-h-[44px] flex items-center justify-center">
          <span class="material-symbols-outlined text-[#131b2e] text-2xl">shopping_cart</span>
          <span v-if="cartStore.count > 0" class="absolute -top-1 -right-1 bg-[#4f46e5] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {{ cartStore.count > 99 ? '99+' : cartStore.count }}
          </span>
        </router-link>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-4 md:py-6">
      <!-- Hero section - desktop only -->
      <div class="hidden md:block bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-10 mb-8 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div class="relative z-10 max-w-lg">
          <p class="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-3">Boutique Kinetic Gym</p>
          <h1 class="text-4xl font-black tracking-tight mb-4">Suppléments, équipements<br />& accessoires fitness</h1>
          <p class="text-indigo-200 mb-6">Livraison à domicile ou retrait en salle disponible.</p>
          <el-button size="large" style="background:white;color:#4f46e5;border:none;border-radius:12px;font-weight:700;" @click="scrollToCatalog">
            Voir le catalogue
          </el-button>
        </div>
      </div>

      <!-- Search bar -->
      <div class="mb-4">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464554] text-xl">search</span>
          <input v-model="search" type="text" placeholder="Rechercher un produit..." class="w-full h-11 bg-white rounded-xl pl-10 pr-4 text-sm text-[#131b2e] placeholder:text-[#464554]/50 border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
        </div>
      </div>

      <!-- Category filters - horizontal scroll -->
      <div ref="catalogRef" class="mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide -mx-4 px-4">
        <div class="flex gap-2">
          <button v-for="cat in ['Tous', ...categoryStore.categories.map(c => c.name)]" :key="cat"
            @click="filterCategory = cat"
            class="min-h-[36px] px-4 rounded-full text-sm font-medium transition-all flex-shrink-0"
            :class="filterCategory === cat ? 'bg-[#4f46e5] text-white' : 'bg-white text-[#464554] border border-gray-200 hover:border-indigo-300'">
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="shopStore.loading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div v-for="i in 8" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div class="h-40 bg-gray-100 animate-pulse"></div>
          <div class="p-3 space-y-2">
            <div class="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded animate-pulse w-full"></div>
            <div class="h-5 bg-gray-100 rounded animate-pulse w-1/3"></div>
          </div>
        </div>
      </div>

      <!-- Products grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <!-- Image -->
          <div class="h-36 sm:h-40 bg-gray-50 flex items-center justify-center overflow-hidden relative cursor-pointer flex-shrink-0" @click="openDetail(product)">
            <img v-if="product.image" :src="mediaUrl(product.image)" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
            <span v-else class="material-symbols-outlined text-5xl text-gray-200">shopping_bag</span>

            <div v-if="product.quantity > 0 && product.quantity <= 5" class="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Plus que {{ product.quantity }} !
            </div>
            <div v-if="product.quantity === 0" class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Rupture
            </div>
          </div>

          <!-- Info -->
          <div class="p-3 flex flex-col flex-1">
            <div class="flex items-start justify-between gap-1 mb-1">
              <h3 class="font-bold text-[#131b2e] text-sm leading-tight line-clamp-2">{{ product.name }}</h3>
              <span v-if="product.category" class="text-[10px] bg-[#e0e7ff] text-[#4f46e5] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                {{ product.category }}
              </span>
            </div>
            <p class="text-xs text-[#464554] line-clamp-2 mb-2 flex-1">{{ product.description }}</p>

            <div class="flex items-center justify-between gap-2 mt-auto">
              <span class="text-base font-black text-[#4f46e5]">{{ formatCurrency(product.price) }}</span>
              <button @click="addToCart(product)" :disabled="product.quantity === 0"
                class="min-w-[44px] h-[36px] bg-[#4f46e5] text-white text-sm font-bold rounded-xl px-4 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                <span class="material-symbols-outlined text-base">add_shopping_cart</span>
                <span class="hidden sm:inline">Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <span class="material-symbols-outlined text-6xl text-gray-200 mb-4">shopping_bag</span>
        <p class="text-[#464554] font-medium text-lg mb-1">Aucun produit disponible</p>
        <p class="text-sm text-[#464554]/60 mb-6">Essayez de modifier vos filtres</p>
        <button @click="search = ''; filterCategory = 'Tous'" class="h-11 px-6 bg-[#4f46e5] text-white font-bold rounded-xl text-sm">
          Réinitialiser les filtres
        </button>
      </div>
    </div>

    <!-- Product detail modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative bg-white w-full sm:rounded-3xl sm:max-w-2xl overflow-hidden z-10 max-h-[93vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-b-3xl animate-slide-up">
            <!-- Close -->
            <button @click="closeModal" class="absolute top-4 right-4 z-20 min-w-[44px] min-h-[44px] bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
              <span class="material-symbols-outlined text-[#464554]">close</span>
            </button>

            <!-- Image -->
            <div class="h-56 sm:h-64 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
              <img v-if="selectedProduct?.image" :src="mediaUrl(selectedProduct.image)" class="w-full h-full object-cover" />
              <span v-else class="material-symbols-outlined text-8xl text-indigo-100">shopping_bag</span>

              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <span v-if="selectedProduct?.category" class="bg-white/90 backdrop-blur-sm text-[#4f46e5] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {{ selectedProduct.category }}
                </span>
                <span v-if="selectedProduct?.quantity > 0 && selectedProduct?.quantity <= 5" class="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Plus que {{ selectedProduct.quantity }} en stock !
                </span>
                <span v-if="selectedProduct?.quantity === 0" class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Rupture de stock
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 sm:p-6 overflow-y-auto flex-1">
              <div class="flex justify-between items-start mb-3 gap-4">
                <h2 class="text-xl sm:text-2xl font-black text-[#131b2e] leading-tight">{{ selectedProduct?.name }}</h2>
                <span class="text-2xl sm:text-3xl font-black text-[#4f46e5] flex-shrink-0">{{ formatCurrency(selectedProduct?.price) }}</span>
              </div>

              <p v-if="selectedProduct?.description" class="text-[#464554] leading-relaxed text-sm mb-5">{{ selectedProduct.description }}</p>
              <p v-else class="text-[#464554]/50 italic text-sm mb-5">Aucune description disponible.</p>

              <!-- Stock info -->
              <div class="bg-gray-50 rounded-2xl p-4 mb-5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="selectedProduct?.quantity > 0 ? 'bg-green-100' : 'bg-red-100'">
                    <span class="material-symbols-outlined" :class="selectedProduct?.quantity > 0 ? 'text-green-600' : 'text-red-500'">
                      {{ selectedProduct?.quantity > 0 ? 'check_circle' : 'cancel' }}
                    </span>
                  </div>
                  <div>
                    <p class="font-bold text-[#131b2e] text-sm">{{ selectedProduct?.quantity > 0 ? 'En stock' : 'Rupture de stock' }}</p>
                    <p class="text-xs text-[#464554]">{{ selectedProduct?.quantity }} unité(s) disponible(s)</p>
                  </div>
                </div>
                <div class="w-20 sm:w-24">
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" :class="(selectedProduct?.quantity ?? 0) > 10 ? 'bg-green-500' : (selectedProduct?.quantity ?? 0) > 0 ? 'bg-amber-500' : 'bg-red-500'"
                      :style="{ width: Math.min(((selectedProduct?.quantity ?? 0) / 50) * 100, 100) + '%' }" />
                  </div>
                </div>
              </div>

              <!-- Quantity + Add -->
              <div class="flex items-center gap-3">
                <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button @click="modalQty = Math.max(1, modalQty - 1)" class="min-w-[44px] h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-[#464554] font-bold">
                    <span class="material-symbols-outlined">remove</span>
                  </button>
                  <span class="w-10 text-center font-black text-[#131b2e]">{{ modalQty }}</span>
                  <button @click="modalQty = Math.min(selectedProduct?.quantity ?? 1, modalQty + 1)" :disabled="modalQty >= (selectedProduct?.quantity ?? 0)"
                    class="min-w-[44px] h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-[#464554] font-bold disabled:opacity-30">
                    <span class="material-symbols-outlined">add</span>
                  </button>
                </div>

                <el-button type="primary" size="large" class="flex-1"
                  :disabled="selectedProduct?.quantity === 0" @click="addToCartFromModal"
                  style="background-color:#4f46e5;border-color:#4f46e5;border-radius:14px;font-weight:700;height:44px;">
                  <span class="material-symbols-outlined text-base mr-1">shopping_cart</span>
                  {{ selectedProduct?.quantity === 0 ? 'Indisponible' : `Ajouter ${modalQty > 1 ? modalQty + ' articles' : 'au panier'}` }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="showCartToast" class="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-[#131b2e] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 min-w-[280px] max-w-[90vw]">
        <span class="material-symbols-outlined text-green-400">check_circle</span>
        <span class="font-medium text-sm flex-1">{{ toastMessage }}</span>
        <router-link :to="gymShopPath('/cart')" class="text-indigo-400 font-bold text-sm hover:text-indigo-300 flex-shrink-0">
          Voir →
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

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translate(-50%, 20px);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
