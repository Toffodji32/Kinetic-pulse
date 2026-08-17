<template>
    <div class="relative">
        <button @click.stop="toggle"
            class="relative flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            :class="{ 'border-indigo-300 bg-indigo-50': open }"
            aria-label="Notifications">
            <span class="material-symbols-outlined text-slate-600 text-xl">notifications</span>
            <span v-if="store.unreadCount > 0"
                class="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
            </span>
        </button>

        <!-- Overlay pour fermer au clic extérieur -->
        <div v-if="open" class="fixed inset-0 z-40" @click="close"></div>

        <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 translate-y-1"
            leave-active-class="transition ease-in duration-100" leave-to-class="opacity-0 translate-y-1">
            <div v-if="open"
                class="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[28rem] overflow-y-auto z-50 bg-white rounded-2xl shadow-xl border border-slate-200">
                <div class="sticky top-0 bg-white/95 backdrop-blur px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <p class="text-sm font-bold text-[#131b2e]">Notifications</p>
                        <p class="text-[11px] text-slate-500">{{ store.unreadCount }} non lue{{ store.unreadCount > 1 ? 's' : '' }}</p>
                    </div>
                    <button v-if="store.unreadCount > 0" @click="store.markAllRead()"
                        class="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                        Tout marquer lu
                    </button>
                </div>

                <div v-if="store.loading && store.notifications.length === 0" class="p-8 text-center text-slate-400 text-sm">
                    Chargement…
                </div>

                <div v-else-if="store.notifications.length === 0" class="p-8 text-center">
                    <span class="material-symbols-outlined text-4xl text-slate-300">notifications_off</span>
                    <p class="mt-2 text-sm text-slate-500">Aucune notification</p>
                </div>

                <ul v-else class="divide-y divide-slate-100">
                    <li v-for="n in store.notifications" :key="n.id">
                        <button @click="store.markRead(n.id)"
                            class="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                            :class="{ 'bg-indigo-50/50': !n.is_read }">
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined mt-0.5 text-lg"
                                    :class="n.type === 'subscription_expired' ? 'text-red-500' : 'text-amber-500'">
                                    {{ n.type === 'subscription_expired' ? 'event_busy' : 'hourglass_top' }}
                                </span>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-bold text-[#131b2e]" :class="{ 'text-red-600': n.type === 'subscription_expired' }">
                                        {{ n.title }}
                                    </p>
                                    <p class="text-xs text-slate-600 mt-0.5">{{ n.message }}</p>
                                    <p class="text-[10px] text-slate-400 mt-1">{{ formatDate(n.created_at) }}</p>
                                </div>
                                <span v-if="!n.is_read" class="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const store = useNotificationStore()
const open = ref(false)
let pollTimer = null

function toggle() {
    open.value = !open.value
    if (open.value) {
        store.fetchNotifications().catch(() => {})
    }
}

function close() {
    open.value = false
}

function formatDate(value) {
    if (!value) return ''
    const d = new Date(value.replace(' ', 'T'))
    const now = new Date()
    const diff = Math.floor((now - d) / 60000)
    if (diff < 1) return 'à l\'instant'
    if (diff < 60) return `il y a ${diff} min`
    if (diff < 1440) return `il y a ${Math.floor(diff / 60)} h`
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

onMounted(() => {
    store.fetchUnreadCount()
    pollTimer = setInterval(() => store.fetchUnreadCount(), 60000)
})

onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
})
</script>