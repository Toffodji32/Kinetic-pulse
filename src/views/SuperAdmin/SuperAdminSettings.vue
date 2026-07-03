<template>
    <div>
        <div class="mb-8">
            <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-400">Paramètres</h2>
            <p class="text-gray-400 font-medium">Modifier vos informations personnelles</p>
        </div>

        <div class="max-w-2xl space-y-6">
            <div class="bg-[#16161d] rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-6">Informations du compte</h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Nom</label>
                        <input v-model="form.name" type="text"
                            class="w-full px-4 py-2.5 bg-[#0f0f13] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input v-model="form.email" type="email"
                            class="w-full px-4 py-2.5 bg-[#0f0f13] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                    </div>
                </div>
            </div>

            <div class="bg-[#16161d] rounded-xl p-6">
                <h3 class="text-lg font-bold text-white mb-6">Changer le mot de passe</h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Mot de passe actuel</label>
                        <input v-model="passwordForm.current_password" type="password"
                            class="w-full px-4 py-2.5 bg-[#0f0f13] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Nouveau mot de passe</label>
                        <input v-model="passwordForm.new_password" type="password"
                            class="w-full px-4 py-2.5 bg-[#0f0f13] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Confirmer le mot de passe</label>
                        <input v-model="passwordForm.confirm_password" type="password"
                            class="w-full px-4 py-2.5 bg-[#0f0f13] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500">
                    </div>
                </div>
            </div>

            <div class="flex gap-3 justify-end">
                <button @click="resetForm"
                    class="px-6 py-2.5 border border-white/10 text-gray-300 rounded-lg font-semibold hover:bg-white/5 transition-colors">
                    Réinitialiser
                </button>
                <button @click="saveProfile" :disabled="saving"
                    class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    :class="saving ? 'cursor-not-allowed' : ''">
                    {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from '@/plugins/axios'
import { onMounted, reactive, ref } from 'vue'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const saving = ref(false)

const form = reactive({
    name: '',
    email: '',
})

const passwordForm = reactive({
    current_password: '',
    new_password: '',
    confirm_password: '',
})

async function loadProfile() {
    try {
        const { data } = await api.get('/super-admin/profile')
        form.name = data.name || ''
        form.email = data.email || ''
    } catch {
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de charger le profil.' })
    }
}

async function saveProfile() {
    if (passwordForm.new_password && passwordForm.new_password !== passwordForm.confirm_password) {
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Les mots de passe ne correspondent pas.' })
        return
    }

    saving.value = true
    try {
        const payload = { name: form.name, email: form.email }

        if (passwordForm.current_password && passwordForm.new_password) {
            payload.current_password = passwordForm.current_password
            payload.new_password = passwordForm.new_password
        }

        const { data } = await api.put('/super-admin/profile', payload)
        authStore.user = { ...authStore.user, name: data.name, email: data.email }
        localStorage.setItem('user', JSON.stringify(authStore.user))

        passwordForm.current_password = ''
        passwordForm.new_password = ''
        passwordForm.confirm_password = ''

        Swal.fire({ icon: 'success', title: 'Profil mis à jour !', confirmButtonColor: '#4f46e5' })
    } catch (err) {
        const msg = err.response?.data?.error || 'Erreur lors de la mise à jour.'
        Swal.fire({ icon: 'error', title: 'Erreur', text: msg, confirmButtonColor: '#4f46e5' })
    } finally {
        saving.value = false
    }
}

function resetForm() {
    loadProfile()
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.confirm_password = ''
}

onMounted(loadProfile)
</script>