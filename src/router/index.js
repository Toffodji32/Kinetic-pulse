import AppLayout from '@/layouts/AppLayout.vue'
import ShopLayout from '@/layouts/ShopLayout.vue'
import { useAuthStore } from '@/stores/auth'
import Categories from '@/views/Dashboard/Categories.vue'
import Clients from '@/views/Dashboard/Clients.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import GymSubscriptionPage from '@/views/Dashboard/GymSubscriptionPage.vue'
import Orders from '@/views/Dashboard/Orders.vue'
import Payments from '@/views/Dashboard/Payments.vue'
import Products from '@/views/Dashboard/Products.vue'
import RegisterGym from '@/views/RegisterGym.vue'
import GymInfo from '@/views/Dashboard/GymInfo.vue'
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
    {
      path: '/register-gym',
      name: 'register-gym',
      component: RegisterGym,
      meta: { public: true },
    },
    {
      path: '/scan',
      name: 'scan',
      component: ScanView,
      meta: { requiresAuth: true },
    },

    // ── Dashboard ADMIN ────────────────────────
    {
      path: '/admin',
      component: AppLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', redirect: { name: 'dashboard' } },
        { path: 'dashboard',     name: 'dashboard',           component: Dashboard     },
        { path: 'clients',       name: 'admin-clients',       component: Clients       },
        { path: 'subscriptions', name: 'admin-subscriptions', component: Subscriptions },
        { path: 'payments',      name: 'admin-payments',      component: Payments      },
        { path: 'orders',        name: 'admin-orders',        component: Orders        },
        { path: 'products',      name: 'admin-products',      component: Products      },
        { path: 'users',         name: 'admin-users',         component: Users         },
        { path: 'gym/info',      name: 'admin-gym-info',      component: GymInfo      },
        { path: 'categories',    name: 'admin-categories',    component: Categories    },
        { path: 'gym/subscription', name: 'admin-gym-subscription', component: GymSubscriptionPage },
        { path: 'settings',      name: 'admin-settings',      component: Settings      },
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
          meta: { public: true }, // ← toujours public !
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: { public: true },
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  const isAuthenticated = authStore.isAuthenticated
  const userRoles       = authStore.user?.roles || []
  const isAdmin         = userRoles.includes('ROLE_ADMIN')
  const isReceptionist  = userRoles.includes('ROLE_USER')
  const isClient        = userRoles.includes('ROLE_CLIENT')

  // ── 1. Routes publiques → toujours autorisé ──
  if (to.meta.public) return true

  // ── 2. Routes boutique client ─────────────────
  if (to.meta.requiresClient) {
    if (!isAuthenticated) {
      return { name: 'shop-login', query: { redirect: to.fullPath } }
    }
    if ((isAdmin || isReceptionist) && !isClient) {
      return { name: 'dashboard' }
    }
    return true
  }

  // ── 3. Routes admin → ROLE_ADMIN obligatoire ──
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (!isAdmin) {
      if (isClient) return { name: 'shop-home' }
      return { name: 'login' }
    }
    return true
  }

  // ── 4. Routes auth générales ──────────────────
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (isClient && !to.path.startsWith('/shop')) {
      return { name: 'shop-home' }
    }
    return true
  }

  // ── 5. Déjà connecté sur /login → rediriger ──
  // NE gérer que /login — pas shop-login car c'est public
  if (to.name === 'login' && isAuthenticated) {
    if (isAdmin || isReceptionist) return { name: 'dashboard' }
    if (isClient)                  return { name: 'shop-home' }
  }

  return true
})

export default router