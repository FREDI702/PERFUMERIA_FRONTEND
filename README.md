# Perfumería Néctar

Frontend de la tienda virtual de Perfumería Néctar, desarrollado con React y Vite.

## Requisitos

- Node.js 24 o superior
- npm

## Desarrollo

```sh
npm ci
npm run dev
```

## Validación

Las pruebas de funciones están junto al código en `src/utils/validaciones.test.js` y se ejecutan con Vitest.

```sh
npm run lint
npm test
npm run build
```

El workflow de GitHub Actions ejecuta lint, pruebas y build en cada `push` y pull request. Todos deben pasar antes de integrar cambios.
