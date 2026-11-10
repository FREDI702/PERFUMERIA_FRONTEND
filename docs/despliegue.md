# Diagrama de despliegue

El flujo distingue la compilación configurada de un despliegue de producción, que todavía no está conectado.

```mermaid
flowchart LR
  equipo[Equipo desarrollador]
  repo[Repositorio GitHub<br/>FREDI702/PERFUMERIA_FRONTEND]
  ci[GitHub Actions<br/>npm ci, lint, test y build]
  dist[Artefacto estático<br/>dist/]
  navegador[Navegador de la persona usuaria]
  fonts[Google Fonts<br/>Fraunces e Inter]
  storage[(sessionStorage<br/>del navegador)]
  api[API y base de datos<br/>futuras, no implementadas]
  hosting[Hosting de producción<br/>pendiente de configurar]

  equipo -->|push o pull request| repo
  repo --> ci
  ci -->|build verificado| dist
  dist -. publicación manual o automática pendiente .-> hosting
  hosting -. entrega HTML, CSS y JavaScript .-> navegador
  navegador -->|solicita fuentes| fonts
  navegador -->|guarda sesión simulada| storage
  navegador -. integración futura .-> api
```

GitHub Actions ejecuta lint, pruebas y build. El build produce `dist/`; el workflow actual no publica ese artefacto en un hosting. La sesión se guarda en el `sessionStorage` del navegador y el inicio de sesión se simula localmente. La API y la base de datos son futuras y no tienen endpoints definidos.
