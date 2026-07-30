<template>
  <div class="bg-[#faf8ff] min-h-screen p-4 sm:p-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black font-headline tracking-tight text-indigo-600">Abonnements</h2>
        <p class="text-[#464554] font-medium text-sm sm:text-base">Gestion de tous les abonnements</p>
      </div>
      <el-button type="primary" size="large" @click="openCreateModal()" class="hidden sm:inline-flex"
        style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700; padding: 12px 20px;">
        <span class="material-symbols-outlined text-lg mr-1">add</span>
        Nouvel abonnement
      </el-button>
    </div>

    <!-- Stats rapides -->
    <div class="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-indigo-500">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#464554] mb-1">Total clients</p>
        <p class="text-xl sm:text-3xl font-black text-[#131b2e]">{{ subStore.latestPerClient.length }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-green-500">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#464554] mb-1">Actifs</p>
        <p class="text-xl sm:text-3xl font-black text-green-600">{{ subStore.activeSubscriptions.length }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-l-4 border-red-400">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#464554] mb-1">Expirés</p>
        <p class="text-xl sm:text-3xl font-black text-red-500">{{ subStore.expiredSubscriptions.length }}</p>
      </div>
    </div>

    <!-- Filtres + Recherche -->
    <div class="bg-white rounded-2xl p-3 sm:p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
      <el-input v-model="search" placeholder="Rechercher par client, type..." size="large" clearable style="max-width: 100%; width: 100%; sm:max-width: 320px; sm:width: auto;">
        <template #prefix><span class="material-symbols-outlined text-lg text-[#464554]">search</span></template>
      </el-input>
      <el-select v-model="filterStatus" placeholder="Tous les statuts" size="large" clearable style="width: 100%; sm:width: 180px;" class="sm:!w-[180px]">
        <el-option label="Actif" value="Actif" />
        <el-option label="Expiré" value="Expiré" />
      </el-select>
      <span class="text-[#464554] text-sm font-medium sm:ml-auto">{{ filteredSubs.length }} abonnement(s)</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="subStore.loading" class="space-y-3 sm:space-y-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-100 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-100 rounded w-40 mb-2"></div>
            <div class="h-3 bg-gray-100 rounded w-60"></div>
          </div>
          <div class="h-6 bg-gray-100 rounded w-16"></div>
        </div>
      </div>
    </div>

    <template v-else>

      <!-- Mobile cards -->
      <div class="sm:hidden space-y-3 mb-6">
        <div v-for="sub in paginatedSubs" :key="sub.id" @click="openDetail(sub)"
          class="bg-white rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" :style="{ backgroundColor: getAvatarColor(sub.client) }">
                {{ sub.client?.charAt(0) }}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-[#131b2e] text-sm truncate">{{ sub.client }}</p>
                <p class="text-xs text-indigo-600 font-semibold">{{ sub.type }}</p>
              </div>
            </div>
            <el-tag :type="sub.status === 'Actif' ? 'success' : 'danger'" size="small" round>{{ sub.status }}</el-tag>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-[#464554]">{{ sub.startDate }} →</span>
            <span class="font-semibold" :class="sub.status === 'Actif' ? 'text-green-600' : 'text-red-500'">{{ sub.endDate }}</span>
          </div>
          <div class="mt-3">
            <div class="w-full bg-[#f2f3ff] h-1.5 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all"
                :class="sub.status === 'Actif' ? 'bg-green-500' : 'bg-red-400'"
                :style="{ width: sub.status === 'Actif' ? Math.min(calculateDaysLeft(sub), 100) + '%' : '100%' }"></div>
            </div>
            <p class="text-[10px] text-[#464554] mt-1" v-if="sub.status === 'Actif'">
              {{ calculateDaysLeft(sub) }}% du temps restant
            </p>
          </div>
        </div>
        <!-- Empty mobile -->
        <div v-if="paginatedSubs.length === 0" class="flex flex-col items-center py-12">
          <span class="material-symbols-outlined text-5xl text-gray-200 mb-3">card_membership</span>
          <p class="text-[#464554] font-medium mb-3">Aucun abonnement trouvé</p>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <el-table :data="paginatedSubs" style="width: 100%" empty-text="Aucun abonnement trouvé">
          <el-table-column label="Client" min-width="180">
            <template #default="{ row }">
              <div class="flex items-center gap-3 py-1">
                <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" :style="{ backgroundColor: getAvatarColor(row.client) }">{{ row.client?.charAt(0) }}</div>
                <span class="font-bold text-[#131b2e]">{{ row.client }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Type" min-width="150">
            <template #default="{ row }">
              <span class="font-semibold text-indigo-600">{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Prix" min-width="100">
            <template #default="{ row }">
              <span class="font-bold text-[#131b2e]">{{ row.price }} FCFA</span>
            </template>
          </el-table-column>
          <el-table-column label="Période" min-width="200">
            <template #default="{ row }">
              <div class="text-sm">
                <span class="text-[#464554]">{{ row.startDate }}</span>
                <span class="text-[#464554] mx-1">→</span>
                <span class="font-semibold" :class="row.status === 'Actif' ? 'text-green-600' : 'text-red-500'">{{ row.endDate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Statut" min-width="110" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'Actif' ? 'success' : 'danger'" size="small" round>{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions" min-width="180" align="center">
            <template #default="{ row }">
              <div class="flex gap-2 justify-center">
                <el-button size="small" @click="openDetail(row)" style="background-color: #e0e7ff; color: #4f46e5; border: none; border-radius: 8px; font-weight: 600; min-height: 36px; min-width: 44px;">
                  <span class="material-symbols-outlined text-sm mr-1">visibility</span>
                  Voir
                </el-button>
                <el-button size="small" type="success" plain @click="handleRenew(row)" style="border-radius: 8px; min-height: 36px; min-width: 44px;">
                  <span class="material-symbols-outlined text-sm">refresh</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </template>

    <!-- Pagination -->
    <div class="flex justify-center">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
        :total="filteredSubs.length" layout="total, sizes, prev, pager, next" background />
    </div>

    <!-- Mobile FAB -->
    <button @click="openCreateModal()"
      class="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
      <span class="material-symbols-outlined text-2xl">add</span>
    </button>

    <!-- ═══════════════════════════════════════
         MODAL CRÉATION ABONNEMENT (responsive)
    ═══════════════════════════════════════ -->
    <div class="sm:hidden">
      <el-drawer v-model="showCreateModal" direction="btt" size="90%" :close-on-click-modal="false" @closed="resetCreateForm" title="Nouvel abonnement">
        <template #default>
          <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-position="top" size="large" class="px-2">
            <el-form-item label="Client" prop="client_id">
              <el-select v-model="createForm.client_id" placeholder="Rechercher un client..." filterable style="width: 100%" :loading="clientStore.loading">
                <el-option v-for="c in clientStore.clients" :key="c.id" :label="`${c.firstName} ${c.lastName}`" :value="c.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Type d'abonnement" prop="subscription_type_id">
              <el-select v-model="createForm.subscription_type_id" placeholder="Choisir un type..." style="width: 100%" :loading="typeStore.loading" @change="onTypeChange">
                <el-option v-for="t in typeStore.types" :key="t.id" :value="t.id" :label="`${t.name} — ${t.price} FCFA / ${t.durationDays} jours`" />
              </el-select>
            </el-form-item>
            <div v-if="selectedType" class="bg-[#f2f3ff] rounded-xl p-4 mb-2">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-bold text-indigo-600">{{ selectedType.name }}</p>
                  <p class="text-sm text-[#464554]">Durée : {{ selectedType.durationDays }} jours</p>
                </div>
                <p class="text-xl font-black text-[#131b2e]">{{ selectedType.price }} FCFA</p>
              </div>
              <div class="mt-3 text-xs text-[#464554] flex gap-4">
                <span>Début : <strong>{{ today }}</strong></span>
                <span>Fin : <strong>{{ computedEndDate }}</strong></span>
              </div>
            </div>
            <el-form-item label="Mode de paiement" prop="payment_method">
              <el-radio-group v-model="createForm.payment_method" size="large" class="w-full flex flex-col sm:flex-row gap-2">
                <el-radio-button value="especes" style="flex: 1; text-align: center;">💵 Espèces</el-radio-button>
                <el-radio-button value="carte" style="flex: 1; text-align: center;">💳 Carte</el-radio-button>
                <el-radio-button value="mobile_money" style="flex: 1; text-align: center;">📱 Mobile Money</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div class="flex gap-3">
            <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px; flex: 1; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="subStore.loading" @click="handleCreate"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; flex: 1; min-height: 44px;">
              Créer
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>
    <div class="hidden sm:block">
      <el-dialog v-model="showCreateModal" title="Nouvel abonnement" width="540px" :close-on-click-modal="false" @closed="resetCreateForm">
        <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-position="top" size="large">
          <el-form-item label="Client" prop="client_id">
            <el-select v-model="createForm.client_id" placeholder="Rechercher un client..." filterable style="width: 100%" :loading="clientStore.loading">
              <el-option v-for="c in clientStore.clients" :key="c.id" :label="`${c.firstName} ${c.lastName}`" :value="c.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Type d'abonnement" prop="subscription_type_id">
            <el-select v-model="createForm.subscription_type_id" placeholder="Choisir un type..." style="width: 100%" :loading="typeStore.loading" @change="onTypeChange">
              <el-option v-for="t in typeStore.types" :key="t.id" :value="t.id" :label="`${t.name} — ${t.price} FCFA / ${t.durationDays} jours`" />
            </el-select>
          </el-form-item>
          <div v-if="selectedType" class="bg-[#f2f3ff] rounded-xl p-4 mb-2">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold text-indigo-600">{{ selectedType.name }}</p>
                <p class="text-sm text-[#464554]">Durée : {{ selectedType.durationDays }} jours</p>
              </div>
              <p class="text-2xl font-black text-[#131b2e]">{{ selectedType.price }} FCFA</p>
            </div>
            <div class="mt-3 text-xs text-[#464554] flex gap-4">
              <span>Début : <strong>{{ today }}</strong></span>
              <span>Fin : <strong>{{ computedEndDate }}</strong></span>
            </div>
          </div>
          <el-form-item label="Mode de paiement" prop="payment_method">
            <el-radio-group v-model="createForm.payment_method" size="large" class="w-full">
              <el-radio-button value="especes" style="flex: 1; text-align: center;">💵 Espèces</el-radio-button>
              <el-radio-button value="carte" style="flex: 1; text-align: center;">💳 Carte</el-radio-button>
              <el-radio-button value="mobile_money" style="flex: 1; text-align: center;">📱 Mobile Money</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <el-button @click="showCreateModal = false" size="large" style="border-radius: 10px; min-height: 44px;">Annuler</el-button>
            <el-button type="primary" size="large" :loading="subStore.loading" @click="handleCreate"
              style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 10px; font-weight: 700; min-height: 44px;">
              Créer l'abonnement
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- ═══════════════════════════════════════
         MODAL RENOUVELLEMENT (responsive)
    ═══════════════════════════════════════ -->
    <div class="sm:hidden">
      <el-drawer v-model="showRenewModal" direction="btt" size="70%" :close-on-click-modal="false" title="Renouveler l'abonnement">
        <template #default>
          <div v-if="renewSub" class="px-2 space-y-4">
            <div class="bg-[#f2f3ff] rounded-xl p-4 text-center">
              <p class="text-sm text-[#464554]">Client</p>
              <p class="font-bold text-lg text-[#131b2e]">{{ renewSub.client }}</p>
              <p class="text-sm text-[#464554] mt-2">Type</p>
              <p class="font-bold text-indigo-600">{{ renewSub.type }}</p>
              <p class="text-xl font-black text-[#131b2e] mt-2">{{ renewSub.price }} FCFA</p>
              <p class="text-xs text-[#464554] mt-1">Durée : {{ selectedType?.durationDays || '—' }} jours</p>
            </div>
            <el-form ref="renewFormRef" :model="renewForm" :rules="renewRules" label-position="top" size="large">
              <el-form-item label="Mode de paiement" prop="payment_method">
                <el-radio-group v-model="renewForm.payment_method" size="large" class="w-full flex flex-col gap-2">
                  <el-radio-button value="especes" style="flex: 1; text-align: center;">💵 Espèces</el-radio-button>
                  <el-radio-button value="carte" style="flex: 1; text-align: center;">💳 Carte</el-radio-button>
                  <el-radio-button value="mobile_money" style="flex: 1; text-align: center;">📱 Mobile Money</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <template #footer>
          <div class="flex gap-3">
            <el-button @click="showRenewModal = false" size="large" style="border-radius: 10px; flex: 1; min-height: 44px;">Annuler</el-button>
            <el-button type="success" size="large" :loading="renewLoading" @click="confirmRenew" style="border-radius: 10px; font-weight: 700; flex: 1; min-height: 44px;">Confirmer</el-button>
          </div>
        </template>
      </el-drawer>
    </div>
    <div class="hidden sm:block">
      <el-dialog v-model="showRenewModal" title="Renouveler l'abonnement" width="480px" :close-on-click-modal="false">
        <div v-if="renewSub" class="space-y-4">
          <div class="bg-[#f2f3ff] rounded-xl p-4 text-center">
            <p class="text-sm text-[#464554]">Client</p>
            <p class="font-bold text-lg text-[#131b2e]">{{ renewSub.client }}</p>
            <p class="text-sm text-[#464554] mt-2">Type</p>
            <p class="font-bold text-indigo-600">{{ renewSub.type }}</p>
            <p class="text-2xl font-black text-[#131b2e] mt-2">{{ renewSub.price }} FCFA</p>
            <p class="text-xs text-[#464554] mt-1">Durée : {{ selectedType?.durationDays || '—' }} jours</p>
          </div>
          <el-form ref="renewFormRef" :model="renewForm" :rules="renewRules" label-position="top" size="large">
            <el-form-item label="Mode de paiement" prop="payment_method">
              <el-radio-group v-model="renewForm.payment_method" size="large" class="w-full">
                <el-radio-button value="especes" style="flex: 1; text-align: center;">💵 Espèces</el-radio-button>
                <el-radio-button value="carte" style="flex: 1; text-align: center;">💳 Carte</el-radio-button>
                <el-radio-button value="mobile_money" style="flex: 1; text-align: center;">📱 Mobile Money</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <el-button @click="showRenewModal = false" size="large" style="border-radius: 10px; min-height: 44px;">Annuler</el-button>
            <el-button type="success" size="large" :loading="renewLoading" @click="confirmRenew" style="border-radius: 10px; font-weight: 700; min-height: 44px;">Confirmer le renouvellement</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- ═══════════════════════════════════════
         DRAWER DÉTAIL ABONNEMENT
    ═══════════════════════════════════════ -->
    <el-drawer v-model="showDetail" direction="rtl" size="440px" :with-header="false" class="!w-full sm:!w-[440px]">
      <div v-if="selectedSub" class="p-4 sm:p-6 overflow-y-auto h-full">
        <div class="flex flex-col items-center mb-8 pt-4">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl text-white mb-4"
            :style="{ backgroundColor: getAvatarColor(selectedSub.client) }">
            {{ selectedSub.client?.charAt(0) }}
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-[#131b2e]">{{ selectedSub.client }}</h2>
          <el-tag :type="selectedSub.status === 'Actif' ? 'success' : 'danger'" size="large" round class="mt-2">{{ selectedSub.status }}</el-tag>
        </div>
        <div class="space-y-3 mb-8">
          <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Type</span>
            <span class="font-bold text-indigo-600">{{ selectedSub.type }}</span>
          </div>
          <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Prix</span>
            <span class="font-bold text-[#131b2e]">{{ selectedSub.price }} FCFA</span>
          </div>
          <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Début</span>
            <span class="font-bold text-[#131b2e]">{{ selectedSub.startDate }}</span>
          </div>
          <div class="bg-[#f2f3ff] rounded-xl p-4 flex justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-[#464554]">Fin</span>
            <span class="font-bold" :class="selectedSub.status === 'Actif' ? 'text-green-600' : 'text-red-500'">{{ selectedSub.endDate }}</span>
          </div>
        </div>
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-bold uppercase tracking-widest text-[#464554]">Historique client</p>
              <p class="text-xs text-slate-500">Tous les abonnements de {{ selectedSub.client }}</p>
            </div>
            <span class="text-xs font-semibold text-[#4f46e5]">{{ clientHistory.length }} ligne(s)</span>
          </div>
          <div class="space-y-3">
            <div v-if="clientHistory.length === 0" class="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">Aucune donnée historique disponible.</div>
            <div v-for="history in paginatedClientHistory" :key="history.id" class="bg-white rounded-xl p-4 border shadow-sm">
              <div class="flex justify-between items-center gap-4">
                <div class="min-w-0">
                  <p class="font-semibold text-[#131b2e] text-sm">{{ history.type }}</p>
                  <p class="text-xs text-[#6b7280]">{{ history.startDate }} → {{ history.endDate }}</p>
                  <p class="text-xs text-[#464554] mt-1">{{ history.price }} FCFA</p>
                </div>
                <el-tag :type="history.status === 'Actif' ? 'success' : 'danger'" size="small" round>{{ history.status }}</el-tag>
              </div>
            </div>
          </div>
          <div v-if="clientHistory.length > historyPageSize" class="mt-4">
            <el-pagination v-model:current-page="historyPage" :page-size="historyPageSize"
              :total="clientHistory.length" layout="prev, pager, next" background />
          </div>
        </div>
        <el-button type="success" size="large" class="w-full mb-3 min-h-[44px]"
          style="border-radius: 12px; font-weight: 700;" @click="handleRenew(selectedSub)">
          <span class="material-symbols-outlined text-lg mr-1">refresh</span>
          Renouveler l'abonnement
        </el-button>
        <el-button type="primary" size="large" class="w-full min-h-[44px]"
          style="background-color: #4f46e5; border-color: #4f46e5; border-radius: 12px; font-weight: 700;" @click="openCreateModalForClient(selectedSub)">
          <span class="material-symbols-outlined text-lg mr-1">add</span>
          Nouveau type d'abonnement
        </el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script setup>
import { useClientStore } from '@/stores/client'
import { useSubscriptionStore } from '@/stores/subscription'
import { useSubscriptionTypeStore } from '@/stores/subscriptionType'
import { Loading, Plus, Refresh, Search, View } from '@element-plus/icons-vue'
import Swal from 'sweetalert2'
import { computed, onMounted, ref } from 'vue'

const subStore = useSubscriptionStore()
const typeStore = useSubscriptionTypeStore()
const clientStore = useClientStore()

// ── État ─────────────────────────────────────────────────────────────────
const search = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const historyPage = ref(1)
const historyPageSize = ref(4)
const showCreateModal = ref(false)
const showRenewModal = ref(false)
const showDetail = ref(false)
const selectedSub = ref(null)
const selectedType = ref(null)
const createFormRef = ref(null)
const renewFormRef = ref(null)
const renewLoading = ref(false)
const renewSub = ref(null)

const createForm = ref({ client_id: null, subscription_type_id: null, payment_method: null })
const renewForm = ref({ payment_method: null })

const createRules = {
    client_id: [{ required: true, message: 'Sélectionnez un client', trigger: 'change' }],
    subscription_type_id: [{ required: true, message: "Sélectionnez un type d'abonnement", trigger: 'change' }],
    payment_method: [{ required: true, message: 'Sélectionnez un mode de paiement', trigger: 'change' }],
}

const renewRules = {
    payment_method: [{ required: true, message: 'Sélectionnez un mode de paiement', trigger: 'change' }],
}

// ── Chargement initial ────────────────────────────────────────────────────
onMounted(async () => {
    await subStore.fetchAll()
    await typeStore.fetchAll()
    await clientStore.fetchAll()
})

// ── Dates aperçu modal ────────────────────────────────────────────────────
const today = new Date().toLocaleDateString('fr-FR')

const computedEndDate = computed(() => {
    if (!selectedType.value) return '—'
    const end = new Date()
    end.setDate(end.getDate() + selectedType.value.durationDays)
    return end.toLocaleDateString('fr-FR')
})

// ── Historique client (drawer) ────────────────────────────────────────────
const clientHistory = computed(() => subStore.clientSubscriptions || [])

// ── Filtres — basé sur latestPerClient (1 ligne par client) ───────────────
const filteredSubs = computed(() => {
    let list = subStore.latestPerClient
    const q = search.value.toLowerCase()

    if (q) {
        list = list.filter(s => `${s.client} ${s.type}`.toLowerCase().includes(q))
    }
    if (filterStatus.value) {
        list = list.filter(s => s.status === filterStatus.value)
    }
    return list
})

const paginatedSubs = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredSubs.value.slice(start, start + pageSize.value)
})

const paginatedClientHistory = computed(() => {
    const start = (historyPage.value - 1) * historyPageSize.value
    return clientHistory.value.slice(start, start + historyPageSize.value)
})

// ── Changer de type → aperçu ──────────────────────────────────────────────
function onTypeChange(typeId) {
    selectedType.value = typeStore.types.find(t => t.id === typeId) || null
}

// ── Ouvrir modal création ─────────────────────────────────────────────────
function openCreateModal(clientId = null) {
    createForm.value = { client_id: clientId, subscription_type_id: null, payment_method: null }
    selectedType.value = null
    showCreateModal.value = true
}

function openCreateModalForClient(sub) {
    const client = clientStore.clients.find(
        c => `${c.firstName} ${c.lastName}` === sub.client
    )
    showDetail.value = false
    openCreateModal(client?.id || null)
}

// ── Créer un abonnement ───────────────────────────────────────────────────
async function handleCreate() {
    await createFormRef.value.validate(async (valid) => {
        if (!valid) return
        try {
            await subStore.create({
                client_id: createForm.value.client_id,
                subscription_type_id: createForm.value.subscription_type_id,
                payment_method: createForm.value.payment_method,
            })
            showCreateModal.value = false
            Swal.fire({
                icon: 'success',
                title: 'Abonnement créé !',
                text: "L'abonnement a été créé avec succès.",
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'Super !',
            })
            resetCreateForm()
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: subStore.error || "Impossible de créer l'abonnement.",
                confirmButtonColor: '#4f46e5',
            })
        }
    })
}

// ── Ouvrir le détail + charger historique ────────────────────────────────
async function openDetail(sub) {
    selectedSub.value = sub
    historyPage.value = 1
    await subStore.fetchByClient(sub.client_id)
    showDetail.value = true
}

// ── Renouveler (ouvre modal paiement) ──────────────────────────────────────
function handleRenew(sub) {
    renewSub.value = sub
    renewForm.value = { payment_method: null }
    showRenewModal.value = true
    selectedType.value = typeStore.types.find(t => t.name === sub.type) || null
}

async function confirmRenew() {
    if (!renewForm.value.payment_method) {
        Swal.fire({
            icon: 'warning',
            title: 'Paiement requis',
            text: 'Veuillez sélectionner un mode de paiement.',
            confirmButtonColor: '#4f46e5',
        })
        return
    }
    renewLoading.value = true
    try {
        await subStore.renew(renewSub.value.id, {
            payment_method: renewForm.value.payment_method,
        })
        showRenewModal.value = false
        showDetail.value = false
        renewLoading.value = false
        Swal.fire({
            icon: 'success',
            title: 'Renouvelé !',
            text: `L'abonnement de ${renewSub.value.client} a été renouvelé avec succès.`,
            confirmButtonColor: '#4f46e5',
            timer: 2500,
            showConfirmButton: false,
        })
    } catch {
        renewLoading.value = false
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: subStore.error || "Impossible de renouveler l'abonnement.",
            confirmButtonColor: '#4f46e5',
        })
    }
}

// ── Reset ─────────────────────────────────────────────────────────────────
function resetCreateForm() {
    createForm.value = { client_id: null, subscription_type_id: null, payment_method: null }
    selectedType.value = null
    createFormRef.value?.resetFields()
}

// ── Helpers ───────────────────────────────────────────────────────────────
function getAvatarColor(name) {
    const colors = [
        '#4f46e5', '#7c3aed', '#db2777', '#059669',
        '#d97706', '#dc2626', '#0284c7', '#65a30d',
    ]
    if (!name) return colors[0]
    return colors[name.charCodeAt(0) % colors.length]
}

function calculateDaysLeft(sub) {
    if (!sub.startDate || !sub.endDate) return 0
    const start = new Date(sub.startDate)
    const end = new Date(sub.endDate)
    const now = new Date()
    const total = (end - start) / (1000 * 60 * 60 * 24)
    const remaining = (end - now) / (1000 * 60 * 60 * 24)
    return Math.round(((total - remaining) / total) * 100)
}
</script>
