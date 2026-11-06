# Diagrama de componentes

El diagrama describe los módulos que existen hoy en el frontend. Las flechas muestran dependencias de uso.

```mermaid
flowchart LR
  navegador[Navegador]
  main[src/main.jsx<br/>BrowserRouter]
  app[src/App.jsx<br/>Rutas y guards]
  login[src/page/Login.jsx]
  account[src/page/Account.jsx]
  validations[src/utils/validaciones.js<br/>Correo y contraseña]
  mock[src/auth/mockApi.js<br/>Login simulado]
  session[src/auth/session.js<br/>Sesión]
  storage[(sessionStorage<br/>perfumeria.session)]
  styles[src/index.css<br/>Tailwind y tokens]
  html[index.html<br/>Punto de entrada y fuentes]

  navegador --> html
  html --> main
  main --> app
  main --> styles
  app --> login
  app --> account
  app --> session
  login --> validations
  login --> mock
  login --> session
  account --> session
  session --> storage
```

No hay todavía componentes compartidos en `src/components/`, catálogo, carrito, backend ni integración con API. La autenticación del diagrama usa `mockApi.js`.
