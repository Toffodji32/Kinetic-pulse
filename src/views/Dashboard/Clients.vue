<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">

        <!-- Header -->
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Clients</h2>
                <p class="text-[#464554] font-medium">Gestion de tous les membres de la salle</p>
            </div>
            <el-button type="primary" size="large" @click="showCreateModal = true"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2">
                    <Plus />
                </el-icon>
                Nouveau client
            </el-button>
        </div>

        <!-- Barre de recherche -->
        <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-4 items-center">
            <el-input v-model="search" placeholder="Rechercher par nom, email..." size="large" clearable
                style="max-width: 400px;">
                <template #prefix>
                    <el-icon>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
            <span class="text-[#464554] text-sm font-medium ml-auto">
                {{ filteredClients.length }} client(s) trouvé(s)
            </span>
        </div>

        <!-- Loading -->
        <div v-if="clientStore.loading" class="flex justify-center items-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <!-- Tableau -->
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <el-table :data="paginatedClients" style="width: 100%" row-class-name="hover:bg-indigo-50/30"
                empty-text="Aucun client trouvé">
                <!-- Photo -->
                <el-table-column label="Client" min-width="220">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 py-2">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                                :style="{ backgroundColor: getAvatarColor(row.firstName) }">
                                {{ row.firstName?.charAt(0) }}{{ row.lastName?.charAt(0) }}
                            </div>
                            <div>
                                <p class="font-bold text-[#131b2e]">{{ row.firstName }} {{ row.lastName }}</p>
                                <p class="text-xs text-[#464554]">{{ row.email }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <!-- Téléphone -->
                <el-table-column label="Téléphone" prop="phone" min-width="140">
                    <template #default="{ row }">
                        <span class="text-[#464554]">{{ row.phone || '—' }}</span>
                    </template>
                </el-table-column>

                <!-- Date inscription -->
                <el-table-column label="Inscrit le" min-width="130">
                    <template #default="{ row }">
                        <span class="text-[#464554] text-sm">{{ formatDate(row.registrationDate) }}</span>
                    </template>
                </el-table-column>

                <!-- QR Code -->
                <el-table-column label="QR Code" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.qrCode" type="success" size="small" round>Généré</el-tag>
                        <el-tag v-else type="info" size="small" round>—</el-tag>
                    </template>
                </el-table-column>

                <!-- Actions -->
                <el-table-column label="Actions" min-width="160" align="center">
                    <template #default="{ row }">
                        <div class="flex gap-2 justify-center">
                            <el-button size="small" @click="openDetail(row.id)"
                                style="background-color: #e0e7ff; color: #4f46e5; border: none; border-radius: 8px; font-weight: 600;">
                                <el-icon class="mr-1">
                                    <View />
                                </el-icon>
                                Voir
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

        <!-- Pagination -->
        <div class="flex justify-center">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
                :total="filteredClients.length" layout="total, sizes, prev, pager, next" background />
        </div>

        <!-- ═══════════════════════════════════════
         MODAL CRÉATION CLIENT
    ═══════════════════════════════════════ -->
        <el-dialog v-model="showCreateModal" title="Nouveau client" width="520px" border-radius="16px"
            :close-on-click-modal="false" @closed="resetForm">
            <el-form ref="createFormRef" :model="form" :rules="rules" label-position="top" size="large">
                <div class="grid grid-cols-2 gap-4">
                    <el-form-item label="Prénom" prop="firstName">
                        <el-input v-model="form.firstName" placeholder="Jean" />
                    </el-form-item>
                    <el-form-item label="Nom" prop="lastName">
                        <el-input v-model="form.lastName" placeholder="Dupont" />
                    </el-form-item>
                </div>

                <el-form-item label="Email" prop="email">
                    <el-input v-model="form.email" type="email" placeholder="jean@email.com">
                        <template #prefix><el-icon>
                                <Message />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Téléphone" prop="phone">
                    <el-input v-model="form.phone" placeholder="+229 00 00 00 00">
                        <template #prefix><el-icon>
                                <Phone />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <!-- Upload photo -->
                <el-form-item label="Photo (optionnel)">
                    <el-upload class="w-full" action="#" :auto-upload="false" :on-change="handlePhotoChange"
                        :show-file-list="false" accept="image/*">
                        <el-button plain style="width: 100%; border-radius: 8px;">
                            <el-icon class="mr-2">
                                <Upload />
                            </el-icon>
                            {{ form.photo ? form.photo.name : 'Choisir une photo' }}
                        </el-button>
                    </el-upload>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="clientStore.loading" @click="handleCreate"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Créer le client
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- ═══════════════════════════════════════
     MODAL MODIFICATION CLIENT
═══════════════════════════════════════ -->
        <el-dialog v-model="showEditModal" title="Modifier le client" width="520px" :close-on-click-modal="false"
            @closed="resetEditForm">
            <el-form ref="editFormRef" :model="editForm" :rules="rules" label-position="top" size="large">
                <div class="grid grid-cols-2 gap-4">
                    <el-form-item label="Prénom" prop="firstName">
                        <el-input v-model="editForm.firstName" placeholder="Jean" />
                    </el-form-item>
                    <el-form-item label="Nom" prop="lastName">
                        <el-input v-model="editForm.lastName" placeholder="Dupont" />
                    </el-form-item>
                </div>

                <el-form-item label="Email" prop="email">
                    <el-input v-model="editForm.email" type="email" placeholder="jean@email.com">
                        <template #prefix><el-icon>
                                <Message />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <el-form-item label="Téléphone" prop="phone">
                    <el-input v-model="editForm.phone" placeholder="+229 00 00 00 00">
                        <template #prefix><el-icon>
                                <Phone />
                            </el-icon></template>
                    </el-input>
                </el-form-item>

                <!-- Nouvelle photo -->
                <el-form-item label="Changer la photo (optionnel)">
                    <el-upload class="w-full" action="#" :auto-upload="false" :on-change="handleEditPhotoChange"
                        :show-file-list="false" accept="image/*">
                        <el-button plain style="width: 100%; border-radius: 8px;">
                            <el-icon class="mr-2">
                                <Upload />
                            </el-icon>
                            {{ editForm.photo ? editForm.photo.name : 'Choisir une nouvelle photo' }}
                        </el-button>
                    </el-upload>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="showEditModal = false" size="large" style="border-radius: 10px;">
                        Annuler
                    </el-button>
                    <el-button type="primary" size="large" :loading="clientStore.loading" @click="handleEdit"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Enregistrer
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- ═══════════════════════════════════════
        DRAWER DÉTAIL CLIENT
    ═══════════════════════════════════════ -->
        <el-drawer v-model="showDetail" direction="rtl" size="480px" :with-header="false">
            <div v-if="detailLoading" class="flex justify-center items-center h-full">
                <el-icon class="animate-spin text-indigo-600 text-4xl">
                    <Loading />
                </el-icon>
            </div>

            <div v-else-if="selectedClient" class="p-6 h-full overflow-y-auto">

                <!-- Avatar + nom -->
                <div class="flex flex-col items-center mb-8 pt-4">
                    <div v-if="!selectedClient.photo"
                        class="w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl text-white mb-4"
                        :style="{ backgroundColor: getAvatarColor(selectedClient.firstName) }">
                        {{ selectedClient.firstName?.charAt(0) }}{{ selectedClient.lastName?.charAt(0) }}
                    </div>
                    <img v-else :src="mediaUrl(selectedClient.photo)"
                        class="w-24 h-24 rounded-full object-cover mb-4 border-4 border-indigo-100" />
                    <h2 class="text-2xl font-black text-[#131b2e]">
                        {{ selectedClient.firstName }} {{ selectedClient.lastName }}
                    </h2>
                    <p class="text-[#464554]">{{ selectedClient.email }}</p>
                </div>

                <!-- Infos -->
                <div class="space-y-4 mb-8">
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between items-center">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Téléphone</span>
                        <span class="font-bold text-[#131b2e]">{{ selectedClient.phone || '—' }}</span>
                    </div>
                    <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between items-center">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Inscrit le</span>
                        <span class="font-bold text-[#131b2e]">{{ formatDate(selectedClient.registrationDate) }}</span>
                    </div>
                </div>

                <!-- Abonnement -->
                <div class="mb-8">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-3">Abonnement</h3>
                    <div v-if="selectedClient.subscription"
                        class="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm">
                        <div class="flex justify-between items-start mb-3">
                            <span class="font-black text-[#131b2e] text-lg">{{ selectedClient.subscription.type
                                }}</span>
                            <el-tag :type="selectedClient.subscription.status === 'Actif' ? 'success' : 'danger'"
                                size="large" round>
                                {{ selectedClient.subscription.status }}
                            </el-tag>
                        </div>
                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p class="text-[#464554] text-xs">Début</p>
                                <p class="font-bold">{{ selectedClient.subscription.startDate }}</p>
                            </div>
                            <div>
                                <p class="text-[#464554] text-xs">Fin</p>
                                <p class="font-bold">{{ selectedClient.subscription.endDate }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="bg-[#f2f3ff] rounded-xl p-4 text-center">
                        <p class="text-[#464554] text-sm font-medium">Aucun abonnement actif</p>
                        <el-button type="primary" size="small" class="mt-2"
                            style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 8px;">
                            + Ajouter un abonnement
                        </el-button>
                    </div>
                </div>

                <!-- QR Code -->
                <div v-if="selectedClient.qrCode" class="mb-8">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-3">QR Code</h3>
                    <div class="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
                        <img :src="mediaUrl(selectedClient.qrCode)"
                            class="w-40 h-40 object-contain" alt="QR Code" />
                        <p class="text-xs text-[#464554] mt-2">Scanner pour valider l'accès</p>
                    </div>
                </div>

                <!-- Bouton modifier -->
                <el-button type="primary" size="large" class="w-full mb-3"
                    style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
                    @click="openEditModal">
                    <el-icon class="mr-2">
                        <Edit />
                    </el-icon>
                    Modifier ce client
                </el-button>

                <!-- Bouton supprimer -->
                <el-button type="danger" size="large" class="w-full" plain
                    style="border-radius: 12px; font-weight: 700;" @click="handleDelete(selectedClient)">
                    <el-icon class="mr-2">
                        <Delete />
                    </el-icon>
                    Supprimer ce client
                </el-button>

            </div>
        </el-drawer>

    </div>
</template>

<script setup>
import { useClientStore } from '@/stores/client'
import {
    Delete,
    Edit,
    Loading,
    Message, Phone,
    Plus, Search,
    Upload,
    View
} from '@element-plus/icons-vue'
import Swal from 'sweetalert2'
import { mediaUrl } from '@/utils/media'
import { computed, onMounted, ref } from 'vue'

const clientStore = useClientStore()

// ── État ─────────────────────────────────────────
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showCreateModal = ref(false)
const showDetail = ref(false)
const selectedClient = ref(null)
const detailLoading = ref(false)
const createFormRef = ref(null)

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photo: null,
})

// ── Nouveaux états pour la modification ──────────
const showEditModal = ref(false)
const editFormRef = ref(null)
const editForm = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photo: null,
})

// ── Règles de validation ─────────────────────────
const rules = {
    firstName: [{ required: true, message: 'Prénom obligatoire', trigger: 'blur' }],
    lastName: [{ required: true, message: 'Nom obligatoire', trigger: 'blur' }],
    email: [
        { required: true, message: 'Email obligatoire', trigger: 'blur' },
        { type: 'email', message: 'Format invalide', trigger: 'blur' },
    ],
    phone: [{ required: true, message: 'Téléphone obligatoire', trigger: 'blur' }],
}

// ── Chargement initial ───────────────────────────
onMounted(() => clientStore.fetchAll())

// ── Recherche + pagination ───────────────────────
const filteredClients = computed(() => {
    const q = search.value.toLowerCase()
    if (!q) return clientStore.clients
    return clientStore.clients.filter(c =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q)
    )
})

const paginatedClients = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredClients.value.slice(start, start + pageSize.value)
})

// ── Créer un client ──────────────────────────────
async function handleCreate() {
    await createFormRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            console.log('📋 Données envoyées à l\'API:', form.value)

            const created = await clientStore.create(form.value)

            console.log('✅ Réponse complète du serveur:', created)
            console.log('📧 Email envoyé?:', created.emailSent)
            console.log('🔍 Détails de la réponse:', {
                clientId: created.id,
                email: created.email,
                emailSent: created.emailSent,
                qrCode: created.qrCode,
                emailError: created.emailError,
                message: created.message,
            })

            showCreateModal.value = false

            // ← message différent selon si l'email a été envoyé
            const emailMsg = created.emailSent
                ? `<p class="text-sm text-green-600 mt-2">✅ QR code envoyé par email à <strong>${form.value.email}</strong></p>`
                : `<p class="text-sm text-amber-600 mt-2">⚠️ Client créé mais l'email n'a pas pu être envoyé.${created.emailError ? ` <br/><small>Erreur: ${created.emailError}</small>` : ''}</p>`

            Swal.fire({
                icon: 'success',
                title: 'Client créé !',
                html: `<p>${form.value.firstName} ${form.value.lastName} a été ajouté avec succès.</p>${emailMsg}`,
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'Super !',
                borderRadius: '16px',
            })

            // ← ouvre directement le détail avec le QR code
            openDetail(created.id)

            resetForm()
        } catch (err) {
            console.error('❌ Erreur création client:', err)
            console.error('📦 Détails de l\'erreur:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                erreur_api: err.response?.data?.error,
                erreur_mail: err.response?.data?.emailError,
                full_error: err,
            })

            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                html: `<p>${clientStore.error || 'Impossible de créer le client.'}</p>${err.response?.data?.emailError ? `<p class="text-sm text-red-600 mt-2">📧 Erreur mail: ${err.response.data.emailError}</p>` : ''}`,
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Ouvrir le modal de modification ─────────────
// pré-remplit le formulaire avec les données du client sélectionné
function openEditModal() {
    editForm.value = {
        firstName: selectedClient.value.firstName,
        lastName: selectedClient.value.lastName,
        email: selectedClient.value.email,
        phone: selectedClient.value.phone,
        photo: null, // on ne pré-charge pas la photo
    }
    showEditModal.value = true
}

// ── Soumettre la modification ────────────────────
async function handleEdit() {
    await editFormRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            await clientStore.update(selectedClient.value.id, editForm.value)
            console.log('ID envoyé:', selectedClient.value.id)
            console.log('Données envoyées:', editForm.value)


            // recharge le détail avec les nouvelles données
            await clientStore.fetchOne(selectedClient.value.id)
            selectedClient.value = clientStore.client

            showEditModal.value = false

            Swal.fire({
                icon: 'success',
                title: 'Client modifié !',
                text: `${editForm.value.firstName} ${editForm.value.lastName} a été mis à jour.`,
                confirmButtonColor: '#4f46e5',
                timer: 2000,
                showConfirmButton: false,
            })
        } catch (err) {
            console.error('Erreur modification client:', err)
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: clientStore.error || 'Impossible de modifier le client.',
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Upload photo modification ────────────────────
function handleEditPhotoChange(file) {
    editForm.value.photo = file.raw
}

// ── Reset formulaire modification ───────────────
function resetEditForm() {
    editForm.value = { firstName: '', lastName: '', email: '', phone: '', photo: null }
    editFormRef.value?.resetFields()
}

// ── Ouvrir le détail ─────────────────────────────
async function openDetail(id) {
    showDetail.value = true
    detailLoading.value = true
    selectedClient.value = null
    try {
        await clientStore.fetchOne(id)
        selectedClient.value = clientStore.client
    } finally {
        detailLoading.value = false
    }
}

// ── Supprimer un client ──────────────────────────
async function handleDelete(client) {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Supprimer ce client ?',
        html: `<p>Le compte de <strong>${client.firstName} ${client.lastName}</strong> sera définitivement supprimé.</p>`,
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
        await clientStore.remove(client.id)
        showDetail.value = false

        Swal.fire({
            icon: 'success',
            title: 'Supprimé !',
            text: 'Le client a été supprimé avec succès.',
            confirmButtonColor: '#4f46e5',
            timer: 2000,
            showConfirmButton: false,
        })
    } catch {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: clientStore.error || 'Impossible de supprimer le client.',
            confirmButtonColor: '#4f46e5',
        })
    }
}

// ── Upload photo ─────────────────────────────────
function handlePhotoChange(file) {
    form.value.photo = file.raw
}

// ── Reset formulaire ─────────────────────────────
function resetForm() {
    form.value = { firstName: '', lastName: '', email: '', phone: '', photo: null }
    createFormRef.value?.resetFields()
}

// ── Couleur avatar générée depuis le prénom ──────
function getAvatarColor(name) {
    const colors = [
        '#4f46e5', '#7c3aed', '#db2777', '#059669',
        '#d97706', '#dc2626', '#0284c7', '#65a30d',
    ]
    if (!name) return colors[0]
    return colors[name.charCodeAt(0) % colors.length]
}

// ── Formater date ────────────────────────────────
function formatDate(date) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}
</script>