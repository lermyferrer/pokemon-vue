import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PokemonList from '../../src/views/PokemonList.vue';
import type { Pokemon } from '../../src/types/pokemon';

const routerPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPush,
  }),
}));

let storeMock: {
  pokemons: Pokemon[];
  filteredPokemons: Pokemon[];
  totalPokemons: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: ReturnType<typeof vi.fn>;
  loadPokemons: ReturnType<typeof vi.fn>;
};

vi.mock('../../src/stores/pokemonStore', () => ({
  usePokemonStore: () => storeMock,
}));

vi.mock('../../src/services/pokemonApi', () => ({
  pokemonApi: {
    getPokemonId: (url: string) => {
      const match = /\/(\d+)\/?$/.exec(url);
      return match ? Number(match[1]) : 0;
    },
  },
}));

vi.mock('../../src/components/PokemonCard.vue', () => ({
  default: {
    name: 'PokemonCard',
    props: {
      pokemon: {
        type: Object,
        required: true,
      },
    },
    template: `<div data-test="pokemon-card" @click="$emit('click')">{{ pokemon.name }}</div>`,
  },
}));

describe('PokemonList', () => {
  beforeEach(() => {
    storeMock = {
      pokemons: [],
      filteredPokemons: [],
      totalPokemons: 0,
      hasMore: false,
      loading: false,
      error: null,
      searchQuery: '',
      setSearchQuery: vi.fn(),
      loadPokemons: vi.fn(),
    };
    routerPush.mockReset();
  });

  it('loads pokemons on mount when list is empty', () => {
    mount(PokemonList).unmount();

    expect(storeMock.loadPokemons).toHaveBeenCalledTimes(1);
  });

  it('shows an initial loader while the first page is fetching', () => {
    storeMock.loading = true;

    const wrapper = mount(PokemonList);
    expect(wrapper.find('[data-test=\"initial-loader\"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders a card per filtered pokemon', () => {
    storeMock.filteredPokemons = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    ];

    const wrapper = mount(PokemonList);
    const cards = wrapper.findAll('[data-test="pokemon-card"]');

    expect(cards).toHaveLength(2);
    expect(cards[0]!.text()).toContain('bulbasaur');
    wrapper.unmount();
  });

  it('updates the search query when typing in the input', async () => {
    const wrapper = mount(PokemonList);
    const searchValue = 'pikachu';

    await wrapper.find('input').setValue(searchValue);

    expect(storeMock.setSearchQuery).toHaveBeenCalledWith(searchValue);
    wrapper.unmount();
  });

  it('navigates to the detail route when a card is clicked', async () => {
    storeMock.filteredPokemons = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    ];

    const wrapper = mount(PokemonList);
    await wrapper.find('[data-test=\"pokemon-card\"]').trigger('click');

    expect(routerPush).toHaveBeenCalledWith('/pokemon/25');
    wrapper.unmount();
  });
});

