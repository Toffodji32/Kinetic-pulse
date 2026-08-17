<template>
  <section id="contact" class="py-16 bg-[#050508] border-t border-white/5">
    <div class="container mx-auto px-6">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        <div class="md:col-span-1">
          <div class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-headline mb-4">
            KINETIC PULSE
          </div>
          <p class="text-zinc-500 text-sm leading-relaxed mb-6">
            La plateforme SaaS qui digitalise les salles de sport en Afrique. QR code, abonnements, boutique en ligne — tout en un.
          </p>
        </div>

        <div>
          <h4 class="font-bold text-white text-sm uppercase tracking-widest mb-6">Plateforme</h4>
          <ul class="space-y-3">
            <li><a href="#features" class="text-zinc-500 hover:text-indigo-400 transition-colors text-sm">Fonctionnalités</a></li>
            <li><a href="#pricing" class="text-zinc-500 hover:text-indigo-400 transition-colors text-sm">Tarifs</a></li>
            <li><router-link to="/register-gym" class="text-zinc-500 hover:text-indigo-400 transition-colors text-sm">Créer ma salle</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-white text-sm uppercase tracking-widest mb-6">Promoteurs</h4>
          <ul class="space-y-3">
            <li><router-link to="/login" class="text-zinc-500 hover:text-indigo-400 transition-colors text-sm">Connexion admin</router-link></li>
            <li><router-link to="/admin/dashboard" class="text-zinc-500 hover:text-indigo-400 transition-colors text-sm">Dashboard</router-link></li>
            <li><router-link to="/admin/gym/subscription" class="text-zinc-500 hover:text-indigo-400 transition-colors text-sm">Mon abonnement</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-white text-sm uppercase tracking-widest mb-6">Contact</h4>
          <ul class="space-y-3 text-zinc-500 text-sm">
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-indigo-400 text-sm mt-0.5">location_on</span>
              Cotonou, Bénin
            </li>
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-indigo-400 text-sm mt-0.5">alternate_email</span>
              contact@kinetic-pulse.com
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-zinc-600">© 2026 Kinetic Pulse. Tous droits réservés.</p>
        <div class="flex gap-8">
          <a href="#" class="text-xs text-zinc-600 hover:text-indigo-400 transition-colors">Confidentialité</a>
          <a href="#" class="text-xs text-zinc-600 hover:text-indigo-400 transition-colors">Conditions</a>
        </div>
      </div>
    </div>
  </section>
</template>
