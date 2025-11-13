import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import PokemonDetail from '../../src/views/PokemonDetail.vue';
import type { PokemonDetail as PokemonDetailType } from '../../src/types/pokemon';

const routerPush = vi.fn();
const routeParams = reactive<{ id: string | undefined }>({ id: '1' });

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPush,
  }),
  useRoute: () => ({
    params: routeParams,
  }),
}));

let storeMock: {
  loadPokemonDetail: ReturnType<typeof vi.fn>;
  loading: boolean;
  error: string | null;
};

vi.mock('../../src/stores/pokemonStore', () => ({
  usePokemonStore: () => storeMock,
}));

const basePokemonDetail: PokemonDetailType = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://example.com/bulbasaur.png',
      },
    },
  },
  types: [
    {
      slot: 1,
      type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
    },
    {
      slot: 2,
      type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
    },
  ],
  abilities: [
    {
      ability: { name: 'overgrow', url: 'https://pokeapi.co/api/v2/ability/65/' },
      is_hidden: false,
      slot: 1,
    },
  ],
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' },
    },
  ],
};

describe('PokemonDetail', () => {
  beforeEach(() => {
    storeMock = {
      loadPokemonDetail: vi.fn().mockResolvedValue(basePokemonDetail),
      loading: false,
      error: null,
    };
    routeParams.id = '1';
    routerPush.mockReset();
  });

  it('loads the pokemon detail on mount and displays its information', async () => {
    const wrapper = mount(PokemonDetail);
    await flushPromises();

    expect(storeMock.loadPokemonDetail).toHaveBeenCalledWith(1);
    expect(wrapper.text()).toContain('bulbasaur');
    wrapper.unmount();
  });

  it('shows the error message when the store reports an error', async () => {
    storeMock.error = 'No se pudo cargar el Pokémon.';
    storeMock.loadPokemonDetail = vi.fn().mockRejectedValue(new Error('boom'));

    const wrapper = mount(PokemonDetail);
    await flushPromises();

    expect(wrapper.text()).toContain('No se pudo cargar el Pokémon.');
    wrapper.unmount();
  });

  it('refreshes the detail when the route id changes', async () => {
    const secondDetail: PokemonDetailType = {
      ...basePokemonDetail,
      id: 7,
      name: 'squirtle',
      types: [
        {
          slot: 1,
          type: { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' },
        },
      ],
    };

    storeMock.loadPokemonDetail = vi
      .fn()
      .mockResolvedValueOnce(basePokemonDetail)
      .mockResolvedValueOnce(secondDetail);

    const wrapper = mount(PokemonDetail);
    await flushPromises();

    routeParams.id = '7';
    await flushPromises();

    expect(storeMock.loadPokemonDetail).toHaveBeenLastCalledWith(7);
    expect(wrapper.text()).toContain('squirtle');
    wrapper.unmount();
  });

  it('navigates back to the list when the button is clicked', async () => {
    const wrapper = mount(PokemonDetail);
    await flushPromises();

    await wrapper.find('button').trigger('click');

    expect(routerPush).toHaveBeenCalledWith('/');
    wrapper.unmount();
  });
});

