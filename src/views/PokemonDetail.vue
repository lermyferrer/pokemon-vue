<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePokemonStore } from '../stores/pokemonStore';
import type { PokemonDetail } from '../types/pokemon';
import { STAT_TRANSLATIONS, TYPE_COLORS } from '../types/utils';

const route = useRoute();
const router = useRouter();
const store = usePokemonStore();
const pokemon = ref<PokemonDetail | null>(null);

const primaryType = computed(() => pokemon.value?.types[0]?.type.name ?? 'normal');

const backgroundColor = computed(() => TYPE_COLORS[primaryType.value] ?? '#777777');

const isLoading = computed(() => store.loading && !pokemon.value);

const loadPokemon = async (id: number) => {
  pokemon.value = null;

  try {
    const detail = await store.loadPokemonDetail(id);
    pokemon.value = detail;
  } catch {
    pokemon.value = null;
  }
};

const goBack = () => {
  router.push('/');
};

const formatStatName = (name: string) => STAT_TRANSLATIONS[name] ?? name;

watch(
  () => route.params.id,
  (value) => {
    const id = Number(value);
    if (!Number.isNaN(id)) {
      loadPokemon(id);
    } else {
      pokemon.value = null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <button
      @click="goBack"
      class="mb-6 px-6 py-3 bg-white text-purple-600 dark:bg-slate-800 dark:text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Volver
    </button>

    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 dark:border-white border-t-transparent"></div>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/60 dark:border-red-500/60 dark:text-red-100 px-4 py-3 rounded-xl">
      {{ store.error }}
    </div>

    <!-- Detalle del Pokémon -->
    <div v-else-if="pokemon" class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
      <div
        class="p-8 text-white relative"
        :style="{ backgroundColor }"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-5xl font-bold capitalize mb-2">{{ pokemon.name }}</h1>
            <div class="flex gap-2">
              <span
                v-for="type in pokemon.types"
                :key="type.type.name"
                class="px-4 py-2 rounded-full bg-white bg-opacity-30 text-sm font-semibold capitalize backdrop-blur-sm"
              >
                {{ type.type.name }}
              </span>
            </div>
          </div>
          <div class="text-6xl font-bold opacity-30 text-white/80">
            #{{ pokemon.id.toString().padStart(3, '0') }}
          </div>
        </div>

        <div class="flex justify-center">
          <img
            :src="pokemon.sprites.other['official-artwork'].front_default ?? ''"
            :alt="pokemon.name"
            class="w-64 h-64 object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <div class="p-8">
        <!-- Físico -->
        <div class="grid grid-cols-2 gap-6 mb-8">
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl">
            <p class="text-gray-500 dark:text-slate-300 text-sm mb-1">Altura</p>
            <p class="text-3xl font-bold text-purple-600 dark:text-purple-300">{{ (pokemon.height / 10).toFixed(1) }} m</p>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl">
            <p class="text-gray-500 dark:text-slate-300 text-sm mb-1">Peso</p>
            <p class="text-3xl font-bold text-purple-600 dark:text-purple-300">{{ (pokemon.weight / 10).toFixed(1) }} kg</p>
          </div>
        </div>

        <!-- Habilidades -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Habilidades</h2>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="ability in pokemon.abilities"
              :key="ability.ability.name"
              class="px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl capitalize text-gray-700 dark:text-white font-medium"
            >
              {{ ability.ability.name.replace('-', ' ') }}
              <span v-if="ability.is_hidden" class="text-xs text-purple-600 dark:text-purple-300 ml-1">(Oculta)</span>
            </span>
          </div>
        </div>

        <!-- Estadísticas -->
        <div>
          <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Estadísticas Base</h2>
          <div class="space-y-4">
            <div v-for="stat in pokemon.stats" :key="stat.stat.name">
              <div class="flex justify-between mb-2">
                <span class="font-semibold text-gray-700 dark:text-white">{{ formatStatName(stat.stat.name) }}</span>
                <span class="font-bold text-purple-600 dark:text-purple-300">{{ stat.base_stat }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                <div
                  class="h-3 rounded-full transition-all duration-500"
                  :style="{
                    width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                    backgroundColor
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-slate-700 dark:text-white text-xl">No se pudo cargar el Pokémon</p>
    </div>
  </div>
</template>