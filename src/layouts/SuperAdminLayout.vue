<template>
    <div class="flex bg-[#0f0f13] min-h-screen">
        <div v-if="sidebarOpen" class="fixed inset-0 bg-black/60 z-40 lg:hidden" @click="sidebarOpen = false"></div>

        <aside
            class="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-[#16161d] flex flex-col gap-2 p-6 z-50 transition-transform duration-300 lg:translate-x-0 border-r border-white/5"
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-xl font-bold font-headline text-white tracking-tight">Super Admin</h1>
                    <p class="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold mt-1">Kinetic Pulse</p>
                </div>
                <button @click="sidebarOpen = false" class="lg:hidden text-gray-400 hover:text-white">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <nav class="flex flex-col gap-1 flex-1">
                <router-link to="/super-admin/dashboard"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/super-admin/dashboard' ? 'bg-indigo-600/20 text-indigo-300 shadow-sm font-semibold' : 'text-gray-400 hover:bg-white/5'"
                    @click="sidebarOpen = false">
                    <span class="material-symbols-outlined">dashboard</span>
                    <span class="text-sm font-medium">Dashboard</span>
                </router-link>

                <router-link to="/super-admin/gyms"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path.startsWith('/super-admin/gyms') ? 'bg-indigo-600/20 text-indigo-300 shadow-sm font-semibold' : 'text-gray-400 hover:bg-white/5'"
                    @click="sidebarOpen = false">
                    <span class="material-symbols-outlined">fitness_center</span>
                    <span class="text-sm font-medium">Salles de sport</span>
                </router-link>

                <router-link to="/super-admin/subscriptions"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/super-admin/subscriptions' ? 'bg-indigo-600/20 text-indigo-300 shadow-sm font-semibold' : 'text-gray-400 hover:bg-white/5'"
                    @click="sidebarOpen = false">
                    <span class="material-symbols-outlined">workspace_premium</span>
                    <span class="text-sm font-medium">Abonnements</span>
                </router-link>

                <hr class="my-2 border-white/5">

                <router-link to="/admin/dashboard"
                    class="flex items-center gap-3 px-4 py-2 text-gray-500 hover:bg-white/5 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200"
                    @click="sidebarOpen = false">
                    <span class="material-symbols-outlined">arrow_back</span>
                    <span class="text-sm font-medium">Retour Admin</span>
                </router-link>
            </nav>

            <div class="mt-auto pt-6 border-t border-white/5">
                <div class="flex items-center gap-3 px-4 py-3">
                    <div
                        class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        SA
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-white truncate">{{ authStore.user?.name || 'Super Admin' }}</p>
                        <p class="text-[10px] uppercase tracking-wider text-indigo-400">Super Admin</p>
                    </div>
                </div>

                <button @click="handleLogout"
                    class="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-white/5 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200 w-full text-left mt-2">
                    <span class="material-symbols-outlined">logout</span>
                    <span class="text-sm font-medium">Déconnexion</span>
                </button>
            </div>
        </aside>

        <div class="flex-1 min-h-screen bg-[#0f0f13] text-gray-100 lg:ml-64">
            <header class="sticky top-0 z-30 w-full flex justify-between items-center h-20 px-4 lg:px-8 bg-[#0f0f13]/80 backdrop-blur-xl border-b border-white/5">
                <button @click="sidebarOpen = true" class="lg:hidden text-gray-400 hover:text-white">
                    <span class="material-symbols-outlined text-2xl">menu</span>
                </button>

                <div class="hidden lg:block"></div>

                <div class="flex items-center gap-3 ml-auto">
                    <div class="text-right">
                        <p class="text-sm font-bold text-white">{{ authStore.user?.name || 'Super Admin' }}</p>
                        <p class="text-[11px] uppercase tracking-[0.2em] text-indigo-400">Super Admin</p>
                    </div>
                    <div
                        class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-[#0f0f13]">
                        SA
                    </div>
                </div>
            </header>

            <main class="p-4 lg:p-8 max-w-7xl mx-auto">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>
