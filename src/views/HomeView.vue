<template>
  <transition name="fade-up" mode="out-in">
    <div>
      <section class="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="text-center lg:text-left">
              <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-lg">
                <span class="material-symbols-outlined text-white text-2xl">bolt</span>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-[#131b2e] tracking-tight leading-tight">
                Gérez votre salle de sport<br/>
                <span class="text-indigo-600">en toute simplicité</span>
              </h1>
              <p class="text-lg text-[#464554] mt-6 max-w-lg mx-auto lg:mx-0">
                Kinetic Pulse vous offre tous les outils pour gérer vos abonnements, clients, employés et boutique en ligne.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <el-button type="primary" size="large" style="height:52px; border-radius:14px; font-weight:700; padding:0 32px;" @click="$router.push('/register-gym')">
                  Commencer gratuitement
                </el-button>
                <el-button size="large" style="height:52px; border-radius:14px; font-weight:700; padding:0 32px;" @click="$router.push('/login')">
                  Se connecter
                </el-button>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="i in 4" :key="i" class="bg-indigo-50 rounded-2xl p-4">
                    <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                      <span class="material-symbols-outlined text-indigo-600">dashboard</span>
                    </div>
                    <p class="font-bold text-sm text-[#131b2e]">Statistiques</p>
                    <p class="text-xs text-[#464554] mt-1">En temps réel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-black text-[#131b2e] tracking-tight">Tout ce dont vous avez besoin</h2>
            <p class="text-[#464554] mt-4 max-w-2xl mx-auto text-lg">Une plateforme complète pour gérer votre salle de sport de A à Z</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div v-for="feature in features" :key="feature.title" class="bg-[#faf8ff] rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
              <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-indigo-600 text-2xl">{{ feature.icon }}</span>
              </div>
              <h3 class="text-xl font-bold text-[#131b2e] mb-3">{{ feature.title }}</h3>
              <p class="text-[#464554] leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 bg-[#faf8ff]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-black text-[#131b2e] tracking-tight">Des offres adaptées à votre structure</h2>
            <p class="text-[#464554] mt-4 max-w-2xl mx-auto text-lg">Choisissez le plan qui correspond à vos besoins</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div v-for="(plan, idx) in plans" :key="plan.name" class="bg-white rounded-3xl p-8 border-2 flex flex-col relative transition-all duration-200 hover:shadow-lg"
              :class="plan.recommended ? 'border-indigo-600 shadow-xl scale-[1.02] md:scale-105' : 'border-gray-100'">
              <div v-if="plan.recommended" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                Recommandé
              </div>
              <div class="mb-6">
                <span class="material-symbols-outlined text-indigo-600 text-3xl mb-4 block">{{ plan.icon }}</span>
                <h3 class="text-2xl font-bold text-[#131b2e]">{{ plan.name }}</h3>
                <div class="mt-4 flex items-baseline gap-1">
                  <span class="text-4xl font-black text-[#131b2e]">{{ plan.price }}</span>
                  <span class="text-[#464554] text-sm">/mois</span>
                </div>
              </div>
              <ul class="space-y-3 mb-8 flex-1">
                <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3 text-sm text-[#464554]">
                  <span class="material-symbols-outlined text-indigo-600 text-lg flex-shrink-0">check</span>
                  {{ feature }}
                </li>
              </ul>
              <el-button :type="plan.recommended ? 'primary' : 'default'" size="large" class="w-full" style="height:48px; border-radius:12px; font-weight:700;" @click="$router.push('/register-gym')">
                {{ plan.cta }}
              </el-button>
            </div>
          </div>
        </div>
      </section>

      <section class="py-24 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#131b2e] tracking-tight mb-6">
            Prêt à transformer votre gestion ?
          </h2>
          <p class="text-lg text-[#464554] max-w-2xl mx-auto mb-10">
            Rejoignez des centaines de salles de sport qui nous font confiance. Essayez gratuitement pendant 14 jours.
          </p>
          <el-button type="primary" size="large" style="height:56px; border-radius:14px; font-weight:700; padding:0 40px; font-size:1.125rem;" @click="$router.push('/register-gym')">
            Essayer gratuitement
          </el-button>
        </div>
      </section>
    </div>
  </transition>
</template>

<script setup>
const features = [
  {
    icon: 'subscriptions',
    title: 'Abonnements',
    desc: 'Gérez les abonnements de vos membres, suivez les échéances et automatisez les relances en un clic.',
  },
  {
    icon: 'store',
    title: 'Boutique en ligne',
    desc: 'Vendez vos produits et services directement depuis votre boutique intégrée. Paiements sécurisés.',
  },
  {
    icon: 'qr_code_scanner',
    title: 'Scan QR Code',
    desc: 'Chaque membre reçoit un QR code unique. Scannez à l\'entrée pour un accès rapide et sécurisé.',
  },
]

const plans = [
  {
    name: 'Gratuit',
    price: '0 €',
    icon: 'rocket_launch',
    cta: 'Commencer',
    recommended: false,
    features: [
      'Jusqu\'à 30 membres',
      'Gestion des abonnements',
      'Scan QR code',
      '1 administrateur',
    ],
  },
  {
    name: 'Pro',
    price: '29 €',
    icon: 'stars',
    cta: 'Essayer Pro',
    recommended: true,
    features: [
      'Membres illimités',
      'Boutique en ligne',
      'Paiements en ligne',
      'Employés illimités',
      'Statistiques avancées',
      'Support prioritaire',
    ],
  },
  {
    name: 'Premium',
    price: '79 €',
    icon: 'workspace_premium',
    cta: 'Essayer Premium',
    recommended: false,
    features: [
      'Tout le plan Pro',
      'API personnalisée',
      'Marque blanche',
      'SLA 99.9%',
      'Compte dédié',
      'Formation offerte',
    ],
  },
]
</script>
