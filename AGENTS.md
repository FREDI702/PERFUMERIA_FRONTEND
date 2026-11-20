# AGENTS.md — Perfumería Néctar (frontend)

Tienda virtual de perfumes. React 19 + Vite 8 + Tailwind v4 + React Router 7, JavaScript (`.jsx`, sin TypeScript). Solo se trabaja el frontend; `backend/` no se toca. Si algo no está aquí ni en el código, pregunta antes de inventarlo.

## Comandos

- `npm ci` — instalación reproducible (`package-lock.json` versionado); CI usa esto.
- `npm run dev` — Vite en 5173 (si está ocupado, 5174). Reinícialo si cambias `vite.config.js` o instalas paquetes.
- `npm run lint` — ESLint (`eslint .`, ignora `dist`).
- `npm test` — Vitest (`vitest run`, jsdom y `globals: true`; config en `vite.config.js`). Pruebas junto al código: `*.test.js` y `*.test.jsx`.
- Una sola prueba: `npx vitest run src/page/Login.test.jsx`; por nombre: `npx vitest run -t "credenciales válidas"`.
- `npm run build` — build a `dist/` (ignorado por git).
- Antes de terminar: `npm run lint`, `npm test` y `npm run build`, en ese orden (es lo que corre CI).
- `npm run preview` — sirve el build.
- Sin hosting/deploy configurado; el README pide PR a `main` antes de integrar. `docs/` documenta solo lo implementado y los acuerdos de equipo siguen pendientes en `ACUERDOS.md`.
- Sin typecheck ni codegen. No agregues scripts ni dependencias salvo que te lo pidan. Usa npm (`package-lock.json`).
- Node 24 en CI y local: `jsdom` 31 exige `^22.22.2 || ^24.15.0`; con Node 22.12 `npm test` falla.
- Credenciales mock: Cliente `cliente.perfumeria@gmail.com` / `Perfume2026!`; Administrador `admin@perfumerianectar.com` / `AdminPerfume2026!` (`src/auth/mockApi.js`).

## Estado actual (no asumas lo que falta)

- Implementadas las pantallas de la tabla de rutas: bienvenida, login (HU-1), registro (HU-2), sesión expirada, catálogo, carrito, pedidos, cuenta y panel de administración (perfumes, ventas, envíos, recepción y reportes).
- Rutas existentes: `/`, `/login`, `/registro`, `/sesion-expirada`, `/tienda`, `/carrito`, `/pedidos`, `/cuenta`, `/admin` → `/admin/perfumes`, `/admin/ventas`, `/admin/envios`, `/admin/recepcion`, `/admin/reportes` y `*` → `/`.
- `src/page/` contiene las pantallas; las de administración están en `src/page/admin/`. `src/App.css` no existe.
- Componentes en `src/components/`: `AppLayout`, `Sidebar`, `Card`, `Button`, `Field`, `PasswordField`, `Banner`, `ConfirmDialog`, `Table`, `ProductCard`, `BottleArt`, `PageLoader`, `ErrorBoundary`, `PerfumeScene` y `PerfumeBottle3D`.
- `ProtectedRoute`, `PublicOnlyRoute` y `RoleRoute` están dentro de `src/App.jsx`. `AppLayout` es el shell de rutas protegidas y monta `useIdleLogout`; las pantallas internas se cargan con `React.lazy` + `Suspense`.
- `src/auth/`: `session.js`, `mockApi.js`, `useIdleLogout.js`. `src/utils/`: `format.js`, `ui.js`, `validaciones.js`. El carrito vive en memoria en `src/cart/cartStore.js` y se consume con `useSyncExternalStore`.
- Datos simulados en `src/auth/mockApi.js` (usuarios Cliente/Administrador, productos, ventas, envíos y recepciones); las credenciales están al inicio del archivo. MockApi y carrito viven en memoria y se reinician al recargar.
- `PublicOnlyRoute` redirige a sesión iniciada a `/admin/perfumes` (Administrador) o `/tienda` (Cliente); para probar `/`, `/login`, `/registro` o `/sesion-expirada` hay que cerrar sesión.
- Ningún módulo lee `VITE_API_URL` ni envía encabezado `Authorization`: todo (Login incluido) pasa por `mockApi.js`. Los 8 productos mock usan fotos locales de `public/perfumes/` (hay más fotos que productos); el alta/edición de HU-5 sigue guardando la foto como data URL local, no en Cloudinary. También están disponibles `public/perfumeria-nectar.png` y `public/pagos/yape-qr.png`, aún sin usar.
- Pruebas: `src/App.test.jsx`, `src/auth/session.test.js`, `src/auth/mockApi.test.js`, `src/auth/useIdleLogout.test.jsx`, `src/utils/validaciones.test.js`, `src/page/Login.test.jsx`, `src/page/Register.test.jsx`, `src/page/Catalog.test.jsx` y `src/page/admin/Reports.test.jsx`. `src/utils/validacionesHU5.js` existe pero no se importa en ningún lado y solo tiene `esCorreoValido`/`esClaveValida`; no es la validación de perfumes de HU-5.
- Actualiza esta sección al agregar pantallas o componentes.

## Reglas

- Toda la interfaz en español: textos, errores, etiquetas, `alt`, `aria-label`.
- Tailwind v4 con `@tailwindcss/vite`; no existe `tailwind.config.js`. Colores solo desde `src/styles/tokens.css` (`@theme`) usados como utilidades (`bg-primary`, `text-ink`). No uses hex sueltos ni librerías de UI. `src/index.css` importa Tailwind y los tokens y define animaciones globales (p. ej. `text-gold-effect`); no hay `App.css`.
- Dependencias: no agregues nuevas. `react-router-dom` es la única librería de routing/UI permitida (ya instalada); `three` solo se usa para el frasco 3D (`PerfumeBottle3D`) y se carga con `import()` dinámico de `./perfumeBottle3DRuntime.js` (reexporta solo lo usado); para cualquier otra, pregunta. Vitest y Testing Library ya están como `devDependency`.
- API: `import.meta.env.VITE_API_URL` (local `http://localhost:8080`, con **http**; con https aparece `EPROTO: The TLS handshake failed`). No hay endpoints definidos ni `.env`: no los inventes. Hoy ningún archivo usa esa variable ni `Authorization`; los datos simulados se aíslan en `src/auth/mockApi.js`.
- No toques `backend/`.
- Nunca guardes contraseñas ni tokens en `localStorage`. La sesión vive en `sessionStorage`, clave `perfumeria.session`, y solo se maneja desde `src/auth/session.js` (`saveSession`, `clearSession`, `getSession`, `isAuthenticated`, `hasRole`, `touchSession`).
- Sin `console.log`, sin credenciales de prueba visibles en pantalla, sin código comentado. No agregues comentarios al código salvo que se pidan.
- ESLint aplica `react-refresh`: no exportes constantes ni funciones auxiliares desde archivos de componente; ponlas en `src/utils/` (helpers existentes: `buttonClasses`/`field*Classes`, `formatCurrency`/`formatDate*`, validadores).
- Estilo: 2 espacios, comillas simples, sin punto y coma.
- `index.html` ya carga Fraunces e Inter desde Google Fonts; no instales paquetes de fuentes.
- Tailwind: 640 px es el prefijo `sm:`; para 900 px no hay token, se usa el arbitrario `min-[900px]:` (así está en Login/Register).
- Pruebas: no hay setup de jest-dom; usa `expect(...).toBeTruthy()` y propiedades nativas (`.disabled`, `.type`), no `toBeInTheDocument`. `mockApi` tarda 700 ms en login y 600 ms en registro; las redirecciones tardan 1500 ms y 1600 ms. Usa `vi.useFakeTimers()` con `act`/`vi.advanceTimersByTimeAsync`, como en `Login.test.jsx`/`Register.test.jsx`, y restaura con `vi.useRealTimers()`.
- Las pruebas de páginas con navegación usan su propio `MemoryRouter` (`Reports.test.jsx` renderiza sin router). El arreglo `users` de `mockApi.js` es mutable: un registro persiste en las pruebas siguientes del mismo archivo, así que usa correos únicos.

## Diseño

- Pantallas de acceso: split 50/50. Escena azul cósmica (`perfume-scene-bg`, `PerfumeScene`) a la izquierda y formulario a la derecha sobre `card`. Bajo 900 px la escena pasa a cabecera de ~330 px y el formulario sube como hoja.
- Bienvenida: escena azul con halo, anillos orbitales dorados, estrellas y un frasco 3D real con Three.js (`PerfumeBottle3D`, cargado con `import()` dinámico de `perfumeBottle3DRuntime.js`): cuerpo sólido `RoundedBoxGeometry`, líquido dorado/ámbar con degradado `CanvasTexture`, burbujas animadas (`InstancedMesh`), menisco y reflejos de vidrio, tapa negra con anillo dorado y etiquetas `CanvasTexture` «CHANEL / N°5 / PARIS» y «EAU DE TOILETTE / RECHARGE · REFILL / 50 ml · 1.7 FL.OZ», tubo dosificador, tapa negra facetada, giro continuo de 360°; colores desde `--color-perfume-*` en `tokens.css`, environment map, luz cálida trasera, balanceo y rotación suave. Respeta `prefers-reduced-motion`. La foto anterior sigue en `public/images/dior-homme-intense.png`, pero la escena ya no la usa.
- El título de bienvenida usa `text-gold-effect` con degradado animado amarillo → negro → azul, contorno oscuro y brillo azulado; la segunda línea lleva un desfase.
- Pantallas internas: fondo `surface`, Sidebar oscuro `bg-1` de 250 px; en celular es un menú desplegable.
- Quiebres 640 px y 900 px. Nunca scroll horizontal (las tablas usan `overflow-x-auto` interno).
- Accesibilidad: contraste 4.5:1, foco visible, `<label>` en todo campo, objetivos táctiles ≥44 px, texto ≥14 px, respeta `prefers-reduced-motion`.
- Componentes base: Card (radio 28 px, padding 48 px/24 px en móvil, sin ancho máximo propio); Button (`min-h-11`, radio 14 px, peso 700, variantes `primary|secondary|ghost|danger`, `loading` cambia el texto); Field (input/select/textarea, label, `*` rojo, borde 1.5 px, ayuda `aria-live` con "✕ …"/"✓ …"); PasswordField con Mostrar/Ocultar; Banner (`error|success|warning`, `role="alert"`); ConfirmDialog en toda acción destructiva; ProductCard con "Últimas unidades" si el stock es ≤5; Sidebar con nombre, "Rol: Cliente/Administrador", menú y "Cerrar sesión".

## Rutas

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/` | Bienvenida | Público |
| `/login` | HU-1 | Público |
| `/registro` | HU-2 | Público |
| `/sesion-expirada` | HU-3/HU-10 Sesión expirada | Público |
| `/tienda` | HU-4 Catálogo | Cliente y Administrador |
| `/carrito`, `/pedidos` | Carrito y pedidos | Cliente |
| `/cuenta` | Cuenta y cierre de sesión | Con sesión |
| `/admin` | Redirige a `/admin/perfumes` | Administrador |
| `/admin/perfumes` | HU-5 | Administrador |
| `/admin/ventas` | HU-6 y HU-7 | Administrador |
| `/admin/envios` | HU-8 | Administrador |
| `/admin/recepcion` | HU-9 | Administrador |
| `/admin/reportes` | HU-11, HU-12, HU-14 y HU-15 | Administrador |

Sin sesión → `/login`. Cliente en ruta de administrador → "Acceso denegado" con botón "Volver a la tienda".

## Historias de usuario (criterios no obvios)

- HU-1: valida sintaxis `^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$`; rechaza dominios con `mailinator`, `yopmail`, `tempmail`, `10minutemail`, `guerrillamail`, `fake`, `test`, `example` y TLD `.xyz .tk .ml .ga .cf .gq .top`; contraseña ≥12; error "Correo o contraseña incorrectos…"; éxito "¡Bienvenido a Perfumería Néctar!". Ya está en `src/utils/validaciones.js`/`Login.jsx`.
- HU-2: nombre, correo, contraseña y confirmación; ≥12 con letras y números; "Las contraseñas no coinciden"; correo repetido da error; rol Cliente; éxito "¡Cuenta creada con éxito! Te llevamos al inicio de sesión…" y redirección a `/login` con el correo escrito.
- HU-3/HU-10: cierre de sesión visible; "Atrás" no muestra datos; expira a los 30 min sin actividad con "Tu sesión expiró por inactividad (30 min)"; confirmación al cerrar sesión.
- HU-4: foto, marca, nombre, presentación, precio y stock; búsqueda por nombre; filtros Mujer/Hombre/Unisex y marca; orden por más vendidos y precio; "N productos encontrados"; sin resultados "0 productos encontrados" con chips y "Limpiar filtros".
- HU-5: nombre, marca, precio, stock y categoría; precio > 0; stock ≥ 0; foto con vista previa local (JPG/PNG/WEBP ≤2 MB; Cloudinary queda pendiente); confirmar antes de eliminar; no eliminar con ventas: "No se puede eliminar «nombre»: tiene ventas registradas."
- HU-6/HU-7: cliente registrado; fecha y hora automáticas; total calculado; no vender sin productos ni más que el stock: "Stock insuficiente: solo hay N unidad(es) de «nombre»."; subtotal por línea; editar o quitar líneas antes de confirmar; éxito "¡Venta #N registrada con éxito!".
- HU-8: venta existente; dirección, ciudad y teléfono de 9 dígitos obligatorios; estados pendiente, en camino y entregado; actualizar estado y listar.
- HU-9: fecha y proveedor; perfumes con cantidad > 0 y estado Bueno/Con observaciones/Dañado; al confirmar sube el stock; historial y detalle.
- HU-11: catálogo en ≤3 s con 50 usuarios; páginas internas con `React.lazy` + `Suspense`, `loading="lazy"` y esqueletos.
- HU-12: token en `Authorization`; cada rol solo accede a lo suyo; nada de `dangerouslySetInnerHTML`; errores genéricos "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.".
- HU-13/HU-15: probar 375, 768 y 1100 px sin scroll horizontal; Chrome/Edge/Firefox/Safari y móviles; el aviso para navegadores viejos ya está en el script inline de `index.html` (`noModule`): "Tu navegador es demasiado antiguo. Actualízalo a la última versión de Chrome, Edge, Firefox o Safari."; `browserslist` está en `package.json`.
- HU-14: `ErrorBoundary`, mensajes amigables, compra en ≤5 pasos, botones y mensajes consistentes, `*` en obligatorios.

## Antes de terminar

1. Repasa los criterios de la HU uno por uno, incluidos los errores.
2. `npm run lint`, `npm test` y `npm run build` sin errores.
3. Revisa 375, 768 y 1100 px, sin scroll horizontal; todo en español y sin colores fuera de `tokens.css`.
4. Prueba como Cliente, Administrador y sin sesión cuando aplique.
