<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
                <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Paramètres</h2>
                <p class="text-[#464554] font-medium">Informations du compte connecté et sécurité</p>
            </div>
            <el-button type="primary" size="large" @click="refreshProfile"
                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;">
                <el-icon class="mr-2">
                    <Refresh />
                </el-icon>
                Actualiser
            </el-button>
        </div>

        <div v-if="authStore.loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <div v-else class="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="bg-gradient-to-br from-indigo-600 to-violet-500 p-8 text-center text-white">
                    <div
                        class="w-24 h-24 mx-auto rounded-full bg-white/15 flex items-center justify-center text-4xl font-black">
                        {{ initials }}
                    </div>
                    <h3 class="mt-6 text-2xl font-black">{{ authStore.user?.name || 'Utilisateur' }}</h3>
                    <p class="mt-2 text-sm text-indigo-100">{{ roleLabel }}</p>
                </div>

                <div class="p-6 space-y-4">
                    <div class="rounded-3xl bg-slate-50 p-4">
                        <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-2">Email</p>
                        <p class="text-sm text-[#131b2e] break-all">{{ authStore.user?.email || 'Non défini' }}</p>
                    </div>
                    <div class="rounded-3xl bg-slate-50 p-4">
                        <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-2">Rôles</p>
                        <div class="flex flex-wrap gap-2">
                            <el-tag v-for="role in authStore.user?.roles || []" :key="role" type="info" round>
                                {{ role.toUpperCase() }}
                            </el-tag>
                            <span v-if="!authStore.user?.roles?.length" class="text-sm text-[#64748b]">Aucun rôle</span>
                        </div>
                    </div>
                    <div class="rounded-3xl bg-slate-50 p-4">
                        <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-2">Dernière
                            synchronisation</p>
                        <p class="text-sm text-[#131b2e]">{{ lastSync }}</p>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                    <h3 class="text-xl font-bold text-[#131b2e] mb-4">Compte</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="rounded-3xl bg-slate-50 p-4">
                            <p class="text-xs uppercase tracking-widest text-[#464554] mb-2">Identifiant</p>
                            <p class="text-sm text-[#131b2e]">{{ authStore.user?.id ?? '—' }}</p>
                        </div>
                        <div class="rounded-3xl bg-slate-50 p-4">
                            <p class="text-xs uppercase tracking-widest text-[#464554] mb-2">Statut</p>
                            <el-tag :type="authStore.isAdmin ? 'danger' : 'success'" round>
                                {{ authStore.isAdmin ? 'Administrateur' : 'Utilisateur' }}
                            </el-tag>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div class="rounded-3xl bg-slate-50 p-4">
                            <p class="text-xs uppercase tracking-widest text-[#464554] mb-2">Adresse</p>
                            <p class="text-sm text-[#131b2e]">{{ authStore.user?.address || 'Non renseignée' }}</p>
                        </div>
                        <div class="rounded-3xl bg-slate-50 p-4">
                            <p class="text-xs uppercase tracking-widest text-[#464554] mb-2">Téléphone</p>
                            <p class="text-sm text-[#131b2e]">{{ authStore.user?.phone || 'Non renseigné' }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                    <h3 class="text-xl font-bold text-[#131b2e] mb-4">Sécurité</h3>
                    <div class="space-y-4">
                        <div class="rounded-3xl bg-slate-50 p-4 flex items-center justify-between gap-4">
                            <div>
                                <p class="text-xs uppercase tracking-widest text-[#464554] mb-2">Mot de passe</p>
                                <p class="text-sm text-[#131b2e]">••••••••••••</p>
                            </div>
                            <el-button size="small" type="primary" plain @click="openPasswordDialog"
                                style="border-radius: 10px; font-weight: 700;">
                                Modifier
                            </el-button>
                        </div>
                        <div class="rounded-3xl bg-slate-50 p-4 flex items-center justify-between gap-4">
                            <div>
                                <p class="text-xs uppercase tracking-widest text-[#464554] mb-2">Authentification</p>
                                <p class="text-sm text-[#64748b]">Connexion sécurisée activée</p>
                            </div>
                            <el-icon>
                                <Info />
                            </el-icon>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                    <h3 class="text-xl font-bold text-[#131b2e] mb-4">Actions rapides</h3>
                    <div class="space-y-3">
                        <el-button class="w-full" type="danger" size="large" @click="logout"
                            style="border-radius: 12px; font-weight: 700;">
                            Déconnexion
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog v-model="showPasswordDialog" title="Modifier le mot de passe" width="520px"
            :close-on-click-modal="false">
            <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-position="top"
                size="large">
                <el-form-item label="Nouveau mot de passe" prop="newPassword">
                    <el-input type="password" v-model="passwordForm.newPassword" placeholder="Nouveau mot de passe" />
                </el-form-item>
                <el-form-item label="Confirmer le mot de passe" prop="confirmPassword">
                    <el-input type="password" v-model="passwordForm.confirmPassword"
                        placeholder="Confirmer le mot de passe" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="flex gap-3 justify-end">
                    <el-button @click="showPasswordDialog = false" size="large"
                        style="border-radius: 10px;">Annuler</el-button>
                    <el-button type="primary" size="large" :loading="authStore.loading" @click="updatePassword"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                        Enregistrer
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()
const showPasswordDialog = ref(false)
const passwordFormRef = ref(null)
const passwordForm = ref({
    newPassword: '',
    confirmPassword: '',
})

const passwordRules = {
    newPassword: [{ required: true, message: 'Le nouveau mot de passe est requis', trigger: 'blur' }],
    confirmPassword: [
        { required: true, message: 'La confirmation est requise', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== passwordForm.value.newPassword) {
                    callback(new Error('Les mots de passe ne correspondent pas'))
                } else {
                    callback()
                }
            },
            trigger: 'blur',
        },
    ],
}

const initials = computed(() => {
    const name = authStore.user?.name || ''
    if (!name) return 'U'
    return name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
})

const roleLabel = computed(() => {
    if (!authStore.user?.roles?.length) return 'Utilisateur'
    return authStore.user.roles.includes('ROLE_ADMIN') ? 'Administrateur' : authStore.user.roles[0]
})

const lastSync = computed(() => {
    if (!authStore.user) return 'Jamais'
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit',
    }).format(new Date())
})

const refreshProfile = async () => {
    if (!authStore.isAuthenticated) return
    await authStore.fetchMe()
}

const openPasswordDialog = () => {
    passwordForm.value = {
        newPassword: '',
        confirmPassword: '',
    }
    showPasswordDialog.value = true
}

const updatePassword = async () => {
    await passwordFormRef.value.validate((valid) => {
        if (!valid) return
        window.alert('Fonction de mise à jour de mot de passe à implémenter côté API.')
        showPasswordDialog.value = false
    })
}

const logout = () => {
    authStore.logout()
    window.location.href = '/login'
}

onMounted(() => {
    if (authStore.isAuthenticated) {
        authStore.fetchMe()
    }
})
</script>
