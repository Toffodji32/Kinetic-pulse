<template>
  <div class="dark bg-gym-surface text-gym-on-surface">
    <NavBar />
    <HeaderHero />
    <Features />

    <!-- Section Parcours -->
    <section class="py-24 bg-gym-surface-low">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <span class="text-xs font-bold uppercase tracking-widest text-gym-primary mb-3 block">
            Simple comme bonjour
          </span>
          <h2 class="font-headline text-4xl font-bold mb-4 text-gym-on-surface">
            De l'inscription à l'accès — <span class="text-gym-primary">4 étapes.</span>
          </h2>
          <div class="h-1.5 w-24 bg-gym-primary mx-auto rounded-full mt-6"></div>
        </div>

        <div class="relative flex flex-col md:flex-row justify-between items-start gap-8">
          <div class="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gym-outline-variant/20 z-0"></div>

          <div
            v-for="step in steps"
            :key="step.title"
            class="relative z-10 flex-1 flex flex-col items-center text-center group"
          >
            <div
              class="w-20 h-20 bg-gym-surface-high border-2 border-gym-primary/40 rounded-full flex items-center justify-center mb-6 group-hover:bg-gym-primary group-hover:text-gym-on-primary transition-all duration-500"
            >
              <span class="material-symbols-outlined text-3xl text-gym-on-surface group-hover:text-gym-on-primary">
                {{ step.icon }}
              </span>
            </div>
            <h4 class="font-headline text-lg font-bold mb-2 text-gym-on-surface">{{ step.title }}</h4>
            <p class="text-sm text-gym-on-surface-variant max-w-[160px]">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <Pricing />
    <Shop />

    <!-- Section Témoignages -->
    <section class="py-24 bg-gym-surface">
      <div class="container mx-auto px-6">
        <h2 class="font-headline text-3xl font-bold text-center mb-4 text-gym-on-surface">
          Ils ont scanné. <span class="text-gym-primary">Ils ont transformé.</span>
        </h2>
        <p class="text-center text-gym-on-surface-variant mb-16 max-w-xl mx-auto">
          Ce que nos membres disent après avoir découvert Kinetic Pulse.
        </p>

        <div class="flex overflow-x-auto pb-12 gap-8 no-scrollbar snap-x">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="min-w-[320px] md:min-w-[450px] snap-center glass-panel p-8 rounded-3xl border border-gym-outline-variant/10 flex-shrink-0"
          >
            <div class="flex gap-1 mb-6 text-gym-tertiary">
              <span v-for="i in 5" :key="i" class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
            </div>
            <p class="text-lg italic mb-8 leading-relaxed text-gym-on-surface">"{{ testimonial.quote }}"</p>
            <div class="flex items-center gap-4">
              <img class="w-12 h-12 rounded-full object-cover" :src="testimonial.avatar" />
              <div>
                <p class="font-bold text-gym-on-surface">{{ testimonial.name }}</p>
                <p class="text-xs text-gym-on-surface-variant">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-32 bg-gym-surface relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          class="w-full h-full object-cover opacity-20"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1LsC9NNEjRZVSealyJyKusiitjWdVQDx814ifgCLniLIpC1rZJoAl-NMKXubS2UYr-jbNHRYST9LV2DrblUNNYASR0hhFEb8VSwtlRsMKyWHaai5F_WjLCIL9635i9zc1bBmwgoXzM1pIyLT1BNEckUUD8DHCtO3BReHSc89NhIygT8URLaZCdUwJX6Yp6qG8Ql1KuIE7ZhZo9HQrrxEHgr2jHzqDEO924jiyBfmAhoQKNtfAbnhIf9vwE5K4OmZfwBsOucou3ss"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gym-surface via-transparent to-gym-surface"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10 text-center">
        <h2 class="font-headline text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter text-gym-on-surface">
          PRÊT À LANCER<br/>
          <span class="text-gym-primary" style="text-shadow: 0 0 40px rgba(105,218,255,0.5);">
            VOTRE SALLE ?
          </span>
        </h2>
        <p class="text-gym-on-surface-variant text-xl max-w-2xl mx-auto mb-12">
          Créez votre salle de sport en 2 minutes. QR codes, abonnements, boutique en ligne — on s'occupe de tout. Vous gérez, on digitalise.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <router-link to="/register-gym">
            <button class="px-12 py-5 bg-gradient-to-r from-gym-primary to-gym-primary-container text-gym-on-primary font-black rounded-full text-xl shadow-[0_0_50px_-10px_rgba(105,218,255,0.5)] hover:scale-105 active:scale-95 transition-all">
              Créer votre salle de gym
            </button>
          </router-link>
          <button
            @click="scrollTo('features')"
            class="px-12 py-5 glass-panel border border-gym-outline-variant/30 text-gym-on-surface font-black rounded-full text-xl hover:bg-gym-surface-variant/60 transition-all"
          >
            En savoir plus
          </button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Features    from '../components/Features.vue'
import Footer      from '../components/Footer.vue'
import HeaderHero  from '../components/HeaderHero.vue'
import NavBar      from '../components/NavBar.vue'
import Pricing     from '../components/Pricing.vue'
import Shop        from '../components/Shop.vue'

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const steps = [
  {
    icon:        'person_add',
    title:       'Crée ton compte',
    description: 'Email, mot de passe — 30 secondes chrono.',
  },
  {
    icon:        'qr_code_scanner',
    title:       'Reçois ton QR code',
    description: 'Généré automatiquement à ton inscription.',
  },
  {
    icon:        'account_balance_wallet',
    title:       'Choisis et paie',
    description: 'Espèces, carte ou Mobile Money — sur place.',
  },
  {
    icon:        'fitness_center',
    title:       'Scanne & entraîne-toi',
    description: 'Accès instantané, présence enregistrée.',
  },
  {
    icon:        'local_shipping',
    title:       'Commande en ligne',
    description: 'Boutique livrée chez toi ou en retrait salle.',
  },
]

const testimonials = [
  {
    quote:  'Le QR code c\'est révolutionnaire. J\'entre, je scanne, je m\'entraîne. Plus besoin de chercher une carte ou de faire la queue à l\'accueil.',
    name:   'Marcus Chen',
    role:   'Membre Pro depuis 6 mois',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhoHq0QuyWl6J-9tIaS5i18MfKNXXV4ktNY959nk9A_H9gI7Ij5z6qDZ6XemekQ39HsDlsMRTJA1Aq_HmuNhTLvyhKEwV4kkH1Qrs-50Zhre-vWHide8_DfqILS15Fpg4omnXckUH0hkym8MlKasnDRivthpiStGE0yc83fjwqFrXnO2V6bJT39jZHN46GrWkLFXgjBpwTI0k07cCZYAWf2oWJhcwqKohjFUCGWXuvEduT9uQx88K-F0RgHjOmggT2u_xQW-P0gMg',
  },
  {
    quote:  'J\'ai commandé ma whey depuis la boutique, payé via Mobile Money et reçu ma commande en 2 jours. Le suivi en temps réel sur l\'app c\'est exactement ce qu\'il fallait.',
    name:   'Sarah Jenkins',
    role:   'Cliente boutique — Plan Elite',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADRHSXIKDYRk-zllx8PBikYC5XH8cNsi-_e4bureAltriupt87tTHNlqy7yMZL9GiFeImL5UUMGFBBehFxrFQAOZ-W-0aO2CeSCNievwXlArkB1pUuj5lMYG7519z-BnSbZUffzQrxyEsLFHbCcRARbvkVy_gioj_58Bb6uCy1yEC62P09gVsiBq74eq2eqj1CKDtYVE-DGdMHzhaKt3X3Z2f9DI_CRYnGCsxGijZogdAEzvU1fZBbhQSbt9ho3FKjNMowrEZ3muY',
  },
  {
    quote:  'La réceptionniste voit tout en temps réel — mon abonnement, mes entrées, mes commandes. Quand mon abonnement expire, elle me le dit au scan. C\'est précis et professionnel.',
    name:   'David Okoro',
    role:   'Membre Starter',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrr8YWmbI2d7weiN6N81fAcAtFDWlF2YoHHBYa8aBt9l4UThKDLe0VWzmVhtx80k4dzjAFMdtLeopQ1QJllaFm2XZJ_FWpZTpuQbQNBm6hHS_vjhs6BkbI5yaz9P4VGAWAuNhNpQ2p6E7Mm2ACmZCjs5kBM6oGHZOF0MjGFXTzAPpfFnn75vftgpzqefOk9uJCJ8SswPIZzPlIERdhCLtrxzHHHyWw61kk0ERrcmB4BcsYRgYfUIjD6FTVDE29Q_ahjzgedz1rFtQ',
  },
]
</script>