<template>
  <section id="features" class="py-24 bg-gym-surface relative overflow-hidden">

    <div class="absolute top-0 right-0 w-96 h-96 bg-gym-primary/5 blur-[120px] rounded-full"></div>

    <div class="container mx-auto px-6 relative z-10">

      <div class="max-w-2xl mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-gym-primary mb-3 block">
          Tout ce dont tu as besoin
        </span>
        <h2 class="font-headline text-4xl font-bold mb-4 text-gym-on-surface">
          Une plateforme.<br/>
          <span class="text-gym-primary">Zéro friction.</span>
        </h2>
        <p class="text-gym-on-surface-variant">
          De l'accès à la salle jusqu'à la livraison de tes suppléments — chaque détail est automatisé pour que tu te concentres sur l'essentiel.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          v-for="feature in features"
          :key="feature.title"
          class="glass-panel p-8 rounded-3xl border border-gym-outline-variant/10 hover:border-gym-primary/40 transition-all duration-500 group"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            :class="feature.iconBg"
          >
            <span class="material-symbols-outlined text-3xl" :class="feature.iconColor">
              {{ feature.icon }}
            </span>
          </div>
          <h3 class="font-headline text-xl font-bold mb-3 text-gym-on-surface">{{ feature.title }}</h3>
          <p class="text-gym-on-surface-variant leading-relaxed text-sm">{{ feature.description }}</p>

          <!-- Badge si nouveau -->
          <span v-if="feature.badge"
            class="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full"
            :class="feature.badgeClass">
            {{ feature.badge }}
          </span>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon:        'qr_code_2',
    iconBg:      'bg-gym-primary/10',
    iconColor:   'text-gym-primary',
    title:       'Accès QR Code instantané',
    description: 'Chaque membre reçoit un QR code unique généré automatiquement. La réceptionniste scanne — l\'accès est accordé en moins d\'une seconde. Fini les cartes perdues.',
    badge:       'Scan & Go',
    badgeClass:  'bg-gym-primary/10 text-gym-primary',
  },
  {
    icon:        'card_membership',
    iconBg:      'bg-gym-secondary/10',
    iconColor:   'text-gym-secondary',
    title:       'Abonnements intelligents',
    description: 'Mensuel, annuel, personnalisé — crée tes types d\'abonnements et renouvelle en un clic. Le statut actif/expiré est calculé automatiquement à chaque scan.',
    badge:       null,
    badgeClass:  '',
  },
  {
    icon:        'payments',
    iconBg:      'bg-gym-tertiary/10',
    iconColor:   'text-gym-tertiary',
    title:       'Paiements multi-modes',
    description: 'Espèces, carte bancaire ou Mobile Money — la réceptionniste enregistre le mode de paiement après vérification. Chaque transaction est tracée avec référence unique.',
    badge:       'FedaPay intégré',
    badgeClass:  'bg-gym-tertiary/10 text-gym-tertiary',
  },
  {
    icon:        'shopping_bag',
    iconBg:      'bg-gym-primary-container/10',
    iconColor:   'text-gym-primary',
    title:       'Boutique en ligne',
    description: 'Suppléments, équipements, vêtements — commande depuis chez toi, paye via FedaPay et choisis entre la livraison à domicile ou le retrait en salle. Suivi en temps réel.',
    badge:       'Nouveau',
    badgeClass:  'bg-gym-secondary/10 text-gym-secondary',
  },
  {
    icon:        'dashboard',
    iconBg:      'bg-gym-surface-high',
    iconColor:   'text-gym-on-surface',
    title:       'Dashboard temps réel',
    description: 'Revenus du jour, check-ins, abonnements actifs, ruptures de stock — toutes les métriques de ta salle en un coup d\'œil. Données vivantes, décisions éclairées.',
    badge:       null,
    badgeClass:  '',
  },
  {
    icon:        'local_shipping',
    iconBg:      'bg-gym-secondary/10',
    iconColor:   'text-gym-secondary',
    title:       'Suivi de livraison',
    description: 'De la préparation à la livraison, suis chaque commande étape par étape. Tes clients voient l\'évolution en direct : Reçue → Préparation → Expédiée → Livrée.',
    badge:       null,
    badgeClass:  '',
  },
]
</script>