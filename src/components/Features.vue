<template>
  <section id="features" class="py-24 bg-[#0a0a0f] relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full"></div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block">
          Tout ce qu'il faut pour gérer votre salle
        </span>
        <h2 class="font-headline text-4xl font-bold mb-4 text-white">
          Une plateforme.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Zéro complexité.</span>
        </h2>
        <p class="text-zinc-400">De l'accès des membres à la boutique en ligne, chaque outil est pensé pour les promoteurs de salles de sport.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div v-for="f in features" :key="f.title"
          class="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 hover:border-indigo-500/30 transition-all duration-500 group">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            :class="f.bg">
            <span class="material-symbols-outlined text-3xl" :class="f.color">{{ f.icon }}</span>
          </div>
          <h3 class="font-headline text-xl font-bold mb-3 text-white">{{ f.title }}</h3>
          <p class="text-zinc-400 leading-relaxed text-sm">{{ f.desc }}</p>
          <span v-if="f.badge"
            class="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full"
            :class="f.badgeClass">{{ f.badge }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: 'qr_code_2', bg: 'bg-indigo-500/10', color: 'text-indigo-400',
    title: 'Accès QR Code',
    desc: 'Chaque membre reçoit un QR code unique. Scannez à l\'entrée pour vérifier l\'abonnement en temps réel. Plus de cartes perdues, plus de listes papier.',
    badge: 'Scan & Go', badgeClass: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    icon: 'card_membership', bg: 'bg-purple-500/10', color: 'text-purple-400',
    title: 'Abonnements intelligents',
    desc: 'Créez vos formules (mensuel, annuel, personnalisé). Le statut actif/expiré est calculé automatiquement. Renouvellement en un clic.',
    badge: null, badgeClass: '',
  },
  {
    icon: 'storefront', bg: 'bg-indigo-500/10', color: 'text-indigo-400',
    title: 'Boutique par salle',
    desc: 'Chaque salle obtient sa propre boutique en ligne dédiée. Ajoutez des produits, fixez vos prix, et vendez à vos membres comme à des clients externes.',
    badge: 'Nouveau', badgeClass: 'bg-purple-500/10 text-purple-400',
  },
  {
    icon: 'payments', bg: 'bg-emerald-500/10', color: 'text-emerald-400',
    title: 'Paiements FedaPay',
    desc: 'Acceptez les paiements par carte bancaire et Mobile Money via FedaPay. Pas de terminal, pas de commission excessive. Sécurisé et rapide.',
    badge: 'FedaPay', badgeClass: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: 'dashboard', bg: 'bg-white/5', color: 'text-white',
    title: 'Dashboard temps réel',
    desc: 'Revenus du jour, check-ins, abonnements actifs, stock boutique — toutes les métriques de votre salle en un coup d\'œil. Décisions éclairées.',
    badge: null, badgeClass: '',
  },
  {
    icon: 'groups', bg: 'bg-indigo-500/10', color: 'text-indigo-400',
    title: 'Gestion des clients',
    desc: 'Répertoire complet des membres avec historique des présences, abonnements et achats. Recherche rapide, filtres, export.',
    badge: null, badgeClass: '',
  },
  {
    icon: 'local_shipping', bg: 'bg-purple-500/10', color: 'text-purple-400',
    title: 'Suivi des commandes',
    desc: 'De la préparation à la livraison, suivez chaque commande étape par étape. Vos clients voient l\'évolution en direct.',
    badge: null, badgeClass: '',
  },
  {
    icon: 'workspace_premium', bg: 'bg-amber-500/10', color: 'text-amber-400',
    title: 'Multi-formules',
    desc: 'Proposez Basic (15 000 FCFA) ou Premium (25 000 FCFA). La boutique en ligne est incluse dans le plan Premium et la période d\'essai.',
    badge: 'Basic & Premium', badgeClass: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: 'rocket_launch', bg: 'bg-indigo-500/10', color: 'text-indigo-400',
    title: 'Essai gratuit 7 jours',
    desc: 'Lancez-vous sans risque. Pendant 7 jours, profitez de toutes les fonctionnalités Premium. Aucune carte bancaire requise.',
    badge: 'Sans carte', badgeClass: 'bg-indigo-500/10 text-indigo-400',
  },
]
</script>
