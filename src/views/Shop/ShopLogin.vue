<template>
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">

            <!-- Logo -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-black text-indigo-600 tracking-tight">Kinetic Shop</h1>
                <p class="text-gray-500 mt-2">Connectez-vous pour commander</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">

                <!-- Onglets connexion / inscription -->
                <el-tabs v-model="activeTab" class="mb-6">
                    <el-tab-pane label="Connexion" name="login" />
                    <el-tab-pane label="Inscription" name="register" />
                </el-tabs>

                <!-- ── CONNEXION ── -->
                <el-form v-if="activeTab === 'login'" ref="loginFormRef" :model="loginForm" :rules="loginRules"
                    label-position="top" size="large" @submit.prevent="handleLogin">
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="loginForm.email" type="email" placeholder="votre@email.com">
                            <template #prefix><el-icon>
                                    <Message />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Mot de passe" prop="password">
                        <el-input v-model="loginForm.password" type="password" placeholder="••••••••" show-password>
                            <template #prefix><el-icon>
                                    <Lock />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>

                    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                        {{ error }}
                    </div>

                    <el-button type="primary" size="large" native-type="submit" :loading="loading" class="w-full"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
                        @click="handleLogin">
                        Se connecter
                    </el-button>
                </el-form>

                <!-- ── INSCRIPTION ── -->
                <el-form v-else ref="registerFormRef" :model="registerForm" :rules="registerRules" label-position="top"
                    size="large">
                    <el-form-item label="Nom complet" prop="name">
                        <el-input v-model="registerForm.name" placeholder="Jean Dupont">
                            <template #prefix><el-icon>
                                    <User />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Numéro de téléphone" prop="phone">
                        <el-input v-model="registerForm.phone" placeholder="+229 XXXX XXXX ou XX XX XX XX">
                            <template #prefix><el-icon>
                                    <Phone />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Email" prop="email">
                        <el-input v-model="registerForm.email" type="email" placeholder="votre@email.com">
                            <template #prefix><el-icon>
                                    <Message />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Mot de passe" prop="password">
                        <el-input v-model="registerForm.password" type="password" placeholder="••••••••" show-password>
                            <template #prefix><el-icon>
                                    <Lock />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Confirmer le mot de passe" prop="confirmPassword">
                        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="••••••••"
                            show-password>
                            <template #prefix><el-icon>
                                    <Lock />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>

                    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                        {{ error }}
                    </div>

                    <el-button type="primary" size="large" :loading="loading" class="w-full"
                        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;"
                        @click="handleRegister">
                        Créer mon compte
                    </el-button>
                </el-form>

            </div>

            <!-- Retour boutique -->
            <div class="text-center mt-6">
                <router-link to="/shop" class="text-indigo-600 font-medium hover:underline text-sm">
                    ← Continuer sans compte
                </router-link>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useShopStore } from '@/stores/shop'
import { Lock, Message, Phone, User } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const shopStore = useShopStore()

const activeTab = ref('login')
const loading = ref(false)
const error = ref('')
const loginFormRef = ref(null)
const registerFormRef = ref(null)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
})

const loginRules = {
    email: [{ required: true, type: 'email', message: 'Email invalide', trigger: 'blur' }],
    password: [{ required: true, message: 'Mot de passe requis', trigger: 'blur' }],
}

const registerRules = {
    name: [{ required: true, message: 'Nom obligatoire', trigger: 'blur' }],
    email: [{ required: true, type: 'email', message: 'Email invalide', trigger: 'blur' }],
    phone: [
        { required: true, message: 'Numéro de téléphone obligatoire', trigger: 'blur' },
        { min: 8, message: 'Le numéro doit contenir au moins 8 chiffres', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Mot de passe obligatoire', trigger: 'blur' },
        { min: 6, message: 'Minimum 6 caractères', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: 'Confirmation requise', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== registerForm.value.password) {
                    callback(new Error('Les mots de passe ne correspondent pas'))
                } else {
                    callback()
                }
            },
            trigger: 'blur',
        },
    ],
}

async function handleLogin() {
    await loginFormRef.value.validate(async (valid) => {
        if (!valid) return
        loading.value = true
        error.value = ''
        try {
            await authStore.login(loginForm.value.email, loginForm.value.password)

            const roles = authStore.user?.roles || []

            // admin ou réceptionniste qui se connecte via shop-login → dashboard
            if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_USER')) {
                router.push({ name: 'dashboard' })
                return
            }

            // client → redirect ou shop-home
            const redirect = route.query.redirect
            const safeRedirect = redirect && redirect !== '/shop/login' && redirect !== '/login'
                ? redirect
                : '/shop'

            router.push(safeRedirect)

        } catch {
            error.value = authStore.error || 'Email ou mot de passe incorrect'
        } finally {
            loading.value = false
        }
    })
}

async function handleRegister() {
    await registerFormRef.value.validate(async (valid) => {
        if (!valid) return
        loading.value = true
        error.value = ''
        try {
            const result = await shopStore.register(
                registerForm.value.name,
                registerForm.value.email,
                registerForm.value.phone,
                registerForm.value.password
            )

            // auto-login après inscription
            authStore.token = result.token
            authStore.user = result.user
            localStorage.setItem('token', result.token)
            localStorage.setItem('user', JSON.stringify(result.user))

            // ← toujours vers shop-home après inscription
            router.push({ name: 'shop-home' })

        } catch {
            error.value = shopStore.error || 'Erreur lors de la création du compte'
        } finally {
            loading.value = false
        }
    })
}
</script>