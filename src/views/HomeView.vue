<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white">
    <NavBar />
    <HeaderHero />
    <Features />

    <!-- Section Promo -->
    <section class="py-24 bg-[#050508]">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <span class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block">
            Lancez-vous en 4 étapes
          </span>
          <h2 class="font-headline text-4xl font-bold mb-4 text-white">
            De l'inscription à la première vente — <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">simple et rapide.</span>
          </h2>
          <div class="h-1 w-20 bg-indigo-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div class="relative flex flex-col md:flex-row justify-between items-start gap-8">
          <div class="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-white/5 z-0"></div>

          <div v-for="(step, i) in steps" :key="step.title"
            class="relative z-10 flex-1 flex flex-col items-center text-center group">
            <div
              class="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-all duration-500">
              <span class="text-2xl font-black text-indigo-400 group-hover:text-white transition-colors">{{ i + 1 }}</span>
            </div>
            <h4 class="font-headline text-lg font-bold mb-2 text-white">{{ step.title }}</h4>
            <p class="text-sm text-zinc-500 max-w-[180px]">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <Pricing />
    <Shop />

    <!-- CTA Final -->
    <section class="py-32 bg-[#0a0a0f] relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img class="w-full h-full object-cover opacity-10"
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10 text-center">
        <h2 class="font-headline text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter text-white">
          Prêt à digitaliser<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
            style="text-shadow: 0 0 40px rgba(99,102,241,0.3);">
            votre salle ?
          </span>
        </h2>
        <p class="text-zinc-400 text-xl max-w-2xl mx-auto mb-12">
          Créez votre salle de sport en 2 minutes. QR codes, abonnements, boutique en ligne — on s'occupe de tout. 
          Essayez gratuitement pendant 7 jours, sans carte bancaire.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <router-link to="/register-gym">
            <button class="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-full text-xl shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 transition-all">
              Créer votre salle de gym
            </button>
          </router-link>
          <button @click="scrollTo('features')"
            class="px-12 py-5 border border-white/10 text-white font-black rounded-full text-xl hover:bg-white/5 transition-all">
            En savoir plus
          </button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Footer      from '../components/Footer.vue'
import HeaderHero  from '../components/HeaderHero.vue'
import NavBar      from '../components/NavBar.vue'
import Pricing     from '../components/Pricing.vue'
import Shop        from '../components/Shop.vue'
import Features    from '../components/Features.vue'

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const steps = [
  {
    title: 'Créez votre salle',
    desc: 'Inscrivez-vous, renseignez les infos de votre salle et commencez l\'essai gratuit.',
  },
  {
    title: 'Configurez vos offres',
    desc: 'Définissez vos abonnements, ajoutez des produits et personnalisez votre boutique.',
  },
  {
    title: 'Vos membres scannent',
    desc: 'Chaque membre reçoit un QR code. Scannez à l\'entrée — accès instantané.',
  },
  {
    title: 'Gagnez du temps',
    desc: 'Dashboard, ventes, stock : tout est centralisé. Concentrez-vous sur votre activité.',
  },
]
</script>
