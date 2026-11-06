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

Las pruebas de validaciones y de la interfaz de inicio de sesión están junto al código en `src/utils/validaciones.test.js` y `src/page/Login.test.jsx`. Vitest las ejecuta con `npm test`.

```sh
npm run lint
npm test
npm run build
```

El workflow de GitHub Actions ejecuta lint, pruebas y build en cada `push` y pull request. Todos deben pasar antes de integrar cambios.

## Diseño y flujo actual

- [Diagrama de actividades del inicio de sesión](./docs/actividades-login.md)
- [Diagrama de componentes](./docs/componentes.md)
- [Diagrama de despliegue](./docs/despliegue.md)
- [Acuerdos del equipo para completar en conjunto](./ACUERDOS.md)

Los diagramas documentan únicamente lo implementado. El hosting de producción y la API son pendientes; los campos de acuerdos deben ser definidos por el equipo.

## Evidencias pendientes del equipo

- Revisar el diseño de Figma contra la interfaz en los tamaños requeridos y adjuntar la evidencia al tablero.
- Acordar y registrar Sprint Goal, responsables, puntos/WIP y estados reales de las historias en Trello.
- Registrar Daily Scrum, bloqueos, Sprint Review y retrospectiva con decisiones reales del equipo.
- Revisar Codacy si está conectado; no se declara un análisis hasta tener su resultado.
- Crear y solicitar revisión de un Pull Request antes de integrar cambios a `main`.
- Elegir y configurar el hosting (por ejemplo, Vercel o Netlify) antes de afirmar que existe publicación.
