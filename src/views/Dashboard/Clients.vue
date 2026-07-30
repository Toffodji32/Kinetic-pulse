<template>
  <div class="bg-[#faf8ff] min-h-screen p-4 sm:p-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black font-headline tracking-tight text-indigo-600">Clients</h2>
        <p class="text-[#464554] font-medium text-sm sm:text-base">Gestion de tous les membres de la salle</p>
      </div>
      <el-button type="primary" size="large" @click="showCreateModal = true" class="hidden sm:inline-flex"
        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700; padding: 12px 20px;">
        <span class="material-symbols-outlined text-lg mr-1">person_add</span>
        Nouveau client
      </el-button>
    </div>

    <!-- Barre de recherche -->
    <div class="bg-white rounded-2xl p-3 sm:p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
      <el-input v-model="search" placeholder="Rechercher par nom, email..." size="large" clearable style="max-width: 100%; width: 100%; sm:max-width: 400px; sm:width: auto;">
        <template #prefix><span class="material-symbols-outlined text-lg text-[#464554]">search</span></template>
      </el-input>
      <span class="text-[#464554] text-sm font-medium sm:ml-auto">{{ filteredClients.length }} client(s) trouvé(s)</span>
    </div>

    <!-- Loading -->
    <div v-if="clientStore.loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-100 rounded-full"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-100 rounded w-32 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-48"></div>
        </div>
      </div>
    </div>

    <template v-else>

      <!-- Mobile cards -->
      <div class="sm:hidden space-y-3 mb-6">
        <div v-for="client in paginatedClients" :key="client.id" @click="openDetail(client.id)"
          class="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer">
          <div class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" :style="{ backgroundColor: getAvatarColor(client.firstName) }">
            {{ client.firstName?.charAt(0) }}{{ client.lastName?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-[#131b2e] text-sm truncate">{{ client.firstName }} {{ client.lastName }}</p>
            <p class="text-xs text-[#464554] truncate">{{ client.email }}</p>
          </div>
          <span class="material-symbols-outlined text-[#464554]">chevron_right</span>
        </div>
        <!-- Empty mobile -->
        <div v-if="paginatedClients.length === 0" class="flex flex-col items-center py-12">
          <span class="material-symbols-outlined text-5xl text-gray-200 mb-3">people</span>
          <p class="text-[#464554] font-medium mb-3">Aucun client trouvé</p>
          <el-button type="primary" @click="showCreateModal = true"
            style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700; padding: 12px 20px;">
            <span class="material-symbols-outlined text-lg mr-1">person_add</span>
            Nouveau client
          </el-button>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <el-table :data="paginatedClients" style="width: 100%" row-class-name="hover:bg-indigo-50/30" empty-text="Aucun client trouvé">
          <el-table-column label="Client" min-width="220">
            <template #default="{ row }">
              <div class="flex items-center gap-3 py-2">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" :style="{ backgroundColor: getAvatarColor(row.firstName) }">
                  {{ row.firstName?.charAt(0) }}{{ row.lastName?.charAt(0) }}
                </div>
                <div>
                  <p class="font-bold text-[#131b2e]">{{ row.firstName }} {{ row.lastName }}</p>
                  <p class="text-xs text-[#464554]">{{ row.email }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Téléphone" prop="phone" min-width="140">
            <template #default="{ row }">
              <span class="text-[#464554]">{{ row.phone || '—' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Inscrit le" min-width="130">
            <template #default="{ row }">
              <span class="text-[#464554] text-sm">{{ formatDate(row.registrationDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="QR Code" min-width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.qrCode" type="success" size="small" round>Généré</el-tag>
              <el-tag v-else type="info" size="small" round>—</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions" min-width="160" align="center">
            <template #default="{ row }">
              <div class="flex gap-2 justify-center">
                <el-button size="small" @click="openDetail(row.id)" style="background-color: #e0e7ff; color: #4f46e5; border: none; border-radius: 8px; font-weight: 600; min-height: 36px; min-width: 44px;">
                  <span class="material-symbols-outlined text-sm mr-1">visibility</span>
                  Voir
                </el-button>
                <el-button size="small" type="danger" plain @click="handleDelete(row)" style="border-radius: 8px; min-height: 36px; min-width: 44px;">
                  <span class="material-symbols-outlined text-sm">delete</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </template>

    <!-- Pagination -->
    <div class="flex justify-center">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
        :total="filteredClients.length" layout="total, sizes, prev, pager, next" background />
    </div>

    <!-- Mobile FAB -->
    <button @click="showCreateModal = true"
      class="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
      <span class="material-symbols-outlined text-2xl">add</span>
    </button>

    <!-- ═══════════════════════════════════════
         MODAL CRÉATION CLIENT (responsive)
    ═══════════════════════════════════════ -->
    <!-- Mobile drawer -->
    <div class="sm:hidden">
      <el-drawer v-model="showCreateModal" direction="btt" size="90%" :close-on-click-modal="false" @closed="resetForm" title="Nouveau client">
        <template #default>
          <el-form ref="createFormRef" :model="form" :rules="rules" label-position="top" size="large" class="px-2">
            <div class="grid grid-cols-2 gap-3">
              <el-form-item label="Prénom" prop="firstName">
                <el-input v-model="form.firstName" placeholder="Jean" style="border-radius: 10px;" />
              </el-form-item>
              <el-form-item label="Nom" prop="lastName">
                <el-input v-model="form.lastName" placeholder="Dupont" style="border-radius: 10px;" />
              </el-form-item>
            </div>
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" type="email" placeholder="jean@email.com" style="border-radius: 10px;">
                <template #prefix><span class="material-symbols-outlined text-lg">mail</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="Téléphone" prop="phone">
              <el-input v-model="form.phone" placeholder="+229 00 00 00 00" style="border-radius: 10px;">
                <template #prefix><span class="material-symbols-outlined text-lg">phone</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="Photo (optionnel)">
              <el-upload class="w-full" action="#" :auto-upload="false" :on-change="handlePhotoChange" :show-file-list="false" accept="image/*">
                <el-button plain style="width: 100%; border-radius: 10px; min-height: 44px;">
                  <span class="material-symbols-outlined text-lg mr-1">upload</span>
                  {{ form.photo ? form.photo.name : 'Choisir une photo' }}
                </el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div class="flex gap-3">
            <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px; flex: 1; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="clientStore.loading" @click="handleCreate"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; flex: 1; min-height: 44px;">
              Créer
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>
    <!-- Desktop dialog -->
    <div class="hidden sm:block">
      <el-dialog v-model="showCreateModal" title="Nouveau client" width="520px" border-radius="16px" :close-on-click-modal="false" @closed="resetForm">
        <el-form ref="createFormRef" :model="form" :rules="rules" label-position="top" size="large">
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="Prénom" prop="firstName">
              <el-input v-model="form.firstName" placeholder="Jean" style="border-radius: 10px;" />
            </el-form-item>
            <el-form-item label="Nom" prop="lastName">
              <el-input v-model="form.lastName" placeholder="Dupont" style="border-radius: 10px;" />
            </el-form-item>
          </div>
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" type="email" placeholder="jean@email.com" style="border-radius: 10px;">
              <template #prefix><span class="material-symbols-outlined text-lg">mail</span></template>
            </el-input>
          </el-form-item>
          <el-form-item label="Téléphone" prop="phone">
            <el-input v-model="form.phone" placeholder="+229 00 00 00 00" style="border-radius: 10px;">
              <template #prefix><span class="material-symbols-outlined text-lg">phone</span></template>
            </el-input>
          </el-form-item>
          <el-form-item label="Photo (optionnel)">
            <el-upload class="w-full" action="#" :auto-upload="false" :on-change="handlePhotoChange" :show-file-list="false" accept="image/*">
              <el-button plain style="width: 100%; border-radius: 10px; min-height: 44px;">
                <span class="material-symbols-outlined text-lg mr-1">upload</span>
                {{ form.photo ? form.photo.name : 'Choisir une photo' }}
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="clientStore.loading" @click="handleCreate"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; min-height: 44px;">
              Créer le client
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- ═══════════════════════════════════════
         MODAL MODIFICATION CLIENT (responsive)
    ═══════════════════════════════════════ -->
    <!-- Mobile drawer -->
    <div class="sm:hidden">
      <el-drawer v-model="showEditModal" direction="btt" size="90%" :close-on-click-modal="false" @closed="resetEditForm" title="Modifier le client">
        <template #default>
          <el-form ref="editFormRef" :model="editForm" :rules="rules" label-position="top" size="large" class="px-2">
            <div class="grid grid-cols-2 gap-3">
              <el-form-item label="Prénom" prop="firstName">
                <el-input v-model="editForm.firstName" placeholder="Jean" style="border-radius: 10px;" />
              </el-form-item>
              <el-form-item label="Nom" prop="lastName">
                <el-input v-model="editForm.lastName" placeholder="Dupont" style="border-radius: 10px;" />
              </el-form-item>
            </div>
            <el-form-item label="Email" prop="email">
              <el-input v-model="editForm.email" type="email" placeholder="jean@email.com" style="border-radius: 10px;">
                <template #prefix><span class="material-symbols-outlined text-lg">mail</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="Téléphone" prop="phone">
              <el-input v-model="editForm.phone" placeholder="+229 00 00 00 00" style="border-radius: 10px;">
                <template #prefix><span class="material-symbols-outlined text-lg">phone</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="Changer la photo (optionnel)">
              <el-upload class="w-full" action="#" :auto-upload="false" :on-change="handleEditPhotoChange" :show-file-list="false" accept="image/*">
                <el-button plain style="width: 100%; border-radius: 10px; min-height: 44px;">
                  <span class="material-symbols-outlined text-lg mr-1">upload</span>
                  {{ editForm.photo ? editForm.photo.name : 'Choisir une nouvelle photo' }}
                </el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div class="flex gap-3">
            <el-button @click="showEditModal = false" size="large" style="border-radius: 10px; flex: 1; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="clientStore.loading" @click="handleEdit"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; flex: 1; min-height: 44px;">
              Enregistrer
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>
    <!-- Desktop dialog -->
    <div class="hidden sm:block">
      <el-dialog v-model="showEditModal" title="Modifier le client" width="520px" :close-on-click-modal="false" @closed="resetEditForm">
        <el-form ref="editFormRef" :model="editForm" :rules="rules" label-position="top" size="large">
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="Prénom" prop="firstName">
              <el-input v-model="editForm.firstName" placeholder="Jean" style="border-radius: 10px;" />
            </el-form-item>
            <el-form-item label="Nom" prop="lastName">
              <el-input v-model="editForm.lastName" placeholder="Dupont" style="border-radius: 10px;" />
            </el-form-item>
          </div>
          <el-form-item label="Email" prop="email">
            <el-input v-model="editForm.email" type="email" placeholder="jean@email.com" style="border-radius: 10px;">
              <template #prefix><span class="material-symbols-outlined text-lg">mail</span></template>
            </el-input>
          </el-form-item>
          <el-form-item label="Téléphone" prop="phone">
            <el-input v-model="editForm.phone" placeholder="+229 00 00 00 00" style="border-radius: 10px;">
              <template #prefix><span class="material-symbols-outlined text-lg">phone</span></template>
            </el-input>
          </el-form-item>
          <el-form-item label="Changer la photo (optionnel)">
            <el-upload class="w-full" action="#" :auto-upload="false" :on-change="handleEditPhotoChange" :show-file-list="false" accept="image/*">
              <el-button plain style="width: 100%; border-radius: 10px; min-height: 44px;">
                <span class="material-symbols-outlined text-lg mr-1">upload</span>
                {{ editForm.photo ? editForm.photo.name : 'Choisir une nouvelle photo' }}
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <el-button @click="showEditModal = false" size="large" style="border-radius: 10px; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="clientStore.loading" @click="handleEdit"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; min-height: 44px;">
              Enregistrer
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- ═══════════════════════════════════════
         DRAWER DÉTAIL CLIENT
    ═══════════════════════════════════════ -->
    <el-drawer v-model="showDetail" direction="rtl" size="480px" :with-header="false" class="!w-full sm:!w-[480px]">
      <div v-if="detailLoading" class="flex justify-center items-center h-full">
        <span class="material-symbols-outlined animate-spin text-indigo-600 text-4xl">progress_activity</span>
      </div>
      <div v-else-if="selectedClient" class="p-4 sm:p-6 h-full overflow-y-auto">
        <div class="flex flex-col items-center mb-8 pt-4">
          <div v-if="!selectedClient.photo"
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-black text-2xl sm:text-3xl text-white mb-4"
            :style="{ backgroundColor: getAvatarColor(selectedClient.firstName) }">
            {{ selectedClient.firstName?.charAt(0) }}{{ selectedClient.lastName?.charAt(0) }}
          </div>
          <img v-else :src="mediaUrl(selectedClient.photo)" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 border-4 border-indigo-100" />
          <h2 class="text-xl sm:text-2xl font-black text-[#131b2e]">{{ selectedClient.firstName }} {{ selectedClient.lastName }}</h2>
          <p class="text-[#464554] text-sm">{{ selectedClient.email }}</p>
        </div>
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
        <div class="mb-8">
          <h3 class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-3">Abonnement</h3>
          <div v-if="selectedClient.subscription" class="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm">
            <div class="flex justify-between items-start mb-3">
              <span class="font-black text-[#131b2e] text-base sm:text-lg">{{ selectedClient.subscription.type }}</span>
              <el-tag :type="selectedClient.subscription.status === 'Actif' ? 'success' : 'danger'" size="large" round>
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
          </div>
        </div>
        <div v-if="selectedClient.qrCode" class="mb-8">
          <h3 class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-3">QR Code</h3>
          <div class="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
            <img :src="mediaUrl(selectedClient.qrCode)" class="w-36 h-36 sm:w-40 sm:h-40 object-contain" alt="QR Code" />
            <p class="text-xs text-[#464554] mt-2">Scanner pour valider l'accès</p>
          </div>
        </div>
        <el-button type="primary" size="large" class="w-full mb-3 min-h-[44px]"
          style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
          @click="openEditModal">
          <span class="material-symbols-outlined text-lg mr-1">edit</span>
          Modifier ce client
        </el-button>
        <el-button type="danger" size="large" class="w-full min-h-[44px]" plain
          style="border-radius: 12px; font-weight: 700;" @click="handleDelete(selectedClient)">
          <span class="material-symbols-outlined text-lg mr-1">delete</span>
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
import { sendQrCodeEmail } from '@/services/emailjs'
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
            const created = await clientStore.create(form.value)

            showCreateModal.value = false

            let emailMsg = ''
            if (created.qrCode) {
                const qrCodeUrl = mediaUrl(created.qrCode)
                try {
                    await sendQrCodeEmail({
                        toEmail: form.value.email,
                        toName: `${form.value.firstName} ${form.value.lastName}`,
                        qrCodeUrl,
                    })
                    emailMsg = `<p class="text-sm text-green-600 mt-2">✅ QR code envoyé par email à <strong>${form.value.email}</strong></p>`
                } catch (emailErr) {
                    emailMsg = `<p class="text-sm text-amber-600 mt-2">⚠️ Client créé mais l'email n'a pas pu être envoyé.</p>`
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Client créé !',
                html: `<p>${form.value.firstName} ${form.value.lastName} a été ajouté avec succès.</p>${emailMsg}`,
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'Super !',
                borderRadius: '16px',
            })

            openDetail(created.id)
            resetForm()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                html: `<p>${clientStore.error || 'Impossible de créer le client.'}</p>`,
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Ouvrir le modal de modification ─────────────
function openEditModal() {
    editForm.value = {
        firstName: selectedClient.value.firstName,
        lastName: selectedClient.value.lastName,
        email: selectedClient.value.email,
        phone: selectedClient.value.phone,
        photo: null,
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
