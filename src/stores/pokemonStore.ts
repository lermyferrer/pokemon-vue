import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { pokemonApi } from '../services/pokemonApi';
import type { Pokemon, PokemonDetail } from '../types/pokemon';

interface DetailCache {
  [id: number]: PokemonDetail;
}

const PAGE_SIZE = 20;

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemons = ref<Pokemon[]>([]);
  const totalPokemons = ref(0);
  const offset = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');
  const detailCache = ref<DetailCache>({});

  const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase());

  const filteredPokemons = computed(() => {
    if (!normalizedSearch.value) {
      return pokemons.value;
    }

    return pokemons.value.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(normalizedSearch.value)
    );
  });

  const hasMore = computed(() => pokemons.value.length < totalPokemons.value);

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const loadPokemons = async () => {
    if (loading.value || (!hasMore.value && offset.value !== 0)) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const { results, count } = await pokemonApi.getPokemons(offset.value, PAGE_SIZE);
      pokemons.value = [...pokemons.value, ...results];
      totalPokemons.value = count;
      offset.value += PAGE_SIZE;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'No se pudo cargar la lista de Pokémon.';
    } finally {
      loading.value = false;
    }
  };

  const loadPokemonDetail = async (id: number) => {
    if (detailCache.value[id]) {
      return detailCache.value[id];
    }

    loading.value = true;
    error.value = null;

    try {
      const detail = await pokemonApi.getPokemonDetail(id);
      detailCache.value = {
        ...detailCache.value,
        [id]: detail,
      };

      return detail;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'No se pudo cargar el Pokémon.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    pokemons,
    filteredPokemons,
    totalPokemons,
    hasMore,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    loadPokemons,
    loadPokemonDetail,
  };
});

