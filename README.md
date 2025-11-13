# Pokédex Vue

Aplicación web construida con Vue 3 y Vite que consume la PokéAPI para listar y explorar Pokémon. Incluye búsqueda, carga incremental, detalles completos y pruebas unitarias con Vitest.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Scripts disponibles

- `npm run dev` – levanta el entorno de desarrollo en [http://localhost:5173](http://localhost:5173)
- `npm run build` – genera la build de producción (incluye verificación de tipos con `vue-tsc`)
- `npm run preview` – sirve la build generada para revisión
- `npm run test:unit` – ejecuta las pruebas unitarias con Vitest

## Decisiones técnicas

- **Vue 3 + Composition API:** facilita la composición y reutilización de lógica.
- **Pinia:** gestión de estado centralizada para el listado, filtros y cache de detalles.
- **Vue Router:** navegación entre la lista y la vista de detalle.
- **Tailwind CSS:** estilos utilitarios para crear una interfaz clara y consistente sin sobrecarga de CSS.
- **Vitest + Vue Test Utils:** pruebas unitarias aisladas para los componentes principales (`PokemonList` y `PokemonDetail`).
- **Modo oscuro automático/manual:** se detecta la preferencia del sistema y se permite alternar desde la UI con persistencia en `localStorage`.

## Estructura principal

- `src/services/pokemonApi.ts` – Cliente ligero para consumir la PokéAPI.
- `src/stores/pokemonStore.ts` – Estado global con búsqueda, paginación y cache de detalles.
- `src/views/PokemonList.vue` – Listado con filtros, paginación y tarjetas de Pokémon.
- `src/views/PokemonDetail.vue` – Información completa del Pokémon seleccionado.
- `tests/` – Configuración y pruebas unitarias.

## Pruebas

```bash
npm run test:unit
```

Las pruebas utilizan `happy-dom` como entorno y se ejecutan en modo aislado a través de mocks para el router y la store.

## Próximos pasos sugeridos

- Añadir pruebas de integración sobre el flujo completo.
- Incorporar internationalización para soportar múltiples idiomas.
- Mejorar la accesibilidad con validaciones adicionales y navegación por teclado.
