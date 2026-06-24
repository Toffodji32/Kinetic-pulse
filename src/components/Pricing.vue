<template>
  <section id="pricing" class="py-24 bg-[#050508]">
    <div class="container mx-auto px-6">

      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block">
          Investissez dans votre salle
        </span>
        <h2 class="font-headline text-4xl font-bold mb-4 text-white">
          Deux formules.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Un seul objectif : votre croissance.</span>
        </h2>
        <p class="text-zinc-400">Pas de frais cachés. Pas d'engagement. Annulez à tout moment.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div v-for="plan in plans" :key="plan.key"
          class="relative rounded-[2rem] p-10 flex flex-col border transition-all duration-300"
          :class="plan.popular
            ? 'bg-gradient-to-b from-indigo-600/10 to-transparent border-indigo-500/40 scale-105 shadow-[0_0_60px_-15px_rgba(99,102,241,0.3)]'
            : 'bg-white/[0.03] border-white/[0.06] hover:border-white/20'">

          <div v-if="plan.popular"
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            Recommandé
          </div>

          <h3 class="font-headline text-2xl font-bold mb-2 text-white">{{ plan.name }}</h3>
          <p class="text-zinc-400 text-sm mb-6">{{ plan.tagline }}</p>

          <div class="flex items-baseline gap-1 mb-8">
            <span class="text-5xl font-headline font-black text-white">{{ plan.price }}</span>
            <span class="text-zinc-500 text-sm">FCFA / mois</span>
          </div>

          <ul class="space-y-4 mb-10 flex-grow">
            <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-3 text-sm">
              <span class="material-symbols-outlined text-indigo-400 text-lg flex-shrink-0 mt-0.5">check_circle</span>
              <span class="text-zinc-300">{{ feat }}</span>
            </li>
            <li v-for="miss in plan.missing" :key="miss"
              class="flex items-start gap-3 text-sm opacity-40">
              <span class="material-symbols-outlined text-zinc-600 text-lg flex-shrink-0 mt-0.5">remove_circle_outline</span>
              <span class="text-zinc-500">{{ miss }}</span>
            </li>
          </ul>

          <router-link to="/register-gym" class="w-full">
            <button
              class="w-full py-4 rounded-2xl font-bold text-sm transition-all"
              :class="plan.popular
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'">
              {{ plan.cta }}
            </button>
          </router-link>
        </div>
      </div>

      <p class="text-center text-zinc-500 text-sm mt-12 max-w-xl mx-auto">
        <span class="material-symbols-outlined text-indigo-400 align-middle text-lg">verified</span>
        Période d'essai gratuite de 7 jours incluse. Toutes les fonctionnalités Premium activées pendant l'essai. Aucune carte bancaire demandée.
      </p>
    </div>
  </section>
</template>

<script setup>
const plans = [
  {
    key: 'basic',
    name: 'Basic',
    tagline: 'L\'essentiel pour démarrer.',
    price: '15 000',
    popular: false,
    features: [
      'Accès QR code pour les membres',
      'Gestion des abonnements (mensuel, annuel)',
      'Dashboard des présences',
      'Gestion des clients',
      'Paiements par espèces et Mobile Money',
      'Jusqu\'à 50 membres actifs',
    ],
    missing: [
      'Boutique en ligne',
    ],
    cta: 'Commencer l\'essai',
  },
  {
    key: 'premium',
    name: 'Premium',
    tagline: 'Le choix des salles qui cartonnent.',
    price: '25 000',
    popular: true,
    features: [
      'Tout le plan Basic',
      'Boutique en ligne dédiée',
      'Catalogue produits illimité',
      'Paiements FedaPay (carte + Mobile Money)',
      'Suivi des commandes (livraison/retrait)',
      'Membres et clients externes',
      'Support prioritaire',
    ],
    missing: [],
    cta: 'Commencer l\'essai',
  },
]
</script>
