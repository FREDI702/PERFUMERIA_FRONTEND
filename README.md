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

Las pruebas de validaciones, rutas protegidas, sesión, inactividad, reglas del mock API e interfaces de acceso y reportes están junto al código. Vitest las ejecuta con `npm test`.

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

Los diagramas documentan únicamente lo implementado. Este repositorio contiene el frontend y usa datos simulados en el navegador; no incluye backend ni API. El hosting de producción no está configurado y los campos de acuerdos deben ser definidos por el equipo.

El carrito permite registrar pedidos simulados con tarjeta, Yape o efectivo, entrega a domicilio o recojo, y datos para boleta o factura. Para entrega se seleccionan departamento, provincia y distrito usando una copia local del [listado de ubigeos del INEI](https://www.datosabiertos.gob.pe/node/15695/dataset); su actualización depende de renovar esta copia. Opcionalmente, el cliente puede autorizar la ubicación del navegador y enviar las coordenadas a Nominatim de OpenStreetMap para obtener una dirección aproximada editable; no se guardan las coordenadas. No se procesan cobros ni se emiten comprobantes; el QR es solo una referencia y no debe usarse para transferir dinero. El administrador puede confirmar el estado simulado del pago en el detalle de ventas. Los datos y estados se mantienen solo en memoria y se pierden al recargar.

## Evidencias pendientes del equipo

- Revisar el diseño de Figma contra la interfaz en los tamaños requeridos y adjuntar la evidencia al tablero.
- Acordar y registrar Sprint Goal, responsables, puntos/WIP y estados reales de las historias en Trello.
- Registrar Daily Scrum, bloqueos, Sprint Review y retrospectiva con decisiones reales del equipo.
- Revisar Codacy si está conectado; no se declara un análisis hasta tener su resultado.
- Crear y solicitar revisión de un Pull Request antes de integrar cambios a `main`.
- Elegir y configurar el hosting (por ejemplo, Vercel o Netlify) antes de afirmar que existe publicación.
