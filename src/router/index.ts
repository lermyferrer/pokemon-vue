import { createRouter, createWebHistory } from 'vue-router';
import PokemonList from '../views/PokemonList.vue';
import PokemonDetail from '../views/PokemonDetail.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PokemonList
    },
    {
      path: '/pokemon/:id',
      name: 'pokemon-detail',
      component: PokemonDetail
    }
  ]
});

export default router;