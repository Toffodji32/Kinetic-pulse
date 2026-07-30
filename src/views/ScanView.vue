<template>
  <div class="h-screen flex flex-col bg-[#faf8ff] relative">
    <!-- Camera fullscreen -->
    <div class="flex-1 relative bg-black overflow-hidden">
      <video ref="videoRef" class="w-full h-full object-cover" autoplay playsinline muted />

      <!-- Scan frame overlay -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-64 h-64 relative">
          <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl"></div>
          <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"></div>
          <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl"></div>
          <div class="scan-line absolute left-4 right-4 h-0.5 bg-indigo-400 shadow-lg shadow-indigo-400/50"></div>
        </div>
      </div>

      <!-- Top bar -->
      <div class="absolute top-0 inset-x-0 flex items-center justify-between p-4 pt-12">
        <button @click="goBack" class="min-w-[44px] min-h-[44px] flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-2xl">arrow_back</span>
        </button>
        <div class="bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5">
          <span class="text-white text-sm font-medium">Scanner un QR</span>
        </div>
        <button @click="toggleFlash" class="min-w-[44px] min-h-[44px] flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-2xl">{{ flashOn ? 'flash_on' : 'flash_off' }}</span>
        </button>
      </div>

      <!-- Hint text -->
      <div class="absolute bottom-28 inset-x-0 text-center">
        <p class="text-white/80 text-sm">Placez le code QR dans le cadre</p>
      </div>
    </div>

    <!-- Bottom sheet result panel -->
    <div v-if="scanResult" class="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-2xl z-10 p-6 pb-8 animate-slide-up">
      <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
        </div>
        <div>
          <p class="font-bold text-[#131b2e] text-lg">QR Code scanné</p>
          <p class="text-sm text-[#464554] break-all">{{ scanResult }}</p>
        </div>
      </div>
      <div class="flex gap-3">
        <el-button type="primary" size="large" class="flex-1" style="border-radius:12px;background-color:#4f46e5;border-color:#4f46e5;" @click="handleScanResult">
          <span class="material-symbols-outlined text-base mr-1">person</span>
          Voir l'abonné
        </el-button>
        <button @click="scanResult = null" class="min-w-[44px] min-h-[44px] flex items-center justify-center">
          <span class="material-symbols-outlined text-[#464554] text-xl">close</span>
        </button>
      </div>
    </div>

    <!-- Manual input (collapsible) -->
    <div class="bg-white border-t border-gray-100">
      <button @click="showManualInput = !showManualInput" class="w-full flex items-center justify-between px-4 py-3">
        <span class="text-sm font-medium text-[#464554]">
          <span class="material-symbols-outlined text-base align-middle mr-1">keyboard</span>
          Saisir un code manuellement
        </span>
        <span class="material-symbols-outlined text-[#464554]" :class="showManualInput ? 'rotate-180' : ''">expand_more</span>
      </button>
      <Transition name="slide-fade">
        <div v-if="showManualInput" class="px-4 pb-4">
          <div class="flex gap-2">
            <el-input v-model="manualCode" placeholder="Entrez l'UUID ou le code..." size="large" clearable />
            <el-button type="primary" size="large" style="border-radius:12px;background-color:#4f46e5;border-color:#4f46e5;min-width:44px;" @click="submitManualCode">
              <span class="material-symbols-outlined">search</span>
            </el-button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Recent scans (horizontal scroll) -->
    <div v-if="recentScans.length > 0" class="bg-white border-t border-gray-100 px-4 py-4">
      <p class="text-xs font-bold uppercase tracking-widest text-[#464554] mb-3">Scans récents</p>
      <div class="flex gap-3 overflow-x-auto scrollbar-hide">
        <button v-for="(scan, idx) in recentScans" :key="idx" @click="reScan(scan)"
          class="flex-shrink-0 flex items-center gap-2 bg-[#e0e7ff] rounded-xl px-4 py-2 min-h-[44px]">
          <span class="material-symbols-outlined text-indigo-500 text-base">qr_code_scanner</span>
          <span class="text-sm text-[#131b2e] font-medium truncate max-w-[120px]">{{ scan }}</span>
        </button>
      </div>
    </div>

    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const videoRef = ref(null)
const flashOn = ref(false)
const scanResult = ref(null)
const showManualInput = ref(false)
const manualCode = ref('')
const recentScans = ref(['MEM-001-2024', 'MEM-045-2024', 'MEM-128-2024'])

function goBack() {
  router.back()
}

function toggleFlash() {
  flashOn.value = !flashOn.value
}

function handleScanResult() {
  recentScans.value.unshift(scanResult.value)
  if (recentScans.value.length > 10) recentScans.value.pop()
  router.push(`/members/${scanResult.value}`)
}

function submitManualCode() {
  if (manualCode.value.trim()) {
    scanResult.value = manualCode.value.trim()
    manualCode.value = ''
    showManualInput.value = false
  }
}

function reScan(code) {
  scanResult.value = code
}
</script>

<style scoped>
@keyframes scan {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}
.scan-line {
  animation: scan 2s ease-in-out infinite;
}
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
