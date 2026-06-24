<template>
  <section class="relative min-h-screen flex items-center pt-20 overflow-hidden">

    <div class="absolute inset-0 z-0">
      <img class="w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
        alt="Gym" />
      <div class="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-3xl space-y-8">

        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-indigo-400 text-xs uppercase tracking-widest border border-white/10 font-semibold">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
          </span>
          Plateforme SaaS pour salles de sport
        </div>

        <h1 class="font-headline text-5xl md:text-7xl font-black leading-tight tracking-tighter text-white">
          Gérez votre salle<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            sans papier.<br />
          </span>
          Sans stress.
        </h1>

        <p class="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed">
          QR codes, abonnements, boutique en ligne, dashboard temps réel. 
          Lancez votre salle de sport connectée en 2 minutes. 
          Vos membres scannent, vous encaissez, on s'occupe du reste.
        </p>

        <div class="flex flex-wrap gap-4 pt-4">
          <router-link to="/register-gym">
            <button class="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full text-lg shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 transition-all">
              Créer votre salle de gym
            </button>
          </router-link>
          <button @click="scrollTo('features')"
            class="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full text-lg hover:bg-white/10 transition-all">
            Découvrir
          </button>
        </div>

        <div class="flex flex-wrap gap-8 pt-12">
          <div>
            <span class="text-3xl font-headline font-bold text-indigo-400">QR Code</span>
            <span class="block text-sm text-zinc-500 uppercase tracking-wider">Accès instantané</span>
          </div>
          <div>
            <span class="text-3xl font-headline font-bold text-purple-400">2 plans</span>
            <span class="block text-sm text-zinc-500 uppercase tracking-wider">Basic & Premium</span>
          </div>
          <div>
            <span class="text-3xl font-headline font-bold text-indigo-400">Boutique</span>
            <span class="block text-sm text-zinc-500 uppercase tracking-wider">Par salle de sport</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
