<template>
  <section id="pricing" class="py-24 bg-gym-surface-low">
    <div class="container mx-auto px-6">

      <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-gym-primary mb-3 block">
            Aucun frais caché
          </span>
          <h2 class="font-headline text-4xl font-bold mb-4 text-gym-on-surface">
            Choisis ton niveau.<br/>
            <span class="text-gym-secondary">Dépasse-le.</span>
          </h2>
          <p class="text-gym-on-surface-variant max-w-md">
            Accès QR inclus dans tous les plans. Paiement sur place — espèces, carte ou Mobile Money.
          </p>
        </div>

        <!-- Toggle mensuel / annuel -->
        <div class="flex items-center gap-4 bg-gym-surface-container p-1 rounded-full border border-gym-outline-variant/10">
          <button
            @click="billingCycle = 'monthly'"
            :class="billingCycle === 'monthly'
              ? 'px-6 py-2 rounded-full text-sm font-bold bg-gym-primary text-gym-on-primary'
              : 'px-6 py-2 rounded-full text-sm font-bold text-gym-on-surface-variant hover:text-gym-on-surface transition-colors'"
          >
            Mensuel
          </button>
          <button
            @click="billingCycle = 'annual'"
            :class="billingCycle === 'annual'
              ? 'px-6 py-2 rounded-full text-sm font-bold bg-gym-primary text-gym-on-primary'
              : 'px-6 py-2 rounded-full text-sm font-bold text-gym-on-surface-variant hover:text-gym-on-surface transition-colors'"
          >
            Annuel <span class="text-gym-secondary">−20%</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="plan in plans"
          :key="plan.key"
          @click="selectedPlan = plan.key"
          :class="[
            'relative cursor-pointer p-10 rounded-[2.5rem] flex flex-col h-full transition-all duration-300',
            selectedPlan === plan.key
              ? 'border-gym-primary shadow-[0_0_50px_-10px_rgba(105,218,255,0.2)] scale-105 z-10 bg-gym-surface-container border-2'
              : 'bg-gym-surface-low border border-gym-outline-variant/10 hover:border-gym-outline-variant/40'
          ]"
        >
          <!-- Badge populaire -->
          <div v-if="plan.badge"
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gym-primary text-gym-on-primary px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
            {{ plan.badge }}
          </div>

          <h3 class="font-headline text-2xl font-bold mb-2 text-gym-on-surface">{{ plan.name }}</h3>
          <p class="text-gym-on-surface-variant text-sm mb-6">{{ plan.tagline }}</p>

          <div class="flex items-baseline gap-1 mb-8">
            <span class="text-4xl font-headline font-black"
              :class="selectedPlan === plan.key ? 'text-gym-primary' : 'text-gym-on-surface'">
              {{ billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice }}
            </span>
            <span class="text-gym-on-surface-variant text-sm">FCFA / {{ billingCycle === 'monthly' ? 'mois' : 'an' }}</span>
          </div>

          <ul class="space-y-3 mb-10 flex-grow">
            <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3 text-sm">
              <span class="material-symbols-outlined text-gym-primary text-lg flex-shrink-0 mt-0.5">check_circle</span>
              <span class="text-gym-on-surface-variant">{{ feature }}</span>
            </li>
          </ul>

          <router-link to="/shop/login">
            <button
              :class="[
                'w-full py-4 rounded-2xl font-bold transition-all',
                selectedPlan === plan.key
                  ? 'bg-gradient-to-r from-gym-primary to-gym-primary-container text-gym-on-primary shadow-lg shadow-gym-primary/20 hover:scale-105'
                  : 'bg-gym-surface-variant text-gym-on-surface hover:bg-gym-surface-high'
              ]"
            >
              {{ plan.cta }}
            </button>
          </router-link>
        </div>
      </div>

      <!-- Note de bas de page -->
      <p class="text-center text-gym-on-surface-variant text-sm mt-12">
        Paiement sur place uniquement — espèces, carte bancaire ou Mobile Money.
        Accès QR code généré automatiquement à l'inscription.
      </p>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const billingCycle = ref('monthly')
const selectedPlan = ref('pro')

const plans = [
  {
    key:          'base',
    name:         'Starter',
    tagline:      'Pour démarrer sans engagement.',
    monthlyPrice: 9900,
    annualPrice:  95040,
    badge:        null,
    features: [
      'Accès QR code 24h/24',
      'Abonnement mensuel renouvelable',
      'Paiement sur place',
      'Historique de présences',
      'Boutique en ligne',
    ],
    cta: 'Commencer',
  },
  {
    key:          'pro',
    name:         'Pro',
    tagline:      'Le choix de ceux qui progressent vraiment.',
    monthlyPrice: 19900,
    annualPrice:  191040,
    badge:        'Le plus populaire',
    features: [
      'Tout le plan Starter',
      'Accès à tous les équipements',
      'Livraison boutique à domicile',
      'Suivi de commande en temps réel',
      'Renouvellement automatique',
      'Support prioritaire',
    ],
    cta: 'Rejoindre',
  },
  {
    key:          'elite',
    name:         'Elite',
    tagline:      'Pour ceux qui ne font pas les choses à moitié.',
    monthlyPrice: 34900,
    annualPrice:  335040,
    badge:        null,
    features: [
      'Tout le plan Pro',
      'Accès VIP illimité',
      'Coaching personnalisé (2×/mois)',
      'Frais de livraison offerts',
      'Accès espace récupération',
      'Nutrition personnalisée',
    ],
    cta: 'Devenir Elite',
  },
]
</script>