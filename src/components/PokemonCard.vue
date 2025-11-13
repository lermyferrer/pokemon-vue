<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';
import { pokemonApi } from '../services/pokemonApi';
import type { Pokemon } from '../types/pokemon';

export default defineComponent({
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object as PropType<Pokemon>,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const pokemonId = computed(() => pokemonApi.getPokemonId(props.pokemon.url));
    const pokemonImage = computed(() => pokemonApi.getPokemonImage(pokemonId.value));
    const formattedId = computed(() => `#${pokemonId.value.toString().padStart(3, '0')}`);

    const handleClick = () => {
      emit('click');
    };

    return {
      pokemonImage,
      formattedId,
      handleClick,
    };
  },
});
</script>

<template>
  <article
    class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
    @click="handleClick"
  >
    <div class="bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 p-6">
      <img
        :src="pokemonImage"
        :alt="pokemon.name"
        class="w-32 h-32 mx-auto object-contain transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
    </div>
    <div class="p-6 text-center">
      <p class="text-sm text-gray-400 dark:text-slate-300 font-semibold tracking-wide mb-2">
        {{ formattedId }}
      </p>
      <h3 class="text-xl font-bold capitalize text-gray-800 dark:text-white">
        {{ pokemon.name }}
      </h3>
    </div>
  </article>
</template>

