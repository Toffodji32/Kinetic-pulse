<template>
  <nav class="fixed top-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
    <div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">

      <div class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-headline">
        KINETIC PULSE
      </div>

      <div class="hidden md:flex items-center gap-8">
        <a v-for="link in navLinks" :key="link.label"
          @click="scrollTo(link.id)"
          class="cursor-pointer text-zinc-400 hover:text-indigo-400 transition-colors font-medium text-sm tracking-wide">
          {{ link.label }}
        </a>
      </div>

      <div class="flex items-center gap-3">
        <router-link to="/login"
          class="text-zinc-400 hover:text-white transition-colors text-sm font-medium px-4 py-2">
          Connexion
        </router-link>
        <router-link to="/register-gym"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-indigo-600/20">
          Créer votre salle
        </router-link>
      </div>

      <button class="md:hidden text-white">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
const navLinks = [
  { label: 'Fonctionnalités', id: 'features' },
  { label: 'Tarifs',          id: 'pricing'  },
  { label: 'Contact',         id: 'contact'  },
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
