<template>
  <footer class="bg-gym-surface-lowest border-t border-gym-outline-variant/20 py-16">
    <div class="container mx-auto px-6">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gym-primary to-gym-secondary font-headline mb-4">
            KINETIC PULSE
          </div>
          <p class="text-gym-on-surface-variant text-sm leading-relaxed mb-6">
            La plateforme qui transforme ta salle de gym en expérience connectée. QR code, abonnements, boutique — tout en un.
          </p>
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-gym-surface-container rounded-full flex items-center justify-center text-gym-on-surface-variant hover:text-gym-primary hover:bg-gym-surface-high transition-all cursor-pointer">
              <span class="material-symbols-outlined text-sm">alternate_email</span>
            </div>
            <div class="w-8 h-8 bg-gym-surface-container rounded-full flex items-center justify-center text-gym-on-surface-variant hover:text-gym-primary hover:bg-gym-surface-high transition-all cursor-pointer">
              <span class="material-symbols-outlined text-sm">phone</span>
            </div>
          </div>
        </div>

        <!-- Liens boutique -->
        <div>
          <h4 class="font-bold text-gym-on-surface text-sm uppercase tracking-widest mb-6">Boutique</h4>
          <ul class="space-y-3">
            <li v-for="link in shopLinks" :key="link.label">
              <router-link :to="link.to" class="text-gym-on-surface-variant hover:text-gym-primary transition-colors text-sm">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Liens membres -->
        <div>
          <h4 class="font-bold text-gym-on-surface text-sm uppercase tracking-widest mb-6">Membres</h4>
          <ul class="space-y-3">
            <li v-for="link in memberLinks" :key="link.label">
              <router-link :to="link.to" class="text-gym-on-surface-variant hover:text-gym-primary transition-colors text-sm">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Infos salle -->
        <div>
          <h4 class="font-bold text-gym-on-surface text-sm uppercase tracking-widest mb-6">Salle</h4>
          <ul class="space-y-3 text-gym-on-surface-variant text-sm">
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-gym-primary text-sm mt-0.5">location_on</span>
              Cotonou, Bénin
            </li>
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-gym-primary text-sm mt-0.5">schedule</span>
              Lun – Sam : 6h00 – 22h00
            </li>
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-gym-primary text-sm mt-0.5">qr_code_scanner</span>
              Accès QR 24h/24
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="border-t border-gym-outline-variant/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-gym-on-surface-variant">
          © 2024 Kinetic Pulse. Tous droits réservés.
        </p>
        <div class="flex gap-8">
          <a href="#" class="text-xs text-gym-on-surface-variant hover:text-gym-primary transition-colors">Confidentialité</a>
          <a href="#" class="text-xs text-gym-on-surface-variant hover:text-gym-primary transition-colors">Conditions</a>
          <a href="#" class="text-xs text-gym-on-surface-variant hover:text-gym-primary transition-colors">Support</a>
        </div>
        <!-- Accès admin discret -->
        <router-link to="/login" class="text-xs text-gym-outline hover:text-gym-on-surface-variant transition-colors">
          Espace administration
        </router-link>
      </div>

    </div>
  </footer>
</template>

<script setup>
const shopLinks = [
  { label: 'Catalogue produits',  to: '/shop'          },
  { label: 'Mon panier',          to: '/shop/cart'     },
  { label: 'Mes commandes',       to: '/shop/orders'   },
  { label: 'Créer un compte',     to: '/shop/login'    },
]

const memberLinks = [
  { label: 'Se connecter',        to: '/shop/login'    },
  { label: 'Nos abonnements',     to: '/#pricing'      },
  { label: 'Fonctionnalités',     to: '/#features'     },
  { label: 'Contact',             to: '/#contact'      },
]
</script>