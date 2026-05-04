<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">

        <!-- Header -->
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Utilisateurs</h2>
                <p class="text-[#464554] font-medium">Gestion des comptes admin et réceptionnistes</p>
            </div>
            <el-button type="primary" size="large" @click="showModal = true"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2">
                    <Plus />
                </el-icon>
                Nouveau compte
            </el-button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-indigo-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Total utilisateurs</p>
                <p class="text-3xl font-black text-[#131b2e]">{{ userStore.users.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Admins</p>
                <p class="text-3xl font-black text-purple-600">{{ admins.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-teal-500">
                <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-1">Réceptionnistes</p>
                <p class="text-3xl font-black text-teal-600">{{ receptionists.length }}</p>
            </div>
        </div>

        <!-- Recherche -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-4 items-center">
            <el-input v-model="search" placeholder="Rechercher par nom, email..." size="large" clearable
                style="max-width: 400px;">
                <template #prefix><el-icon>
                        <Search />
                    </el-icon></template>
            </el-input>

            <el-select v-model="filterRole" placeholder="Tous les rôles" size="large" clearable style="width: 200px;">
                <el-option v-for="role in roleStore.roles.filter(r => r.name !== 'ROLE_CLIENT')" :key="role.id"
                    :label="role.label" :value="role.name" />

            </el-select>

            <span class="text-[#464554] text-sm font-medium ml-auto">
                {{ filteredUsers.length }} utilisateur(s)
            </span>
        </div>

        <!-- Loading -->
        <div v-if="userStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <!-- Tableau -->
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <el-table :data="paginatedUsers" style="width: 100%" empty-text="Aucun utilisateur trouvé">

                <!-- Utilisateur -->
                <el-table-column label="Utilisateur" min-width="240">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 py-2">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                                :style="{ backgroundColor: getAvatarColor(row.name) }">
                                {{ row.name?.charAt(0)?.toUpperCase() }}
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <p class="font-bold text-[#131b2e]">{{ row.name }}</p>
                                    <!-- Badge "Vous" -->
                                    <el-tag v-if="row.id === authStore.user?.id" size="small" type="info" round>
                                        Vous
                                    </el-tag>
                                </div>
                                <p class="text-xs text-[#464554]">{{ row.email }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <!-- Rôle -->
                <el-table-column label="Rôle" min-width="160">
                    <template #default="{ row }">
                        <el-tag :type="row.roles?.includes('ROLE_ADMIN') ? 'warning' : 'success'" size="small" round>
                            {{ row.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Réceptionniste' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- Créé le -->
                <el-table-column label="Créé le" min-width="150">
                    <template #default="{ row }">
                        <span class="text-[#464554] text-sm">{{ formatDate(row.createdAt) }}</span>
                    </template>
                </el-table-column>

                <!-- Actions -->
                <el-table-column label="Actions" min-width="120" align="center">
                    <template #default="{ row }">
                        <el-button v-if="row.id !== authStore.user?.id" size="small" type="danger" plain
                            @click="confirmDelete(row)" style="border-radius: 8px;">
                            <el-icon class="mr-1">
                                <Delete />
                            </el-icon>
                            Supprimer
                        </el-button>
                        <span v-else class="text-xs text-[#464554] opacity-50 font-medium">
                            Compte actif
                        </span>
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
         MODAL CRÉATION COMPTE
    ═══════════════════════════════════════ -->
        <el-dialog v-model="showModal" title="Nouveau compte" width="480px" :close-on-click-modal="false"
            @closed="closeModal">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">

                <el-form-item label="Nom complet" prop="name">
                    <el-input v-model="form.name" placeholder="Jean Dupont">
                        <template #prefix><el-icon>
                                <User />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Email" prop="email">
                    <el-input v-model="form.email" type="email" placeholder="jean@gym.com">
                        <template #prefix><el-icon>
                                <Message />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Mot de passe" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="••••••••" show-password>
                        <template #prefix><el-icon>
                                <Lock />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <!-- Dans le formulaire de création, remplacer les radio buttons hardcodés -->
                <el-form-item label="Rôle" prop="role">
                    <el-radio-group v-model="form.role" size="large" class="w-full">
                        <el-radio-button v-for="role in roleStore.roles.filter(r => r.name !== 'ROLE_CLIENT')"
                            :key="role.id" :value="role.name" style="flex: 1; text-align: center;">
                            {{ role.label }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <!-- Erreur API -->
                <div v-if="userStore.error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {{ userStore.error }}
                </div>

            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="closeModal" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="userStore.loading" @click="handleCreate"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Créer le compte
                    </el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'
import { computed, onMounted, ref } from 'vue'
// Dans script setup de Users.vue
import { useRoleStore } from '@/stores/role'
import {
    Delete, Loading,
    Lock,
    Message,
    Plus, Search,
    User
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const roleStore = useRoleStore()

// ── État ─────────────────────────────────────────
const search = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showModal = ref(false)
const formRef = ref(null)

const form = ref({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
})

const rules = {
    name: [
        { required: true, message: 'Nom obligatoire', trigger: 'blur' },
    ],
    email: [
        { required: true, message: 'Email obligatoire', trigger: 'blur' },
        { type: 'email', message: 'Format invalide', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Mot de passe obligatoire', trigger: 'blur' },
        { min: 6, message: 'Minimum 6 caractères', trigger: 'blur' },
    ],
    role: [
        { required: true, message: 'Rôle obligatoire', trigger: 'change' },
    ],
}

// ── Chargement initial ───────────────────────────
onMounted(async () => {
    // Charger les rôles EN PREMIER pour que le formulaire les affiche
    await roleStore.fetchAll()
    await userStore.fetchAll()
    // Initialiser le rôle par défaut du formulaire avec le premier rôle non-client
    if (roleStore.roles.length > 0) {
        const defaultRole = roleStore.roles.find(r => r.name !== 'ROLE_CLIENT')
        if (defaultRole) form.value.role = defaultRole.name
    }
})

// ── Computed ─────────────────────────────────────
const admins = computed(() =>
    userStore.users.filter(u => u.roles?.includes('ROLE_ADMIN'))
)

const receptionists = computed(() =>
    userStore.users.filter(u => !u.roles?.includes('ROLE_ADMIN'))
)

const filteredUsers = computed(() => {
    let list = userStore.users
    const q = search.value.toLowerCase()

    if (q) list = list.filter(u =>
        `${u.name} ${u.email}`.toLowerCase().includes(q)
    )
    if (filterRole.value) {
        // Vérifier si l'utilisateur a le rôle sélectionné
        list = list.filter(u =>
            u.roles?.includes(filterRole.value)
        )
    }
    return list
})

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredUsers.value.slice(start, start + pageSize.value)
})

// ── Créer un compte ──────────────────────────────
async function handleCreate() {
    await formRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            await userStore.create(form.value)
            // Recharger les rôles pour s'assurer que les nouvelles données sont à jour
            await roleStore.fetchAll()
            closeModal()

            Swal.fire({
                icon: 'success',
                title: 'Compte créé !',
                html: `<p>Le compte de <strong>${form.value.name}</strong> a été créé avec succès.</p>`,
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'Super !',
            })
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: userStore.error || 'Impossible de créer le compte.',
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Confirmer suppression ────────────────────────
async function confirmDelete(user) {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Supprimer ce compte ?',
        html: `<p>Le compte de <strong>${user.name}</strong> sera définitivement supprimé.</p>`,
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
        await userStore.remove(user.id)

        Swal.fire({
            icon: 'success',
            title: 'Compte supprimé !',
            confirmButtonColor: '#4f46e5',
            timer: 2000,
            showConfirmButton: false,
        })
    } catch {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: userStore.error || 'Impossible de supprimer le compte.',
            confirmButtonColor: '#4f46e5',
        })
    }
}

// ── Fermer modal + reset ─────────────────────────
function closeModal() {
    showModal.value = false
    form.value = { name: '', email: '', password: '', role: 'ROLE_USER' }
    formRef.value?.resetFields()
}

// ── Helpers ──────────────────────────────────────
function formatDate(date) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

function getAvatarColor(name) {
    const colors = [
        '#4f46e5', '#7c3aed', '#db2777', '#059669',
        '#d97706', '#dc2626', '#0284c7', '#65a30d',
    ]
    if (!name) return colors[0]
    return colors[name.charCodeAt(0) % colors.length]
}
</script>