<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">

        <!-- Header -->
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Utilisateurs & Rôles</h2>
                <p class="text-[#464554] font-medium">Gestion des utilisateurs et attribution des rôles</p>
            </div>
            <el-button type="primary" size="large" @click="showCreateRoleModal = true"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2">
                    <Plus />
                </el-icon>
                Nouveau rôle
            </el-button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-indigo-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Total utilisateurs</p>
                <p class="text-3xl font-black text-[#131b2e]">{{ userStore.users.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Total rôles</p>
                <p class="text-3xl font-black text-purple-600">{{ roleStore.roles.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Utilisateurs avec rôle</p>
                <p class="text-3xl font-black text-green-600">{{ usersWithRole }}</p>
            </div>
        </div>

        <!-- Recherche -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-4 items-center">
            <el-input v-model="search" placeholder="Rechercher par email, nom ou ID..." size="large" clearable
                style="max-width: 400px;">
                <template #prefix><el-icon>
                        <Search />
                    </el-icon></template>
            </el-input>

            <span class="text-[#464554] text-sm font-medium ml-auto">
                {{ filteredUsers.length }} utilisateur(s)
            </span>
        </div>

        <!-- Loading -->
        <div v-if="userStore.loading || roleStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <!-- Tableau Utilisateurs -->
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <el-table :data="paginatedUsers" style="width: 100%" empty-text="Aucun utilisateur trouvé">

                <!-- ID -->
                <el-table-column label="ID" min-width="60" align="center">
                    <template #default="{ row }">
                        <span class="font-bold text-indigo-600">{{ row.id }}</span>
                    </template>
                </el-table-column>

                <!-- Nom -->
                <el-table-column label="Nom" min-width="180">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                                style="background-color: #4f46e5;">
                                {{ row.name?.charAt(0)?.toUpperCase() || '?' }}
                            </div>
                            <span class="font-bold text-[#131b2e]">{{ row.name || '—' }}</span>
                        </div>
                    </template>
                </el-table-column>

                <!-- Email -->
                <el-table-column label="Email" min-width="220">
                    <template #default="{ row }">
                        <span class="text-[#464554] text-sm">{{ row.email }}</span>
                    </template>
                </el-table-column>

                <!-- Rôle actuel -->
                <el-table-column label="Rôle actuel" min-width="150">
                    <template #default="{ row }">
                        <el-tag v-if="row.role" type="success" style="border-radius: 6px;">
                            {{ typeof row.role === 'string' ? row.role : (row.role.label || row.role.name) }}
                        </el-tag>
                        <el-tag v-else type="info" style="border-radius: 6px;">Aucun rôle</el-tag>
                    </template>
                </el-table-column>

                <!-- Actions -->
                <el-table-column label="Actions" min-width="180" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" plain @click="openAssignRoleModal(row)"
                            style="border-radius: 8px;">
                            <el-icon class="mr-1">
                                <Edit />
                            </el-icon>
                            Modifier rôle
                        </el-button>
                        <el-button size="small" type="danger" plain @click="confirmDeleteUser(row)"
                            style="border-radius: 8px;">
                            <el-icon class="mr-1">
                                <Delete />
                            </el-icon>
                            Supprimer
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
                :total="filteredUsers.length" layout="total, sizes, prev, pager, next" background />
        </div>

        <!-- ═══════════════════════════════════════
         MODAL ASSIGNATION DE RÔLE
    ═══════════════════════════════════════ -->
        <el-dialog v-model="showAssignRoleModal" title="Assigner un rôle" width="480px" :close-on-click-modal="false"
            @closed="closeAssignRoleModal">
            <el-form ref="assignFormRef" :model="assignForm" :rules="assignRules" label-position="top" size="large">

                <el-form-item label="Utilisateur" prop="userId">
                    <div class="bg-indigo-50 px-4 py-3 rounded-lg text-sm">
                        <p class="font-bold text-[#131b2e]">{{ selectedUser?.name || 'N/A' }}</p>
                        <p class="text-[#464554]">{{ selectedUser?.email || 'N/A' }}</p>
                    </div>
                </el-form-item>

                <el-form-item label="Rôle" prop="roleId">
                    <el-select v-model="assignForm.roleId" placeholder="Sélectionner un rôle" size="large">
                        <el-option v-for="role in roleStore.roles" :key="role.id" :label="role.label || role.name"
                            :value="role.id" />
                    </el-select>
                </el-form-item>

                <!-- Erreur API -->
                <div v-if="assignError" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {{ assignError }}
                </div>

            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="closeAssignRoleModal" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="isAssigning" @click="handleAssignRole"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Assigner le rôle
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- ═══════════════════════════════════════
         MODAL CRÉATION RÔLE
    ═══════════════════════════════════════ -->
        <el-dialog v-model="showCreateRoleModal" title="Nouveau rôle" width="480px" :close-on-click-modal="false"
            @closed="closeCreateRoleModal">
            <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-position="top" size="large">

                <el-form-item label="Nom du rôle" prop="name">
                    <el-input v-model="roleForm.name" placeholder="ex: Moniteur, Coach, etc.">
                        <template #prefix><el-icon>
                                <User />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Libellé" prop="label">
                    <el-input v-model="roleForm.label" placeholder="ex: Entraîneur personnel">
                        <template #prefix><el-icon>
                                <Document />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Description" prop="description">
                    <el-input v-model="roleForm.description" type="textarea" placeholder="Description du rôle..."
                        :rows="4" />
                </el-form-item>

                <!-- Erreur API -->
                <div v-if="roleStore.error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {{ roleStore.error }}
                </div>

            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="closeCreateRoleModal" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="roleStore.loading" @click="handleCreateRole"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Créer le rôle
                    </el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script setup>
import { useRoleStore } from '@/stores/role'
import { useUserStore } from '@/stores/user'
import {
    Delete, Document, Edit, Loading,
    Plus, Search,
    User
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Swal from 'sweetalert2'
import { computed, onMounted, ref } from 'vue'

const roleStore = useRoleStore()
const userStore = useUserStore()

// ── État ─────────────────────────────────────────
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showAssignRoleModal = ref(false)
const showCreateRoleModal = ref(false)
const assignFormRef = ref(null)
const roleFormRef = ref(null)
const selectedUser = ref(null)
const isAssigning = ref(false)
const assignError = ref('')

const assignForm = ref({
    roleId: null,
})

const roleForm = ref({
    name: '',
    label: '',
    description: '',
})

const assignRules = {
    roleId: [
        { required: true, message: 'Sélectionnez un rôle', trigger: 'change' },
    ],
}

const roleRules = {
    name: [
        { required: true, message: 'Nom obligatoire', trigger: 'blur' },
    ],
    label: [
        { required: true, message: 'Libellé obligatoire', trigger: 'blur' },
    ],
    description: [
        { required: false },
    ],
}

// ── Calculs ──────────────────────────────────────
const filteredUsers = computed(() => {
    const filtered = userStore.users.filter(user =>
        user.email?.toLowerCase().includes(search.value.toLowerCase()) ||
        user.name?.toLowerCase().includes(search.value.toLowerCase()) ||
        user.id?.toString().includes(search.value)
    )
    console.log('🔎 Utilisateurs filtrés:', filtered.length, filtered)
    return filtered
})

const usersWithRole = computed(() => {
    return userStore.users.filter(u => u.role).length
})

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredUsers.value.slice(start, end)
})

// ── Chargement initial ───────────────────────────
onMounted(async () => {
    console.log('📋 Chargement des données...')
    await userStore.fetchAll()
    await roleStore.fetchAll()

    // 🔍 Debug: Affiche les utilisateurs récupérés
    console.log('👥 Utilisateurs récupérés:', userStore.users)
    console.log('🔑 Premier utilisateur:', userStore.users[0])
    console.log('🎭 Rôles disponibles:', roleStore.roles)

    // Vérifier si les rôles sont bien présents
    userStore.users.forEach((user, index) => {
        console.log(`Utilisateur ${index} (${user.email}):`, {
            id: user.id,
            name: user.name,
            role: user.role,
            has_role: !!user.role
        })
    })
})

// ── Modales Assignation ──────────────────────────
const getRoleIdByName = (roleName) => {
    if (!roleName) return null

    // Si roleName est déjà un objet avec id
    if (typeof roleName === 'object' && roleName.id) {
        return roleName.id
    }

    // Si roleName est une string, trouver le rôle dans la liste
    if (typeof roleName === 'string') {
        const foundRole = roleStore.roles.find(r => r.name === roleName)
        console.log(`🔍 Cherche rôle: "${roleName}" → Trouvé:`, foundRole)
        return foundRole?.id || null
    }

    return null
}

const openAssignRoleModal = (user) => {
    const roleId = getRoleIdByName(user.role)

    console.log('📝 Ouverture modal assignation pour:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        role_type: typeof user.role,
        found_role_id: roleId
    })

    selectedUser.value = user
    assignForm.value = {
        roleId: roleId,
    }
    assignError.value = ''
    showAssignRoleModal.value = true
}

const closeAssignRoleModal = () => {
    showAssignRoleModal.value = false
    selectedUser.value = null
    assignForm.value = { roleId: null }
    assignError.value = ''
    assignFormRef.value?.clearValidate()
}

const handleAssignRole = async () => {
    await assignFormRef.value?.validate()

    try {
        isAssigning.value = true
        if (!selectedUser.value) return

        console.log('🔄 Assignation du rôle:', {
            roleId: assignForm.value.roleId,
            userId: selectedUser.value.id
        })

        // Appel API pour assigner le rôle
        await roleStore.assignRoleToUser(
            assignForm.value.roleId,
            selectedUser.value.id
        )

        ElMessage.success('Rôle assigné avec succès')
        closeAssignRoleModal()

        // Recharger les utilisateurs
        console.log('🔄 Rechargement des utilisateurs après assignation...')
        await userStore.fetchAll()

        console.log('✅ Utilisateurs reloadés:', userStore.users)
    } catch (error) {
        console.error('❌ Erreur assignation:', error)
        assignError.value = error.response?.data?.error || 'Erreur lors de l\'assignation'
    } finally {
        isAssigning.value = false
    }
}

// ── Modales Création Rôle ────────────────────────
const closeCreateRoleModal = () => {
    showCreateRoleModal.value = false
    roleForm.value = {
        name: '',
        label: '',
        description: '',
    }
    roleFormRef.value?.clearValidate()
}

const handleCreateRole = async () => {
    await roleFormRef.value?.validate()

    try {
        await roleStore.create(roleForm.value)
        ElMessage.success('Rôle créé avec succès')
        closeCreateRoleModal()
    } catch (error) {
        ElMessage.error(error.response?.data?.error || 'Erreur lors de la création')
    }
}

// ── Suppression Utilisateur ──────────────────────
const confirmDeleteUser = async (user) => {
    const result = await Swal.fire({
        title: 'Supprimer l\'utilisateur ?',
        html: `<p class="text-[#464554]">Êtes-vous sûr de vouloir supprimer <strong>${user.name}</strong> (${user.email}) ?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#ef4444',
    })

    if (result.isConfirmed) {
        try {
            await userStore.remove(user.id)
            ElMessage.success('Utilisateur supprimé avec succès')
        } catch (error) {
            ElMessage.error('Erreur lors de la suppression')
        }
    }
}
</script>
