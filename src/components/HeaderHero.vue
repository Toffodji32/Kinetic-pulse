<template>
  <section class="relative min-h-screen flex items-center pt-20 overflow-hidden">

    <!-- Background image -->
    <div class="absolute inset-0 z-0">
      <img
        class="w-full h-full object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk81m0uQoHDAOox9RGnPPriUrD2krqGSAHrl2txAc3cb2ZsOj98apFW_yJBa7r6U6UlGLMy-FQcHyU3Dbipc8pdbJgA9JxPfUwFXVVqlgU6Hz-Wd3MkqKwWqehUKkaRszSZyLNfiy-nx5T9j3z7HK7ZyZ3pFEclevf4ZmQlrqiF6ryE7iKDZNIPwkxqgnSQyIyeXMQ-qvleB8_J4FRdjnLR3Xk8UQ6VBrmDEli5BR8PFqQmY3miPK4rHzr0LUrbubJHK4Arc9Q7Kc"
      />
      <div class="absolute inset-0 hero-gradient"></div>
      <!-- Glow effects -->
      <div class="absolute top-1/3 left-1/4 w-96 h-96 bg-gym-primary/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gym-secondary/10 blur-[100px] rounded-full"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10 max-w-5xl">
      <div class="space-y-8">

        <!-- Badge live -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gym-surface-container text-gym-primary font-label text-xs uppercase tracking-widest border border-gym-outline-variant/20">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gym-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-gym-primary"></span>
          </span>
          Accès QR · Abonnements · Boutique en ligne — tout en un
        </div>

        <!-- Titre principal -->
        <h1 class="font-headline text-5xl md:text-7xl font-black leading-tight tracking-tighter text-gym-on-surface">
          Ta salle.<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-gym-primary to-gym-secondary">
            Ton QR code.
          </span><br />
          Ton rythme.
        </h1>

        <!-- Sous-titre -->
        <p class="text-gym-on-surface-variant text-lg md:text-xl max-w-xl leading-relaxed">
          Kinetic Pulse révolutionne ta gestion de salle — accès instantané par QR code, abonnements automatisés, boutique de suppléments livrée chez toi. Le tout piloté depuis un dashboard temps réel.
        </p>

        <!-- CTA buttons -->
        <div class="flex flex-wrap gap-4 pt-4">
          <router-link to="/shop/login">
            <button class="px-8 py-4 bg-gradient-to-r from-gym-primary to-gym-primary-container text-gym-on-primary font-bold rounded-full text-lg shadow-[0_0_30px_-5px_rgba(105,218,255,0.4)] hover:scale-105 active:scale-95 transition-all">
              Créer mon accès
            </button>
          </router-link>
          <button
            @click="scrollTo('features')"
            class="px-8 py-4 bg-gym-surface-variant/40 backdrop-blur-md border border-gym-outline-variant/30 text-gym-on-surface font-bold rounded-full text-lg hover:bg-gym-surface-variant/60 transition-all"
          >
            Voir comment ça marche
          </button>
        </div>

        <!-- Stats clés tirées du vrai projet -->
        <div class="flex flex-wrap gap-8 pt-12">
          <div class="flex flex-col">
            <span class="text-3xl font-headline font-bold text-gym-primary">QR Code</span>
            <span class="text-sm font-label text-gym-on-surface-variant uppercase tracking-wider">Accès instantané</span>
          </div>
          <div class="flex flex-col">
            <span class="text-3xl font-headline font-bold text-gym-secondary">3 modes</span>
            <span class="text-sm font-label text-gym-on-surface-variant uppercase tracking-wider">Espèces · Carte · Mobile Money</span>
          </div>
          <div class="flex flex-col">
            <span class="text-3xl font-headline font-bold text-gym-tertiary">Livraison</span>
            <span class="text-sm font-label text-gym-on-surface-variant uppercase tracking-wider">Domicile ou retrait en salle</span>
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