<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useThemeStore } from './stores/themeStore';

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initialize();
});

const wrapperClass = computed(() =>
  themeStore.isDark
    ? 'min-h-screen bg-slate-950 text-white'
    : 'min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 text-slate-900'
);

const headerClass = computed(() =>
  themeStore.isDark
    ? 'border-b border-white/10 bg-slate-900/60 backdrop-blur'
    : 'border-b border-slate-200 bg-white/60 backdrop-blur'
);

const toggleLabel = computed(() => (themeStore.isDark ? 'Modo claro' : 'Modo oscuro'));
</script>

<template>
  <div :class="wrapperClass">
    <header :class="headerClass">
      <div class="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Descubre tu Pokémon favorito.</h1>
        </div>
        <button
          type="button"
          @click="themeStore.toggleTheme"
          class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          :class="themeStore.isDark ? 'bg-slate-800 text-white focus-visible:ring-slate-200' : 'bg-white text-slate-900 focus-visible:ring-slate-400'"
          :aria-label="toggleLabel"
        >
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full border" :class="themeStore.isDark ? 'border-slate-600 bg-slate-700' : 'border-slate-300 bg-slate-100'">
            <span v-if="themeStore.isDark">🌙</span>
            <span v-else>☀️</span>
          </span>
          {{ toggleLabel }}
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
