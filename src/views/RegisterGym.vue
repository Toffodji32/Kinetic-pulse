<template>
    <div class="min-h-screen bg-[#faf8ff] flex items-center justify-center p-6">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-black font-headline text-indigo-600">Kinetic Pulse</h1>
                <p class="text-[#464554] font-medium mt-1">Créez votre salle de sport</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm p-8">
                <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large"
                    @submit.prevent="handleRegister">

                    <el-form-item label="Nom de la salle" prop="gymName">
                        <el-input v-model="form.gymName" placeholder="Ex: Kinetic Pulse Cotonou" />
                    </el-form-item>

                    <el-form-item label="Votre nom" prop="ownerName">
                        <el-input v-model="form.ownerName" placeholder="Ex: Jean Dupont" />
                    </el-form-item>

                    <el-form-item label="Email" prop="ownerEmail">
                        <el-input v-model="form.ownerEmail" type="email" placeholder="jean@example.com" />
                    </el-form-item>

                    <el-form-item label="Telephone" prop="ownerPhone">
                        <el-input v-model="form.ownerPhone" placeholder="+229 XX XX XX XX" />
                    </el-form-item>

                    <el-form-item label="Mot de passe" prop="ownerPassword">
                        <el-input v-model="form.ownerPassword" type="password" show-password
                            placeholder="Min. 8 caracteres" />
                    </el-form-item>

                    <el-button type="primary" native-type="submit" :loading="gymAuthStore.loading"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
                        class="w-full h-12 mt-2">
                        {{ gymAuthStore.loading ? 'Inscription...' : 'Creer ma salle' }}
                    </el-button>
                </el-form>

                <p class="text-center text-sm text-gray-500 mt-6">
                    Deja un compte ?
                    <router-link to="/login" class="text-indigo-600 font-semibold hover:underline">Connectez-vous</router-link>
                </p>
            </div>

            <p class="text-center text-xs text-gray-400 mt-6">
                Essai gratuit de 14 jours. Sans carte bancaire.
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGymAuthStore } from '@/stores/gymAuth'
import Swal from 'sweetalert2'

const router = useRouter()
const gymAuthStore = useGymAuthStore()
const formRef = ref(null)

const form = reactive({
    gymName: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerPassword: '',
})

const rules = {
    gymName: [{ required: true, message: 'Le nom de la salle est requis', trigger: 'blur' }],
    ownerName: [{ required: true, message: 'Votre nom est requis', trigger: 'blur' }],
    ownerEmail: [
        { required: true, message: "L'email est requis", trigger: 'blur' },
        { type: 'email', message: 'Email invalide', trigger: 'blur' },
    ],
    ownerPhone: [{ required: true, message: 'Le telephone est requis', trigger: 'blur' }],
    ownerPassword: [
        { required: true, message: 'Le mot de passe est requis', trigger: 'blur' },
        { min: 8, message: 'Minimum 8 caracteres', trigger: 'blur' },
    ],
}

async function handleRegister() {
    await formRef.value.validate(async (valid) => {
        if (!valid) return

        try {
            const result = await gymAuthStore.register({
                gymName: form.gymName,
                ownerName: form.ownerName,
                ownerEmail: form.ownerEmail,
                ownerPassword: form.ownerPassword,
                ownerPhone: form.ownerPhone,
            })

            await Swal.fire({
                icon: 'success',
                title: 'Salle creee !',
                html: `
                    <p>Bienvenue <strong>${result.user.name}</strong> !</p>
                    <p class="mt-2 text-sm text-gray-500">Votre salle <strong>${result.gym.name}</strong> est prete.</p>
                    <p class="mt-3 text-xs text-indigo-600">Essai gratuit jusqu au ${new Date(result.gym.trialEndsAt).toLocaleDateString('fr-FR')}</p>
                `,
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'Acceder au tableau de bord',
            })

            router.push('/admin/dashboard')
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: gymAuthStore.error || "Impossible de creer la salle.",
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}
</script>
