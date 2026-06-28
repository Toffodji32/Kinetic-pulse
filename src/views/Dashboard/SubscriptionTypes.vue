<template>
    <div>
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Types d'abonnement</h2>
                <p class="text-[#464554] font-medium">Créez et gérez vos formules d'abonnement</p>
            </div>
            <el-button type="primary" size="large" @click="openCreate"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2"><Plus /></el-icon>
                Nouveau type
            </el-button>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl"><Loading /></el-icon>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="t in types" :key="t.id"
                class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="font-bold text-[#131b2e] text-lg">{{ t.name }}</h3>
                        <p class="text-2xl font-black text-indigo-600 mt-1">{{ formatPrice(t.price) }}</p>
                    </div>
                    <el-tag>{{ t.durationDays }} jours</el-tag>
                </div>
                <div class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <el-button size="small" @click="openEdit(t)"
                        style="border-radius: 8px;">
                        <el-icon class="mr-1"><Edit /></el-icon>
                        Modifier
                    </el-button>
                    <el-button size="small" type="danger" plain @click="handleDelete(t)"
                        style="border-radius: 8px;">
                        <el-icon class="mr-1"><Delete /></el-icon>
                        Supprimer
                    </el-button>
                </div>
            </div>

            <div v-if="types.length === 0" class="col-span-full text-center py-20 text-gray-400">
                <span class="material-symbols-outlined text-4xl">card_membership</span>
                <p class="mt-2">Aucun type d'abonnement. Créez-en un !</p>
            </div>
        </div>

        <el-dialog v-model="showDialog" :title="isEditing ? 'Modifier le type' : 'Nouveau type'" width="480px"
            :close-on-click-modal="false" @closed="resetForm">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
                <el-form-item label="Nom" prop="name">
                    <el-input v-model="form.name" placeholder="Ex: Mensuel, Annuel, Trimestriel..." />
                </el-form-item>
                <el-form-item label="Prix (FCFA)" prop="price">
                    <el-input-number v-model="form.price" :min="0" :step="1000" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Durée (en jours)" prop="durationDays">
                    <el-input-number v-model="form.durationDays" :min="1" :step="30" style="width: 100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showDialog = false" size="large" style="border-radius: 10px;">Annuler</el-button>
                <el-button type="primary" size="large" :loading="saving" @click="handleSave"
                    style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                    {{ isEditing ? 'Modifier' : 'Créer' }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSubscriptionTypeStore } from '@/stores/subscriptionType'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const store = useSubscriptionTypeStore()
const loading = ref(true)
const saving = ref(false)
const types = ref([])
const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)

const form = ref({ name: '', price: 15000, durationDays: 30 })

const rules = {
    name: [{ required: true, message: 'Le nom est requis', trigger: 'blur' }],
    price: [{ required: true, message: 'Le prix est requis', trigger: 'blur' }],
    durationDays: [{ required: true, message: 'La durée est requise', trigger: 'blur' }],
}

const formatPrice = (val) => {
    return new Intl.NumberFormat('fr-FR').format(val ?? 0) + ' FCFA'
}

const resetForm = () => {
    form.value = { name: '', price: 15000, durationDays: 30 }
    isEditing.value = false
    editingId.value = null
}

const openCreate = () => {
    resetForm()
    showDialog.value = true
}

const openEdit = (t) => {
    form.value = { name: t.name, price: t.price, durationDays: t.durationDays }
    isEditing.value = true
    editingId.value = t.id
    showDialog.value = true
}

const handleSave = async () => {
    await formRef.value.validate(async (valid) => {
        if (!valid) return
        saving.value = true
        try {
            if (isEditing.value) {
                await store.update(editingId.value, form.value)
                ElMessage.success('Type modifié')
            } else {
                await store.create(form.value)
                ElMessage.success('Type créé')
            }
            types.value = store.types
            showDialog.value = false
        } catch {
            ElMessage.error(store.error || 'Erreur')
        } finally {
            saving.value = false
        }
    })
}

const handleDelete = async (t) => {
    try {
        await ElMessageBox.confirm(`Supprimer "${t.name}" ?`, 'Confirmation', {
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            type: 'warning',
            confirmButtonClass: 'el-button--danger',
        })
        await store.remove(t.id)
        types.value = store.types
        ElMessage.success('Type supprimé')
    } catch {}
}

onMounted(async () => {
    await store.fetchAll()
    types.value = store.types
    loading.value = false
})
</script>
