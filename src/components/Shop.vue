<template>
  <section id="shop" class="py-24 bg-gym-surface">
    <div class="container mx-auto px-6">

      <div class="flex justify-between items-end mb-16">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-gym-primary mb-3 block">
            Boutique Kinetic
          </span>
          <h2 class="font-headline text-3xl font-bold text-gym-on-surface">
            Commande. Paye. <span class="text-gym-primary">Reçois.</span>
          </h2>
          <p class="text-gym-on-surface-variant text-sm mt-2 max-w-md">
            Suppléments, équipements et vêtements de sport livrés chez toi ou à retirer en salle.
          </p>
        </div>
        <router-link
          to="/shop"
          class="text-gym-primary font-bold flex items-center gap-2 hover:underline text-sm"
        >
          Voir tout le catalogue
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="product in products"
          :key="product.name"
          class="group cursor-pointer"
          @click="router.push('/shop')"
        >
          <div class="relative aspect-square rounded-3xl overflow-hidden bg-gym-surface-low mb-4 border border-gym-outline-variant/10 group-hover:border-gym-primary/30 transition-all">
            <img
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              :src="product.image"
              :alt="product.name"
            />
            <!-- Overlay panier -->
            <div class="absolute inset-0 bg-gym-surface/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div class="bg-gym-primary text-gym-on-primary px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                Commander
              </div>
            </div>
            <!-- Badge catégorie -->
            <div class="absolute top-3 left-3 bg-gym-surface/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gym-primary">
              {{ product.category }}
            </div>
          </div>
          <h4 class="font-bold text-gym-on-surface">{{ product.name }}</h4>
          <div class="flex justify-between items-center mt-1">
            <p class="text-gym-primary font-black">{{ product.price }} FCFA</p>
            <span class="text-xs text-gym-on-surface-variant">{{ product.stock }}</span>
          </div>
        </div>
      </div>

      <!-- CTA boutique -->
      <div class="text-center mt-16">
        <div class="inline-flex flex-col items-center gap-4">
          <p class="text-gym-on-surface-variant text-sm">
            Livraison à domicile · Retrait en salle · Paiement FedaPay sécurisé
          </p>
          <router-link to="/shop">
            <button class="px-10 py-4 bg-gradient-to-r from-gym-primary to-gym-primary-container text-gym-on-primary font-black rounded-full text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gym-primary/20">
              Explorer la boutique →
            </button>
          </router-link>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const products = [
  {
    name:     'Whey Protéine Premium',
    price:    '15 000',
    category: 'Suppléments',
    stock:    'En stock',
    image:    'https://lh3.googleusercontent.com/aida-public/AB6AXuCcPUqupQPv2jQo11teMYjwQvbWPwwmzSNZ3H_KflKikruTfO50mws1F0_RFMyYGL3c0bYBBqc_6BaF6AUuLOXETd--ADJV2XfZeob5qtAt_BGFeJrz8MNxmvXHqqcNn_O5H2iyDM7zvd9a15F8DqfH4AHzK27gxz_6hVLG1T4VyfzUHo9C8m8uYwv5wYZQKkSiqphRCS2R6ddQGFN2POhyGXapTNBY8lJQ5GctX82jrW99TJbtwPuNQO6TSMsvqEQgrjjx-n4y3EE',
  },
  {
    name:     'Écouteurs Sport Pulse',
    price:    '28 000',
    category: 'Accessoires',
    stock:    'En stock',
    image:    'https://lh3.googleusercontent.com/aida-public/AB6AXuDiyFh3f--Oj4bWTVL8V0cxS-I5glIHXsrJEhlVWkp0FwWcaNyCg-Wa13UlGPT4grtB6eULEe0v9-sRtdVGz6uwSM2qRFpPwplRqT_0Msohb1419xu57iatZPQRL_UCXwJKtlc1W5V3_0qKMG_66LYE59XflCABtYrihTcAvlx08A4-EwZ2ymjcytZgn8SQeLyKFq1Td4M-zVgR0HeV9lJwwwdYFzVIEKks7WRwpMsq40oIQRg8Hn9kaIrWyhqIX8qQObLuGc_OPz8',
  },
  {
    name:     'T-shirt Tech-Flex Pro',
    price:    '8 500',
    category: 'Vêtements',
    stock:    'En stock',
    image:    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjFT3FwEiPK3thteUy5DIdVN228WMt6fSw18HhD9RNrE5iUfQ5tBCJm-yyoFZ1Emdv7T2Ioj_82vLvqg_3OAq4KP7u6ZA1AgXTtx-CddjnpyxceseDosJbIbgChNcDUx4aWQ82knDcIt9TswgjAyNtKrzTHxKjSRwyjT6hxKA-fQiQ54VzobejurNaCM2r7c89bnkMk_TbBO7WGQfUT9B75D-bqVlSACLMt4PXXCfKtH9kFCjE3y6Im9DkbfrZ9UZ1pOpYSJ6GFP0',
  },
  {
    name:     'Bandes de Résistance Elite',
    price:    '4 200',
    category: 'Équipements',
    stock:    'Presque épuisé',
    image:    'https://lh3.googleusercontent.com/aida-public/AB6AXuCt-uY2sWZR_Rk0zroy630MnwHKeX0f2nal3JiR0YFXKmFPXp7np4b8SddBwkZ7vf0vnidIl0ICckXHrhOV5juR8BoZgWQoqyMR9nXIfT2eR_alSfexI8TJR5wZCs4-sIqqvqx-BarMYPyKGOIawYovqya-dimPs6SoE9PkqcqP2y14fCQgts93Xl1-Alv0TdDCJPCChCr2S0bseAhEXZcHoxTFzEeMJliDGiLwIAHUi67pDXNoAjVr_VFKcYhmC40jsJJlc-K03nA',
  },
]
</script>