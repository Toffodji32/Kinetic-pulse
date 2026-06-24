<template>
    <div class="bg-[#faf8ff] min-h-screen p-6">
        <div class="mb-8">
            <h2 class="text-3xl font-black font-headline tracking-tight text-indigo-600">Ma salle de sport</h2>
            <p class="text-[#464554] font-medium">Informations et paramètres de votre établissement</p>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
            <el-icon class="animate-spin text-indigo-600 text-4xl">
                <Loading />
            </el-icon>
        </div>

        <div v-else class="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="bg-gradient-to-br from-indigo-600 to-violet-500 p-8 text-center text-white">
                    <div class="relative w-28 h-28 mx-auto">
                        <div v-if="gym.logo"
                            class="w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-lg">
                            <img :src="gym.logo" class="w-full h-full object-cover" />
                        </div>
                        <div v-else
                            class="w-28 h-28 mx-auto rounded-2xl bg-white/15 flex items-center justify-center text-5xl font-black shadow-lg">
                            {{ initials }}
                        </div>
                        <label
                            class="absolute -bottom-1 -right-1 w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform">
                            <span class="material-symbols-outlined text-indigo-600 text-lg">photo_camera</span>
                            <input type="file" accept="image/*" class="hidden" @change="handleLogoUpload" />
                        </label>
                    </div>
                    <h3 class="mt-6 text-2xl font-black">{{ gym.name || 'Ma salle' }}</h3>
                    <p class="mt-2 text-sm text-indigo-100">{{ gym.address || 'Adresse non renseignée' }}</p>
                </div>

                <div class="p-6 space-y-4">
                    <div class="rounded-3xl bg-slate-50 p-4">
                        <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-2">Email</p>
                        <p class="text-sm text-[#131b2e] break-all">{{ gym.email || 'Non défini' }}</p>
                    </div>
                    <div class="rounded-3xl bg-slate-50 p-4">
                        <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-2">Téléphone</p>
                        <p class="text-sm text-[#131b2e]">{{ gym.phone || 'Non renseigné' }}</p>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                    <h3 class="text-xl font-bold text-[#131b2e] mb-4">Informations générales</h3>
                    <el-form :model="form" label-position="top" size="large">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <el-form-item label="Nom de la salle">
                                <el-input v-model="form.name" placeholder="Nom de votre salle" />
                            </el-form-item>
                            <el-form-item label="Slug (URL boutique)">
                                <el-input v-model="form.slug" placeholder="ma-salle">
                                    <template #append>
                                        <span class="text-xs text-gray-400">/shop/{{ form.slug || 'slug' }}</span>
                                    </template>
                                </el-input>
                                <p class="text-xs text-gray-400 mt-1">Utilisé dans l'URL de votre boutique</p>
                            </el-form-item>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <el-form-item label="Email de contact">
                                <el-input v-model="form.email" placeholder="contact@masalle.com" />
                            </el-form-item>
                            <el-form-item label="Téléphone">
                                <el-input v-model="form.phone" placeholder="+229 01 23 45 67" />
                            </el-form-item>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <el-form-item label="Adresse">
                                <el-input v-model="form.address" placeholder="Cotonou, Bénin" />
                            </el-form-item>
                        </div>
                        <el-form-item label="Description">
                            <el-input type="textarea" v-model="form.description" :rows="3"
                                placeholder="Présentez votre salle..." />
                        </el-form-item>
                        <div class="flex justify-end gap-3 pt-2">
                            <el-button size="large" style="border-radius: 10px;" @click="resetForm">Annuler</el-button>
                            <el-button type="primary" size="large" :loading="saving" @click="saveGym"
                                style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700;">
                                Enregistrer
                            </el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useGymAuthStore } from '@/stores/gymAuth'
import api from '@/plugins/axios'
import { ElMessage } from 'element-plus'

const gymAuthStore = useGymAuthStore()

const loading = ref(false)
const saving = ref(false)

const gym = reactive({
    name: '',
    slug: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    logo: null,
})

const form = reactive({
    name: '',
    slug: '',
    email: '',
    phone: '',
    address: '',
    description: '',
})

const initials = computed(() => {
    const name = gym.name || ''
    if (!name) return 'G'
    return name.split(' ').map(p => p.charAt(0).toUpperCase()).slice(0, 2).join('')
})

const resetForm = () => {
    form.name = gym.name
    form.email = gym.email
    form.phone = gym.phone
    form.address = gym.address
    form.description = gym.description
}

const loadGym = async () => {
    loading.value = true
    try {
        const { data } = await api.get('/gym/profile')
        Object.assign(gym, data)
        Object.assign(form, data)
        localStorage.setItem('gym_gym', JSON.stringify(data))
        gymAuthStore.gym = data
    } catch {
        if (gymAuthStore.gym) {
            Object.assign(gym, gymAuthStore.gym)
            Object.assign(form, gymAuthStore.gym)
        }
    } finally {
        loading.value = false
    }
}

const saveGym = async () => {
    saving.value = true
    try {
        const { data } = await api.put('/gym/profile', {
            name: form.name,
            slug: form.slug,
            email: form.email,
            phone: form.phone,
            address: form.address,
            description: form.description,
        })
        Object.assign(gym, data)
        Object.assign(form, data)
        localStorage.setItem('gym_gym', JSON.stringify(data))
        gymAuthStore.gym = data
        ElMessage.success('Informations mises à jour')
    } catch {
        ElMessage.error('Erreur lors de la mise à jour')
    } finally {
        saving.value = false
    }
}

const handleLogoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const fd = new FormData()
    fd.append('logo', file)

    saving.value = true
    try {
        const { data } = await api.post('/gym/logo', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        gym.logo = data.logo
        localStorage.setItem('gym_gym', JSON.stringify({ ...gymAuthStore.gym, logo: data.logo }))
        gymAuthStore.gym.logo = data.logo
        ElMessage.success('Logo mis à jour')
    } catch {
        ElMessage.error('Erreur lors de l\'upload du logo')
    } finally {
        saving.value = false
    }
}

onMounted(loadGym)
</script>
