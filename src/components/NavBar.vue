<template>
  <nav class="fixed top-0 w-full z-50 bg-gym-surface/80 backdrop-blur-xl border-b border-gym-outline-variant/20">
    <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">

      <div class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gym-primary to-gym-secondary font-headline">
        KINETIC PULSE
      </div>

      <div class="hidden md:flex items-center gap-10">
        <a
          v-for="link in navLinks"
          :key="link.label"
          @click="scrollTo(link.id)"
          class="cursor-pointer text-gym-on-surface-variant hover:text-gym-primary transition-colors font-medium text-sm tracking-wide"
        >
          {{ link.label }}
        </a>
        <router-link
          to="/shop"
          class="text-gym-on-surface-variant hover:text-gym-primary transition-colors font-medium text-sm tracking-wide"
        >
          Boutique
        </router-link>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/register-gym"
          class="bg-gradient-to-r from-gym-primary to-gym-primary-container text-gym-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gym-primary/20"
        >
          Créer votre salle de gym
        </router-link>
      </div>

      <!-- Mobile menu button -->
      <button class="md:hidden text-gym-on-surface">
        <span class="material-symbols-outlined">menu</span>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navLinks = [
  { label: 'Fonctionnalités', id: 'features' },
  { label: 'Abonnements',     id: 'pricing'  },
  { label: 'Matériel',        id: 'shop'     },
  { label: 'Contact',         id: 'contact'  },
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>