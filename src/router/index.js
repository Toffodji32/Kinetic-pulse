import AppLayout from '@/layouts/AppLayout.vue'
import ShopLayout from '@/layouts/ShopLayout.vue'
import { useAuthStore } from '@/stores/auth'
import Categories from '@/views/Dashboard/Categories.vue'
import Clients from '@/views/Dashboard/Clients.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import Orders from '@/views/Dashboard/Orders.vue'
import Payments from '@/views/Dashboard/Payments.vue'
import Products from '@/views/Dashboard/Products.vue'
import Roles from '@/views/Dashboard/Roles.vue'
import Settings from '@/views/Dashboard/Settings.vue'
import Subscriptions from '@/views/Dashboard/Subscriptions.vue'
import Users from '@/views/Dashboard/Users.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import ScanView from '@/views/ScanView.vue'
import ShopCart from '@/views/Shop/ShopCart.vue'
import ShopCheckout from '@/views/Shop/ShopCheckout.vue'
import ShopHome from '@/views/Shop/ShopHome.vue'
import ShopLogin from '@/views/Shop/ShopLogin.vue'
import ShopOrders from '@/views/Shop/ShopOrders.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Pages publiques landing ────────────────
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { public: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { public: true },
    },

    // ── Scan QR (admin/receptionniste connecté) ─
    {
      path: '/scan',
      name: 'scan',
      component: ScanView,
      meta: { requiresAuth: true },
    },

    // ── Dashboard ADMIN ────────────────────────
    // Toutes ces routes → ROLE_ADMIN uniquement
    {
      path: '/admin',
      component: AppLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: { name: 'dashboard' },
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'clients',
          name: 'admin-clients',
          component: Clients,
        },
        {
          path: 'subscriptions',
          name: 'admin-subscriptions',
          component: Subscriptions,
        },
        {
          path: 'payments',
          name: 'admin-payments',
          component: Payments,
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: Orders,
        },
        {
          path: 'products',
          name: 'admin-products',
          component: Products,
        },
        {
          path: 'users',
          name: 'admin-users',
          component: Users,
        },
        {
          path: 'roles',
          name: 'admin-roles',
          component: Roles,
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: Categories,
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: Settings,
        },
      ],
    },

    // ── Boutique client ────────────────────────
    {
      path: '/shop',
      component: ShopLayout,
      children: [
        {
          path: '',
          name: 'shop-home',
          component: ShopHome,
          meta: { public: true },
        },
        {
          path: 'cart',
          name: 'shop-cart',
          component: ShopCart,
          meta: { public: true },
        },
        {
          path: 'checkout',
          name: 'shop-checkout',
          component: ShopCheckout,
          meta: { requiresClient: true },
        },
        {
          path: 'orders',
          name: 'shop-orders',
          component: ShopOrders,
          meta: { requiresClient: true },
        },
        {
          path: 'login',
          name: 'shop-login',
          component: ShopLogin,
          meta: { public: true },
        },
      ],
    },

    // ── 404 ───────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: { public: true },
    },
  ],
})

// ── Navigation guard complet ───────────────────
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  const isAuthenticated = authStore.isAuthenticated
  const userRoles = authStore.user?.roles || []

  const isAdmin = userRoles.includes('ROLE_ADMIN')
  const isReceptionist = userRoles.includes('ROLE_USER')
  const isClient = userRoles.includes('ROLE_CLIENT')

  // ── 1. Routes publiques → toujours autorisé ──
  if (to.meta.public) {
    return true
  }

  // ── 2. Routes boutique client ─────────────────
  // checkout et mes commandes → client connecté requis
  if (to.meta.requiresClient) {
    console.log('🛒 Route boutique requiert client')
    if (!isAuthenticated) {
      console.log('❌ Non authentifié → redirection shop-login')
      return { name: 'shop-login', query: { redirect: to.fullPath } }
    }
    // un admin/receptionist ne doit pas aller sur le checkout
    // (sauf s'il a aussi le rôle client)
    if ((isAdmin || isReceptionist) && !isClient) {
      console.log('❌ Admin/Receptionist ne peut pas accéder → redirection dashboard')
      return { name: 'dashboard' }
    }
    console.log('✅ Client autorisé')
    return true
  }

  // ── 3. Routes admin → ROLE_ADMIN obligatoire ──
  if (to.meta.requiresAdmin) {
    console.log('🔒 Route ADMIN requise')
    if (!isAuthenticated) {
      console.log('❌ Non authentifié → redirection login')
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (!isAdmin) {
      console.log('❌ Pas admin')
      // réceptionniste connecté → pas accès admin
      if (isReceptionist) {
        console.log('  → Receptionist → redirection login')
        return { name: 'login' }
      }
      // client connecté → redirige vers boutique
      if (isClient) {
        console.log('  → Client → redirection shop-home')
        return { name: 'shop-home' }
      }
      // autre → login
      console.log('  → Autre → redirection login')
      return { name: 'shop-login' }
    }
    console.log('✅ Admin autorisé')
    return true
  }

  // ── 4. Routes auth générales ──────────────────
  if (to.meta.requiresAuth) {
    console.log('🔑 Route requiresAuth')
    if (!isAuthenticated) {
      console.log('❌ Non authentifié → redirection login')
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    // client ne peut pas accéder au scan ou autres routes admin
    if (isClient && !to.path.startsWith('/shop')) {
      console.log('❌ Client ne peut pas accéder → redirection shop-home')
      return { name: 'shop-home' }
    }
    console.log('✅ Auth autorisé')
    return true
  }

  // ── 5. Déjà connecté → rediriger intelligemment ──
  if (to.name === 'login' && isAuthenticated) {
    console.log('🔄 Déjà connecté sur page login')
    if (isAdmin) {
      console.log('  → Admin → redirection dashboard')
      return { name: 'dashboard' }
    }
    if (isReceptionist) {
      console.log('  → Receptionist → redirection dashboard')
      return { name: 'dashboard' }
    }
    if (isClient) {
      console.log('  → Client → redirection shop-home')
      return { name: 'shop-home' }
    }
  }

  if (to.name === 'shop-login' && isAuthenticated) {
    console.log('🛒 Déjà connecté sur page shop-login')
    if (isClient) {
      console.log('  → Client → redirection shop-home')
      return { name: 'shop-home' }
    }
    if (isAdmin || isReceptionist) {
      console.log('  → Admin/Receptionist → redirection dashboard')
      return { name: 'dashboard' }
    }
  }

  console.log('✅ Route autorisée (pas de restriction)')
  console.log('🛡️ ========== GUARD END ==========\n')
  return true
})

export default router
