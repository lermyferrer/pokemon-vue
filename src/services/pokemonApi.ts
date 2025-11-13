import type { PokemonDetail, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const DEFAULT_LIMIT = 20;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Ocurrió un error al consultar la PokéAPI');
  }

  return response.json() as Promise<T>;
};

const getPokemons = async (offset = 0, limit = DEFAULT_LIMIT): Promise<PokemonListResponse> => {
  const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
  const response = await fetch(url);
  return handleResponse<PokemonListResponse>(response);
};

const getPokemonDetail = async (idOrName: number | string): Promise<PokemonDetail> => {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  return handleResponse<PokemonDetail>(response);
};

const getPokemonId = (url: string): number => {
  const match = /\/pokemon\/(\d+)\//.exec(url);
  return match ? Number(match[1]) : 0;
};

const getPokemonImage = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const pokemonApi = {
  getPokemons,
  getPokemonDetail,
  getPokemonId,
  getPokemonImage,
};