<template>
  <section id="shop" class="py-24 bg-[#0a0a0f]">
    <div class="container mx-auto px-6">

      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3 block">
          Boutique en ligne
        </span>
        <h2 class="font-headline text-4xl font-bold mb-4 text-white">
          Vendez en ligne.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Depuis votre salle.</span>
        </h2>
        <p class="text-zinc-400">Chaque salle de sport obtient sa propre boutique en ligne. Vendez des suppléments, équipements, vêtements et accessoires à vos membres et au grand public.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div v-for="item in shopFeatures" :key="item.title"
          class="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 text-center">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" :class="item.bg">
            <span class="material-symbols-outlined text-3xl" :class="item.color">{{ item.icon }}</span>
          </div>
          <h3 class="font-bold text-white mb-2">{{ item.title }}</h3>
          <p class="text-zinc-400 text-sm">{{ item.desc }}</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-[2rem] p-10 md:p-16 text-center">
        <h3 class="font-headline text-3xl font-bold text-white mb-4">
          Votre boutique, votre URL
        </h3>
        <p class="text-zinc-400 max-w-xl mx-auto mb-8">
          Chaque salle reçoit une boutique accessible via <span class="text-indigo-400 font-semibold">/shop/votre-salle</span>. 
          Ajoutez des produits, fixez vos prix, et laissez vos clients commander en ligne — livraison ou retrait en salle.
        </p>
        <div class="inline-flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 font-mono text-sm">
          <span class="text-indigo-400">kinetic-pulse.vercel.app</span><span class="text-purple-400">/shop/</span><span class="text-white">ma-salle</span>
        </div>
        <div class="flex flex-wrap justify-center gap-4 mt-10">
          <div class="flex items-center gap-2 text-sm text-zinc-400">
            <span class="material-symbols-outlined text-indigo-400 text-lg">shopping_cart</span>
            Panier en ligne
          </div>
          <div class="flex items-center gap-2 text-sm text-zinc-400">
            <span class="material-symbols-outlined text-purple-400 text-lg">payments</span>
            FedaPay sécurisé
          </div>
          <div class="flex items-center gap-2 text-sm text-zinc-400">
            <span class="material-symbols-outlined text-indigo-400 text-lg">local_shipping</span>
            Livraison ou retrait
          </div>
          <div class="flex items-center gap-2 text-sm text-zinc-400">
            <span class="material-symbols-outlined text-purple-400 text-lg">receipt_long</span>
            Suivi des commandes
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const shopFeatures = [
  {
    icon: 'inventory_2', bg: 'bg-indigo-500/10', color: 'text-indigo-400',
    title: 'Catalogue illimité',
    desc: 'Ajoutez autant de produits que vous voulez. Suppléments, équipements, vêtements, accessoires — gérez votre stock en temps réel.',
  },
  {
    icon: 'payments', bg: 'bg-emerald-500/10', color: 'text-emerald-400',
    title: 'Paiement FedaPay',
    desc: 'Carte bancaire et Mobile Money. Les fonds sont sécurisés et le suivi des transactions est automatique.',
  },
  {
    icon: 'groups', bg: 'bg-purple-500/10', color: 'text-purple-400',
    title: 'Membres + Externes',
    desc: 'Vos membres abonnés peuvent commander, mais aussi les clients externes. Élargissez votre clientèle au-delà de la salle.',
  },
]
</script>
