<template>
  <div class="bg-[#faf8ff] min-h-screen p-4 sm:p-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black font-headline tracking-tight text-indigo-600">Catégories</h2>
        <p class="text-[#464554] font-medium text-sm sm:text-base">Gestion des catégories de produits</p>
      </div>
      <el-button type="primary" size="large" @click="showCreateModal = true"
        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700; padding: 12px 20px;"
        class="w-full sm:w-auto">
        <span class="material-symbols-outlined text-lg mr-1">add</span>
        Nouvelle catégorie
      </el-button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-indigo-500">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#464554] mb-1">Total</p>
        <p class="text-xl sm:text-3xl font-black text-[#131b2e]">{{ categoryStore.categories.length }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-green-500">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#464554] mb-1">Avec produits</p>
        <p class="text-xl sm:text-3xl font-black text-green-600">{{ categoriesWithProducts }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-amber-400">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#464554] mb-1">Vides</p>
        <p class="text-xl sm:text-3xl font-black text-amber-600">{{ categoriesEmpty }}</p>
      </div>
    </div>

    <!-- Recherche -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6 flex gap-4 items-center">
      <el-input v-model="search" placeholder="Rechercher une catégorie..." size="large" clearable style="max-width: 400px;">
        <template #prefix><span class="material-symbols-outlined text-lg text-[#464554]">search</span></template>
      </el-input>
      <span class="text-[#464554] text-sm font-medium ml-auto hidden sm:block">{{ filteredCategories.length }} catégorie(s)</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="categoryStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 animate-pulse">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gray-100 rounded-xl"></div>
          <div class="flex-1">
            <div class="h-5 bg-gray-100 rounded w-32 mb-2"></div>
            <div class="h-3 bg-gray-100 rounded w-24"></div>
          </div>
        </div>
        <div class="h-10 bg-gray-100 rounded-xl mb-4"></div>
        <div class="flex gap-2">
          <div class="h-8 bg-gray-100 rounded flex-1"></div>
          <div class="h-8 bg-gray-100 rounded w-8"></div>
        </div>
      </div>
    </div>

    <!-- Grille -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      <div v-for="category in paginatedCategories" :key="category.id"
        class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all border border-transparent hover:border-indigo-100">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0" :style="{ backgroundColor: getCategoryColor(category.name) + '20' }">
              {{ getCategoryEmoji(category.name) }}
            </div>
            <div class="min-w-0">
              <h3 class="font-black text-[#131b2e] text-sm sm:text-lg leading-tight truncate">{{ category.name }}</h3>
              <p class="text-[10px] sm:text-xs text-[#464554] mt-0.5 line-clamp-2">{{ category.description || 'Aucune description' }}</p>
            </div>
          </div>
        </div>
        <div class="bg-[#f2f3ff] rounded-xl px-4 py-2 flex justify-between items-center mb-4">
          <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#464554]">Produits</span>
          <span class="font-black text-indigo-600 text-sm sm:text-base">{{ getProductCount(category.name) }}</span>
        </div>
        <div class="flex gap-2">
          <el-button size="small" type="warning" plain @click="openEditModal(category)" style="flex: 1; border-radius: 8px; min-height: 36px; min-width: 44px;">
            <span class="material-symbols-outlined text-sm mr-1">edit</span>
            <span class="hidden sm:inline">Modifier</span>
          </el-button>
          <el-button size="small" type="danger" plain @click="handleDelete(category)" style="border-radius: 8px; min-height: 36px; min-width: 44px;">
            <span class="material-symbols-outlined text-sm">delete</span>
          </el-button>
        </div>
      </div>

      <!-- Card "Ajouter" -->
      <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all min-h-[160px]"
        @click="showCreateModal = true">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
          <span class="material-symbols-outlined text-2xl text-indigo-400">add</span>
        </div>
        <p class="text-sm font-bold text-indigo-400">Ajouter une catégorie</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[6, 12, 24]"
        :total="filteredCategories.length" layout="total, sizes, prev, pager, next" background />
    </div>

    <!-- Empty state -->
    <div v-if="!categoryStore.loading && filteredCategories.length === 0 && !showCreateModal" class="flex flex-col items-center justify-center py-16">
      <span class="material-symbols-outlined text-6xl text-gray-200 mb-4">category</span>
      <p class="text-[#464554] font-medium mb-4">Aucune catégorie trouvée</p>
      <el-button type="primary" @click="showCreateModal = true"
        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700; padding: 12px 20px;">
        <span class="material-symbols-outlined text-lg mr-1">add</span>
        Créer une catégorie
      </el-button>
    </div>

    <!-- ═══════════════════════════════════════
         MODAL CRÉATION (responsive)
    ═══════════════════════════════════════ -->
    <!-- Mobile drawer -->
    <div class="sm:hidden">
      <el-drawer v-model="showCreateModal" direction="btt" size="90%" :close-on-click-modal="false" @closed="resetCreateForm" title="Nouvelle catégorie">
        <template #default>
          <el-form ref="createFormRef" :model="createForm" :rules="rules" label-position="top" size="large" class="px-2">
            <el-form-item label="Nom de la catégorie" prop="name">
              <el-input v-model="createForm.name" placeholder="Ex: Suppléments / protéines" style="border-radius: 10px;">
                <template #prefix><span>{{ getCategoryEmoji(createForm.name) }}</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="Description (optionnel)">
              <el-input v-model="createForm.description" type="textarea" :rows="3" placeholder="Description de la catégorie..." style="border-radius: 10px;" />
            </el-form-item>
            <div v-if="createForm.name" class="bg-[#f2f3ff] rounded-xl p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" :style="{ backgroundColor: getCategoryColor(createForm.name) + '30' }">{{ getCategoryEmoji(createForm.name) }}</div>
              <div>
                <p class="font-bold text-[#131b2e] text-sm">{{ createForm.name }}</p>
                <p class="text-xs text-[#464554]">{{ createForm.description || 'Aucune description' }}</p>
              </div>
            </div>
          </el-form>
        </template>
        <template #footer>
          <div class="flex gap-3">
            <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px; flex: 1; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="categoryStore.loading" @click="handleCreate"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; flex: 1; min-height: 44px;">
              Créer
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>
    <!-- Desktop dialog -->
    <div class="hidden sm:block">
      <el-dialog v-model="showCreateModal" title="Nouvelle catégorie" width="480px" :close-on-click-modal="false" @closed="resetCreateForm">
        <el-form ref="createFormRef" :model="createForm" :rules="rules" label-position="top" size="large">
          <el-form-item label="Nom de la catégorie" prop="name">
            <el-input v-model="createForm.name" placeholder="Ex: Suppléments / protéines" style="border-radius: 10px;">
              <template #prefix><span>{{ getCategoryEmoji(createForm.name) }}</span></template>
            </el-input>
          </el-form-item>
          <el-form-item label="Description (optionnel)">
            <el-input v-model="createForm.description" type="textarea" :rows="3" placeholder="Description de la catégorie..." style="border-radius: 10px;" />
          </el-form-item>
          <div v-if="createForm.name" class="bg-[#f2f3ff] rounded-xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" :style="{ backgroundColor: getCategoryColor(createForm.name) + '30' }">{{ getCategoryEmoji(createForm.name) }}</div>
            <div>
              <p class="font-bold text-[#131b2e] text-sm">{{ createForm.name }}</p>
              <p class="text-xs text-[#464554]">{{ createForm.description || 'Aucune description' }}</p>
            </div>
          </div>
        </el-form>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="categoryStore.loading" @click="handleCreate"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; min-height: 44px;">
              Créer la catégorie
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- ═══════════════════════════════════════
         MODAL MODIFICATION (responsive)
    ═══════════════════════════════════════ -->
    <!-- Mobile drawer -->
    <div class="sm:hidden">
      <el-drawer v-model="showEditModal" direction="btt" size="90%" :close-on-click-modal="false" @closed="resetEditForm" title="Modifier la catégorie">
        <template #default>
          <el-form ref="editFormRef" :model="editForm" :rules="rules" label-position="top" size="large" class="px-2">
            <el-form-item label="Nom de la catégorie" prop="name">
              <el-input v-model="editForm.name" style="border-radius: 10px;">
                <template #prefix><span>{{ getCategoryEmoji(editForm.name) }}</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="Description (optionnel)">
              <el-input v-model="editForm.description" type="textarea" :rows="3" style="border-radius: 10px;" />
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div class="flex gap-3">
            <el-button @click="showEditModal = false" size="large" style="border-radius: 10px; flex: 1; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="categoryStore.loading" @click="handleEdit"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; flex: 1; min-height: 44px;">
              Enregistrer
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>
    <!-- Desktop dialog -->
    <div class="hidden sm:block">
      <el-dialog v-model="showEditModal" title="Modifier la catégorie" width="480px" :close-on-click-modal="false" @closed="resetEditForm">
        <el-form ref="editFormRef" :model="editForm" :rules="rules" label-position="top" size="large">
          <el-form-item label="Nom de la catégorie" prop="name">
            <el-input v-model="editForm.name" style="border-radius: 10px;">
              <template #prefix><span>{{ getCategoryEmoji(editForm.name) }}</span></template>
            </el-input>
          </el-form-item>
          <el-form-item label="Description (optionnel)">
            <el-input v-model="editForm.description" type="textarea" :rows="3" style="border-radius: 10px;" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <el-button @click="showEditModal = false" size="large" style="border-radius: 10px; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="categoryStore.loading" @click="handleEdit"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; min-height: 44px;">
              Enregistrer
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { useProductStore } from '@/stores/product'
import Swal from 'sweetalert2'
import { Plus, Search, Edit, Delete, Loading } from '@element-plus/icons-vue'

const categoryStore = useCategoryStore()
const productStore = useProductStore()

// ── État ─────────────────────────────────────────
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedCat = ref(null)
const createFormRef = ref(null)
const editFormRef = ref(null)

const createForm = ref({ name: '', description: '' })
const editForm = ref({ name: '', description: '' })

const rules = {
    name: [{ required: true, message: 'Nom obligatoire', trigger: 'blur' }],
}

// ── Chargement initial ───────────────────────────
onMounted(async () => {
    await categoryStore.fetchAll()
    await productStore.fetchAll()
})

// ── Stats ────────────────────────────────────────
const categoriesWithProducts = computed(() =>
    categoryStore.categories.filter(c => getProductCount(c.name) > 0).length
)

const categoriesEmpty = computed(() =>
    categoryStore.categories.filter(c => getProductCount(c.name) === 0).length
)

// ── Filtres + pagination ─────────────────────────
const filteredCategories = computed(() => {
    const q = search.value.toLowerCase()
    if (!q) return categoryStore.categories
    return categoryStore.categories.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    )
})

const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredCategories.value.slice(start, start + pageSize.value)
})

// ── Créer ────────────────────────────────────────
async function handleCreate() {
    await createFormRef.value.validate(async (valid) => {
        if (!valid) return
        try {
            await categoryStore.create(createForm.value)
            showCreateModal.value = false
            Swal.fire({
                icon: 'success',
                title: 'Catégorie créée !',
                text: `"${createForm.value.name}" a été ajoutée avec succès.`,
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'Super !',
            })
            resetCreateForm()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: categoryStore.error || 'Impossible de créer la catégorie.',
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Ouvrir modification ──────────────────────────
function openEditModal(category) {
    selectedCat.value = category
    editForm.value = {
        name: category.name,
        description: category.description || '',
    }
    showEditModal.value = true
}

// ── Modifier ─────────────────────────────────────
async function handleEdit() {
    await editFormRef.value.validate(async (valid) => {
        if (!valid) return
        try {
            await categoryStore.update(selectedCat.value.id, editForm.value)
            showEditModal.value = false
            Swal.fire({
                icon: 'success',
                title: 'Catégorie modifiée !',
                confirmButtonColor: '#4f46e5',
                timer: 2000,
                showConfirmButton: false,
            })
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: categoryStore.error || 'Impossible de modifier la catégorie.',
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Supprimer ────────────────────────────────────
async function handleDelete(category) {
    const productCount = getProductCount(category.name)

    if (productCount > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Suppression impossible',
            html: `<p><strong>${category.name}</strong> contient <strong>${productCount} produit(s)</strong>.<br/>Réassignez ou supprimez les produits avant de supprimer cette catégorie.</p>`,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'Compris',
        })
        return
    }

    const result = await Swal.fire({
        icon: 'warning',
        title: 'Supprimer cette catégorie ?',
        html: `<p><strong>"${category.name}"</strong> sera définitivement supprimée.</p>`,
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
        await categoryStore.remove(category.id)
        Swal.fire({
            icon: 'success',
            title: 'Supprimée !',
            confirmButtonColor: '#4f46e5',
            timer: 2000,
            showConfirmButton: false,
        })
    } catch {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: categoryStore.error || 'Impossible de supprimer la catégorie.',
            confirmButtonColor: '#4f46e5',
        })
    }
}

// ── Helpers ──────────────────────────────────────
function getProductCount(categoryName) {
    return productStore.products.filter(p => p.category === categoryName).length
}

function getCategoryEmoji(name) {
    const map = {
        'Suppléments / protéines': '💪',
        'Équipements sportifs': '🏋️',
        'Vêtements de sport': '👕',
        'Boissons énergétiques': '⚡',
        'Accessoires fitness': '🎽',
        'Autre': '📦',
    }
    const key = Object.keys(map).find(k =>
        k.toLowerCase().includes((name || '').toLowerCase()) ||
        (name || '').toLowerCase().includes(k.toLowerCase().split('/')[0].trim())
    )
    return map[key] ?? '🏷️'
}

function getCategoryColor(name) {
    const colors = [
        '#4f46e5', '#7c3aed', '#db2777',
        '#059669', '#d97706', '#dc2626',
    ]
    if (!name) return colors[0]
    return colors[name.charCodeAt(0) % colors.length]
}

function resetCreateForm() {
    createForm.value = { name: '', description: '' }
    createFormRef.value?.resetFields()
}

function resetEditForm() {
    editForm.value = { name: '', description: '' }
    editFormRef.value?.resetFields()
}
</script>
