<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePokemonStore } from '../stores/pokemonStore';
import { pokemonApi } from '../services/pokemonApi';
import type { Pokemon } from '../types/pokemon';
import PokemonCard from '../components/PokemonCard.vue';

const router = useRouter();
const store = usePokemonStore();

const goToDetail = (pokemon: Pokemon) => {
  const id = pokemonApi.getPokemonId(pokemon.url);
  router.push(`/pokemon/${id}`);
};

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.setSearchQuery(target.value);
};

const isInitialLoading = computed(
  () => store.loading && store.pokemons.length === 0 && !store.error
);

onMounted(() => {
  if (store.totalPokemons === 0) {
    store.loadPokemons();
  }
});
</script>

<template>
  <div>
    <div class="mb-8">
      <input
        :value="store.searchQuery"
        @input="handleSearchInput"
        type="text"
        placeholder="Buscar Pokémon por nombre..."
        class="w-full px-6 py-4 text-lg rounded-xl shadow-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-black dark:text-white dark:bg-slate-800 dark:border-slate-600 dark:focus:border-slate-400"
      />
    </div>

    <div v-if="store.error" class="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/60 dark:border-red-500/60 dark:text-red-100 px-4 py-3 rounded-xl mb-4">
      {{ store.error }}
    </div>

    <div v-if="isInitialLoading" data-test="initial-loader" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 dark:border-white border-t-transparent"></div>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PokemonCard
          v-for="pokemon in store.filteredPokemons"
          :key="pokemon.name"
          :pokemon="pokemon"
          @click="goToDetail(pokemon)"
        />
      </div>

      <div v-if="store.filteredPokemons.length === 0 && !store.loading" class="text-center py-12">
        <p class="text-slate-700 dark:text-white text-xl">No se encontraron Pokémon con ese nombre</p>
      </div>

      <div v-if="!store.searchQuery && store.hasMore" class="text-center mt-8">
        <button
          @click="store.loadPokemons"
          :disabled="store.loading"
          class="px-8 py-4 bg-white text-purple-600 dark:bg-slate-800 dark:text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {{ store.loading ? 'Cargando...' : 'Ver más Pokémon' }}
        </button>
      </div>
    </template>

    <div v-if="store.loading" data-test="loading-spinner" class="flex justify-center mt-8">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 dark:border-white border-t-transparent"></div>
    </div>
  </div>
</template>