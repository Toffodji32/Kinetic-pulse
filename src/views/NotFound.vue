<template>
    <div class="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <div class="text-center">
            <h1 class="text-8xl font-black text-indigo-600 mb-4">404</h1>
            <p class="text-xl font-bold text-[#131b2e] mb-2">Page introuvable</p>
            <p class="text-[#464554] mb-8">La page que vous cherchez n'existe pas.</p>
            <router-link to="/">
                <el-button type="primary" size="large" style="background-color: #4f46e5; border-radius: 12px;">
                    Retour à l'accueil
                </el-button>
            </router-link>
        </div>
    </div>
</template>