<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">

        <!-- Header -->
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Produits</h2>
                <p class="text-[#464554] font-medium">Gestion du catalogue et des stocks</p>
            </div>
            <el-button type="primary" size="large" @click="showCreateModal = true"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2">
                    <Plus />
                </el-icon>
                Nouveau produit
            </el-button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-indigo-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Total produits</p>
                <p class="text-3xl font-black text-[#131b2e]">{{ productStore.products.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">En stock</p>
                <p class="text-3xl font-black text-green-600">{{ productStore.inStock.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-400">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Rupture</p>
                <p class="text-3xl font-black text-red-500">{{ productStore.outOfStock.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-amber-400">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Valeur stock</p>
                <p class="text-3xl font-black text-amber-600">{{ formatCurrency(stockValue) }}</p>
            </div>
        </div>

        <!-- Filtres -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
            <el-input v-model="search" placeholder="Rechercher un produit..." size="large" clearable
                style="max-width: 300px;">
                <template #prefix><el-icon>
                        <Search />
                    </el-icon></template>
            </el-input>

            <el-select v-model="filterCategory" placeholder="Toutes catégories" size="large" clearable
                style="width: 200px;">
                <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
            </el-select>

            <el-select v-model="filterStock" placeholder="Tous les stocks" size="large" clearable style="width: 180px;">
                <el-option label="En stock" value="in_stock" />
                <el-option label="Rupture" value="out_of_stock" />
            </el-select>

            <div class="ml-auto flex gap-2">
                <el-button :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'"
                    style="border-radius: 8px;">
                    <el-icon>
                        <Grid />
                    </el-icon>
                </el-button>
                <el-button :type="viewMode === 'table' ? 'primary' : 'default'" @click="viewMode = 'table'"
                    style="border-radius: 8px;">
                    <el-icon>
                        <List />
                    </el-icon>
                </el-button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="productStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <template v-else>

            <!-- VUE GRILLE -->
            <div v-if="viewMode === 'grid'"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                <div v-for="product in paginatedProducts" :key="product.id"
                    class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div class="h-48 bg-[#f2f3ff] flex items-center justify-center relative overflow-hidden">
                        <img v-if="product.image" :src="`http://127.0.0.1:8000${product.image}`"
                            class="w-full h-full object-cover" alt="" />
                        <el-icon v-else class="text-6xl text-indigo-200">
                            <ShoppingBag />
                        </el-icon>

                        <div class="absolute top-3 right-3">
                            <el-tag :type="product.stock_status === 'in_stock' ? 'success' : 'danger'" size="small"
                                round>
                                {{ product.stock_status === 'in_stock' ? `${product.quantity} en stock` : 'Rupture' }}
                            </el-tag>
                        </div>

                        <div
                            class="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <el-button circle @click="openDetail(product)" style="background: white; border: none;">
                                <el-icon class="text-indigo-600">
                                    <View />
                                </el-icon>
                            </el-button>
                            <el-button circle @click="openEditModal(product)" style="background: white; border: none;">
                                <el-icon class="text-indigo-600">
                                    <Edit />
                                </el-icon>
                            </el-button>
                            <el-button circle @click="handleDelete(product)" style="background: white; border: none;">
                                <el-icon class="text-red-500">
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>

                    <div class="p-4">
                        <div class="flex justify-between items-start mb-1">
                            <h3 class="font-bold text-[#131b2e] text-sm leading-tight">{{ product.name }}</h3>
                            <span class="font-black text-indigo-600 text-sm ml-2 flex-shrink-0">
                                {{ formatCurrency(product.price) }}
                            </span>
                        </div>
                        <p class="text-xs text-[#464554] line-clamp-2 mb-3">{{ product.description || '—' }}</p>

                        <div class="flex items-center gap-2">
                            <div class="flex-1 bg-[#f2f3ff] h-1.5 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all"
                                    :class="product.quantity > 10 ? 'bg-green-500' : product.quantity > 0 ? 'bg-amber-500' : 'bg-red-500'"
                                    :style="{ width: Math.min((product.quantity / 50) * 100, 100) + '%' }" />
                            </div>
                            <span class="text-xs font-bold text-[#464554]">{{ product.quantity }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- VUE TABLEAU -->
            <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <el-table :data="paginatedProducts" style="width: 100%" empty-text="Aucun produit trouvé">

                    <el-table-column label="Produit" min-width="240">
                        <template #default="{ row }">
                            <div class="flex items-center gap-3 py-2">
                                <div
                                    class="w-12 h-12 rounded-xl bg-[#f2f3ff] flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <img v-if="row.image" :src="`http://127.0.0.1:8000${row.image}`"
                                        class="w-full h-full object-cover" />
                                    <el-icon v-else class="text-indigo-300 text-xl">
                                        <ShoppingBag />
                                    </el-icon>
                                </div>
                                <div>
                                    <p class="font-bold text-[#131b2e]">{{ row.name }}</p>
                                    <p class="text-xs text-[#464554] line-clamp-1">{{ row.description || '—' }}</p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="Prix" min-width="100">
                        <template #default="{ row }">
                            <span class="font-black text-indigo-600">{{ formatCurrency(row.price) }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="Stock" min-width="140">
                        <template #default="{ row }">
                            <el-tag :type="row.stock_status === 'in_stock' ? 'success' : 'danger'" size="small" round>
                                {{ row.quantity }} unités
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="Statut" min-width="120" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.stock_status === 'in_stock' ? 'success' : 'danger'" size="small" round>
                                {{ row.stock_status === 'in_stock' ? 'En stock' : 'Rupture' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="Actions" min-width="180" align="center">
                        <template #default="{ row }">
                            <div class="flex gap-2 justify-center">
                                <el-button size="small" @click="openDetail(row)"
                                    style="background-color: #e0e7ff; color: #4f46e5; border: none; border-radius: 8px;">
                                    <el-icon>
                                        <View />
                                    </el-icon>
                                </el-button>
                                <el-button size="small" type="warning" plain @click="openEditModal(row)"
                                    style="border-radius: 8px;">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                                <el-button size="small" type="danger" plain @click="handleDelete(row)"
                                    style="border-radius: 8px;">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>

                </el-table>
            </div>

        </template>

        <!-- Pagination -->
        <div class="flex justify-center mb-6">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[12, 24, 48]"
                :total="filteredProducts.length" layout="total, sizes, prev, pager, next" background />
        </div>

        <!-- ═══════════════════════════════════════
             MODAL CRÉATION PRODUIT
        ═══════════════════════════════════════ -->
        <el-dialog v-model="showCreateModal" title="Nouveau produit" width="560px" :close-on-click-modal="false"
            :append-to-body="true" :destroy-on-close="true" @closed="resetCreateForm">
            <el-form ref="createFormRef" :model="createForm" :rules="productRules" label-position="top" size="large">
                <el-form-item label="Nom du produit" prop="name">
                    <el-input v-model="createForm.name" placeholder="Whey Protéine 1kg" />
                </el-form-item>

                <el-form-item label="Description">
                    <el-input v-model="createForm.description" type="textarea" :rows="3"
                        placeholder="Description du produit..." />
                </el-form-item>

                <div class="grid grid-cols-2 gap-4">
                    <el-form-item label="Prix (€)" prop="price">
                        <el-input-number v-model="createForm.price" :min="0" :precision="2" :step="0.5"
                            style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="Quantité en stock" prop="quantity">
                        <el-input-number v-model="createForm.quantity" :min="0" :step="1" style="width: 100%" />
                    </el-form-item>
                </div>

                <el-form-item label="Catégorie">
                    <!-- Remplacer les el-option hardcodées -->
                    <el-select v-model="createForm.category" placeholder="Choisir..." style="width: 100%">
                        <el-option v-for="cat in categoryStore.categories" :key="cat.id" :label="cat.name"
                            :value="cat.name" />
                    </el-select>
                </el-form-item>

                <el-form-item label="Image du produit">
                    <el-upload class="w-full" action="#" :auto-upload="false"
                        :on-change="(f) => createForm.image = f.raw" :show-file-list="false" accept="image/*">
                        <div
                            class="w-full h-32 border-2 border-dashed border-indigo-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors">
                            <el-icon class="text-3xl text-indigo-300 mb-2">
                                <Upload />
                            </el-icon>
                            <p class="text-sm text-[#464554]">
                                {{ createForm.image ? createForm.image.name : 'Cliquer pour uploader une image' }}
                            </p>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="productStore.loading" @click="handleCreate"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Créer le produit
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- ═══════════════════════════════════════
             MODAL MODIFICATION PRODUIT
        ═══════════════════════════════════════ -->
        <el-dialog v-model="showEditModal" title="Modifier le produit" width="560px" :close-on-click-modal="false"
            :append-to-body="true" :destroy-on-close="true" @closed="resetEditForm">
            <el-form ref="editFormRef" :model="editForm" :rules="productRules" label-position="top" size="large">
                <el-form-item label="Nom du produit" prop="name">
                    <el-input v-model="editForm.name" />
                </el-form-item>

                <el-form-item label="Description">
                    <el-input v-model="editForm.description" type="textarea" :rows="3" />
                </el-form-item>

                <div class="grid grid-cols-2 gap-4">
                    <el-form-item label="Prix (€)" prop="price">
                        <el-input-number v-model="editForm.price" :min="0" :precision="2" :step="0.5"
                            style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="Quantité en stock" prop="quantity">
                        <el-input-number v-model="editForm.quantity" :min="0" :step="1" style="width: 100%" />
                    </el-form-item>
                </div>

                <el-form-item label="Catégorie">
                    <el-select v-model="editForm.category" style="width: 100%">
                        <el-option v-for="cat in categoryStore.categories" :key="cat.id" :label="cat.name"
                            :value="cat.name" />
                    </el-select>
                </el-form-item>

                <el-form-item label="Changer l'image (optionnel)">
                    <el-upload class="w-full" action="#" :auto-upload="false" :on-change="(f) => editForm.image = f.raw"
                        :show-file-list="false" accept="image/*">
                        <el-button plain style="width: 100%; border-radius: 8px;">
                            <el-icon class="mr-2">
                                <Upload />
                            </el-icon>
                            {{ editForm.image ? editForm.image.name : 'Choisir une nouvelle image' }}
                        </el-button>
                    </el-upload>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="showEditModal = false" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="productStore.loading" @click="handleEdit"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Enregistrer
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- ═══════════════════════════════════════
             DRAWER DÉTAIL PRODUIT
        ═══════════════════════════════════════ -->
        <el-drawer v-model="showDetail" direction="rtl" size="460px" :with-header="false" :append-to-body="true">
            <div v-if="selectedProduct" class="p-6 h-full overflow-y-auto">

                <div class="h-56 bg-[#f2f3ff] rounded-2xl flex items-center justify-center overflow-hidden mb-6">
                    <img v-if="selectedProduct.image" :src="`http://127.0.0.1:8000${selectedProduct.image}`"
                        class="w-full h-full object-cover rounded-2xl" />
                    <el-icon v-else class="text-8xl text-indigo-200">
                        <ShoppingBag />
                    </el-icon>
                </div>

                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="text-2xl font-black text-[#131b2e]">{{ selectedProduct.name }}</h2>
                        <p class="text-[#464554] text-sm mt-1">{{ selectedProduct.description || 'Aucune description' }}
                        </p>
                    </div>
                    <span class="text-2xl font-black text-indigo-600 ml-4">
                        {{ formatCurrency(selectedProduct.price) }}
                    </span>
                </div>

                <div class="space-y-3 mb-8">
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between items-center">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Stock actuel</span>
                        <div class="flex items-center gap-2">
                            <span class="font-black text-xl text-[#131b2e]">{{ selectedProduct.quantity }}</span>
                            <el-tag :type="selectedProduct.stock_status === 'in_stock' ? 'success' : 'danger'"
                                size="small" round>
                                {{ selectedProduct.stock_status === 'in_stock' ? 'En stock' : 'Rupture' }}
                            </el-tag>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-indigo-100 rounded-xl p-4 mb-6 shadow-sm">
                    <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-3">
                        Ajustement stock rapide
                    </p>
                    <div class="flex items-center gap-3">
                        <el-input-number v-model="stockAdjust" :min="1" :max="999" size="large" style="width: 140px;" />
                        <el-button type="success" size="large" style="border-radius: 10px; flex: 1;"
                            @click="handleAddStock">
                            <el-icon class="mr-1">
                                <Plus />
                            </el-icon>
                            Ajouter
                        </el-button>
                        <el-button type="danger" plain size="large" style="border-radius: 10px; flex: 1;"
                            @click="handleDecreaseStock">
                            <el-icon class="mr-1">
                                <Minus />
                            </el-icon>
                            Retirer
                        </el-button>
                    </div>
                </div>

                <div class="flex gap-3">
                    <el-button type="primary" size="large"
                        style="flex: 1; background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
                        @click="openEditModal(selectedProduct)">
                        <el-icon class="mr-2">
                            <Edit />
                        </el-icon>
                        Modifier
                    </el-button>
                    <el-button type="danger" plain size="large" style="flex: 1; border-radius: 12px; font-weight: 700;"
                        @click="handleDelete(selectedProduct)">
                        <el-icon class="mr-2">
                            <Delete />
                        </el-icon>
                        Supprimer
                    </el-button>
                </div>

            </div>
        </el-drawer>

    </div>
</template>

<script setup>
import { useCategoryStore } from '@/stores/category'
import { useProductStore } from '@/stores/product'
import {
    Delete,
    Edit,
    Grid, List,
    Loading,
    Minus,
    Plus, Search,
    ShoppingBag,
    Upload,
    View
} from '@element-plus/icons-vue'
import Swal from 'sweetalert2'
import { computed, nextTick, onMounted, ref } from 'vue'

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const search = ref('')
const filterCategory = ref('')
const filterStock = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const viewMode = ref('grid')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetail = ref(false)
const selectedProduct = ref(null)
const stockAdjust = ref(1)
const createFormRef = ref(null)
const editFormRef = ref(null)

const createForm = ref({
    name: '', description: '', price: 0,
    quantity: 0, category: '', image: null,
})

const editForm = ref({
    name: '', description: '', price: 0,
    quantity: 0, category: '', image: null,
})

const productRules = {
    name: [{ required: true, message: 'Nom obligatoire', trigger: 'blur' }],
    price: [{ required: true, message: 'Prix obligatoire', trigger: 'blur' }],
    quantity: [{ required: true, message: 'Quantité requise', trigger: 'blur' }],
}

onMounted(async () => {
    // Charger les catégories EN PREMIER pour que le formulaire les affiche
    await categoryStore.fetchAll()
    await productStore.fetchAll()
})

const stockValue = computed(() =>
    productStore.products.reduce((sum, p) => sum + p.price * p.quantity, 0)
)

const filteredProducts = computed(() => {
    let list = productStore.products
    const q = search.value.toLowerCase()
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q))
    if (filterStock.value) list = list.filter(p => p.stock_status === filterStock.value)
    if (filterCategory.value) {
        list = list.filter(p => {
            // Gère les cas où category peut être un objet ou une chaîne
            const prodCategory = typeof p.category === 'object' ? p.category?.name : p.category
            return prodCategory === filterCategory.value
        })
    }
    return list
})

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredProducts.value.slice(start, start + pageSize.value)
})

const categories = computed(() =>
    categoryStore.categories.map(c => c.name)
)

async function handleCreate() {
    await createFormRef.value.validate(async (valid) => {
        if (!valid) return
        try {
            await productStore.create(createForm.value)
            showCreateModal.value = false
            Swal.fire({
                icon: 'success', title: 'Produit créé !',
                text: `${createForm.value.name} a été ajouté au catalogue.`,
                confirmButtonColor: '#4f46e5', confirmButtonText: 'Super !',
            })
            resetCreateForm()
        } catch {
            Swal.fire({
                icon: 'error', title: 'Erreur',
                text: productStore.error || 'Impossible de créer le produit.',
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ← CORRECTION : blur + nextTick avant d'ouvrir le modal
function openEditModal(product) {
    selectedProduct.value = product
    editForm.value = {
        name: product.name,
        description: product.description || '',
        price: product.price,
        quantity: product.quantity,
        // Gérer les cas où category peut être un objet ou une chaîne
        category: typeof product.category === 'object' ? product.category?.name : (product.category || ''),
        image: null,
    }
    showDetail.value = false

    nextTick(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        showEditModal.value = true
    })
}

async function handleEdit() {
    await editFormRef.value.validate(async (valid) => {
        if (!valid) return
        try {
            await productStore.update(selectedProduct.value.id, editForm.value)
            await productStore.fetchAll()
            selectedProduct.value = productStore.products.find(
                p => p.id === selectedProduct.value.id
            )
            showEditModal.value = false
            Swal.fire({
                icon: 'success', title: 'Produit modifié !',
                confirmButtonColor: '#4f46e5',
                timer: 2000, showConfirmButton: false,
            })
        } catch (err) {
            console.error('Erreur modification produit:', err)
            Swal.fire({
                icon: 'error', title: 'Erreur',
                text: productStore.error || 'Impossible de modifier le produit.',
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

async function handleDelete(product) {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Supprimer ce produit ?',
        html: `<p><strong>${product.name}</strong> sera définitivement supprimé du catalogue.</p>`,
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
    })
    if (!result.isConfirmed) return

    try {
        await productStore.remove(product.id)
        showDetail.value = false
        Swal.fire({
            icon: 'success', title: 'Supprimé !',
            confirmButtonColor: '#4f46e5',
            timer: 2000, showConfirmButton: false,
        })
    } catch {
        Swal.fire({
            icon: 'error', title: 'Erreur',
            text: productStore.error || 'Impossible de supprimer.',
            confirmButtonColor: '#4f46e5',
        })
    }
}

function openDetail(product) {
    selectedProduct.value = product
    stockAdjust.value = 1
    showDetail.value = true
}

async function handleAddStock() {
    try {
        await productStore.update(selectedProduct.value.id, {
            quantity: selectedProduct.value.quantity + stockAdjust.value,
        })
        await productStore.fetchAll()
        selectedProduct.value = productStore.products.find(
            p => p.id === selectedProduct.value.id
        )
        Swal.fire({
            icon: 'success', title: 'Stock mis à jour !',
            confirmButtonColor: '#4f46e5',
            timer: 1500, showConfirmButton: false,
        })
    } catch {
        Swal.fire({ icon: 'error', title: 'Erreur', confirmButtonColor: '#4f46e5' })
    }
}

async function handleDecreaseStock() {
    if (selectedProduct.value.quantity < stockAdjust.value) {
        Swal.fire({
            icon: 'warning', title: 'Stock insuffisant',
            text: `Seulement ${selectedProduct.value.quantity} unité(s) disponible(s).`,
            confirmButtonColor: '#4f46e5',
        })
        return
    }
    try {
        await productStore.decreaseStock(selectedProduct.value.id, stockAdjust.value)
        await productStore.fetchAll()
        selectedProduct.value = productStore.products.find(
            p => p.id === selectedProduct.value.id
        )
        Swal.fire({
            icon: 'success', title: 'Stock mis à jour !',
            confirmButtonColor: '#4f46e5',
            timer: 1500, showConfirmButton: false,
        })
    } catch {
        Swal.fire({ icon: 'error', title: 'Erreur', confirmButtonColor: '#4f46e5' })
    }
}

function resetCreateForm() {
    createForm.value = {
        name: '', description: '', price: 0,
        quantity: 0, category: '', image: null,
    }
    createFormRef.value?.resetFields()
}

function resetEditForm() {
    editForm.value = {
        name: '', description: '', price: 0,
        quantity: 0, category: '', image: null,
    }
    editFormRef.value?.resetFields()
}


function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value ?? 0) + ' FCFA'
}
</script>