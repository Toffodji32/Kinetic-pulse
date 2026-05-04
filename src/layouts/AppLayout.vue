<template>
    <div class="flex bg-[#faf8ff] min-h-screen">
        <!-- SIDEBAR -->
        <aside class="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-[#f2f3ff] flex flex-col gap-2 p-6 z-50">
            <div class="mb-8">
                <h1 class="text-xl font-bold font-headline text-slate-900 tracking-tight">Kinetic Ledger</h1>
                <p class="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">Premium Fitness Admin
                </p>
            </div>

            <nav class="flex flex-col gap-1 flex-1">
                <router-link to="/admin/dashboard"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/dashboard' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">dashboard</span>
                    <span class="text-sm font-medium">Dashboard</span>
                </router-link>

                <router-link to="/admin/clients"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/clients' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">group</span>
                    <span class="text-sm font-medium">Clients</span>
                </router-link>

                <router-link to="/admin/subscriptions"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/subscriptions' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">card_membership</span>
                    <span class="text-sm font-medium">Subscriptions</span>
                </router-link>

                <router-link to="/admin/payments"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/payments' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">payments</span>
                    <span class="text-sm font-medium">Payments</span>
                </router-link>

                <router-link to="/admin/orders"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/orders' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">shopping_bag</span>
                    <span class="text-sm font-medium">Orders</span>
                </router-link>

                <router-link to="/admin/products"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/products' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">inventory_2</span>
                    <span class="text-sm font-medium">Products</span>
                </router-link>

                <router-link to="/admin/users"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/users' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">manage_accounts</span>
                    <span class="text-sm font-medium">Users</span>
                </router-link>

                <router-link to="/admin/roles"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/roles' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">security</span>
                    <span class="text-sm font-medium">Rôles</span>
                </router-link>

                <router-link to="/admin/categories"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer select-none hover:translate-x-1 transition-transform duration-200"
                    :class="route.path === '/admin/categories' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-slate-500 hover:bg-white/50'">
                    <span class="material-symbols-outlined">category</span>
                    <span class="text-sm font-medium">Catégories</span>
                </router-link>

                <router-link to="/admin/settings"
                    class="flex items-center gap-3 px-4 py-2 text-slate-500 hover:bg-white/50 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200">
                    <span class="material-symbols-outlined">settings</span>
                    <span class="text-sm font-medium">Settings</span>
                </router-link>
            </nav>

            <!-- Footer Sidebar -->
            <div class="mt-auto pt-6 border-t border-slate-200/50 flex flex-col gap-1">


                <button @click="handleLogout"
                    class="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-white/50 rounded-lg cursor-pointer hover:translate-x-1 transition-transform duration-200 w-full text-left">
                    <span class="material-symbols-outlined">logout</span>
                    <span class="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <div class="ml-64 flex-1 min-h-screen bg-[#faf8ff] text-[#131b2e]">
            <!-- TOPBAR -->
            <header
                class="sticky top-0 z-40 w-full flex justify-between items-center h-20 px-8 bg-white/80 backdrop-blur-xl shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <span
                            class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                        <input
                            class="pl-10 pr-4 py-2 bg-[#f2f3ff] border-none rounded-full w-64 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                            placeholder="Search analytics..." type="text" />
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <button class="relative text-slate-500 hover:text-indigo-600 transition-colors">
                        <span class="material-symbols-outlined">notifications</span>
                        <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button class="text-slate-500 hover:text-indigo-600 transition-colors">
                        <span class="material-symbols-outlined">help</span>
                    </button>

                    <div class="flex items-center gap-3 pl-6 border-l border-slate-200">
                        <div class="text-right">
                            <p class="text-sm font-bold text-[#131b2e]">{{ authStore.user?.name || 'Admin' }}</p>
                            <p class="text-[10px] text-slate-500 uppercase font-semibold">Super Admin</p>
                        </div>
                        <div
                            class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                            {{ authStore.user?.name?.charAt(0).toUpperCase() || 'A' }}
                        </div>
                    </div>
                </div>
            </header>

            <!-- PAGE CONTENT -->
            <main class="p-8 max-w-7xl mx-auto">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
</style>