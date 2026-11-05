# AGENTS.md — Perfumería Néctar (frontend)

Tienda virtual de perfumes. React 19 + Vite 8 + Tailwind v4, JavaScript (`.jsx`, sin TypeScript). Solo se trabaja el frontend; `backend/` está vacío y no se toca. Si algo no está aquí ni en el código, pregunta antes de inventarlo.

## Comandos

- `npm run dev` — Vite en el puerto 5173 (si está ocupado, usa 5174). Reinícialo si cambias `vite.config.js` o instalas paquetes.
- `npm run lint` y `npm run build` — deben pasar antes de terminar; ejecútalos en ese orden. El build sale a `dist/`.
- `npm run preview` — sirve el build.
- No hay tests ni typecheck. No agregues scripts salvo que te lo pidan. Usa npm (`package-lock.json`).

## Estado actual (no asumas lo que falta)

- Implementadas las pantallas de la tabla de rutas: bienvenida, login (HU-1), registro (HU-2), sesión expirada, catálogo, carrito, pedidos, cuenta y panel de administración (perfumes, ventas, envíos, recepción y reportes).
- Rutas existentes: `/`, `/login`, `/registro`, `/sesion-expirada`, `/tienda`, `/carrito`, `/pedidos`, `/cuenta`, `/admin` → `/admin/perfumes`, `/admin/perfumes`, `/admin/ventas`, `/admin/envios`, `/admin/recepcion`, `/admin/reportes` y `*` → `/`.
- Componentes en `src/components/`: `AppLayout`, `Sidebar`, `Card`, `Button`, `Field`, `PasswordField`, `Banner`, `ConfirmDialog`, `Table`, `ProductCard`, `BottleArt`, `PageLoader`, `ErrorBoundary` y `PerfumeScene`.
- `ProtectedRoute`, `PublicOnlyRoute` y `RoleRoute` están dentro de `src/App.jsx`. `src/auth/` tiene `session.js`, `mockApi.js` y `useIdleLogout.js`.
- Datos simulados en `src/auth/mockApi.js` (usuarios Cliente/Administrador, productos, ventas, envíos y recepciones). El carrito vive en memoria en `src/cart/cartStore.js`.
- `src/page/` es la carpeta correcta; `page/` en la raíz y `Nueva carpeta/` están vacías. `src/App.css` no existe.
- `Login` usa `mockApi.js`; todavía no llama a `VITE_API_URL`. Las fotos de perfumes se guardan como data URL local, no en Cloudinary.
- Actualiza esta sección al agregar pantallas o componentes.

## Reglas

- Toda la interfaz en español: textos, errores, etiquetas, `alt`, `aria-label`.
- Tailwind v4 con `@tailwindcss/vite`; no existe `tailwind.config.js`. Colores solo desde `src/styles/tokens.css` (`@theme`) usados como utilidades (`bg-primary`, `text-ink`). No uses hex sueltos ni librerías de UI.
- Dependencias: solo se permite `react-router-dom`. Para cualquier otra, pregunta.
- API: `import.meta.env.VITE_API_URL` (local `http://localhost:8080`, con **http**; con https aparece `EPROTO: The TLS handshake failed`). No hay endpoints definidos ni `.env`: no los inventes. Los datos simulados se aíslan en `src/auth/mockApi.js`.
- No toques `backend/`.
- Nunca guardes contraseñas ni tokens en `localStorage`. La sesión vive en `sessionStorage`, clave `perfumeria.session`, y solo se maneja desde `src/auth/session.js` (`saveSession`, `clearSession`, `getSession`, `isAuthenticated`, `hasRole`, `touchSession`).
- Sin `console.log`, sin credenciales de prueba visibles en pantalla, sin código comentado.
- ESLint aplica `react-refresh`: no exportes constantes ni funciones auxiliares desde archivos de componente; ponlas en `src/utils/`.
- Estilo: 2 espacios, comillas simples, sin punto y coma.
- `index.html` ya carga Fraunces e Inter desde Google Fonts; no instales paquetes de fuentes.

## Diseño

- Pantallas de acceso: split 50/50. Escena morada (`bg-1 → bg-3`, `PerfumeScene`) a la izquierda y formulario a la derecha sobre `card`. Bajo 900 px la escena pasa a cabecera de ~330 px y el formulario sube como hoja.
- Bienvenida: frasco dorado con halo, giro 3D suave, flotación y sombra animada (`.perfume-turn`, `.perfume-float`, `.perfume-shadow`, `.halo-spin`); se desactiva con `prefers-reduced-motion`.
- Pantallas internas: fondo `surface`, Sidebar oscuro `bg-1` de 250 px; en celular es un menú desplegable.
- Quiebres 640 px y 900 px. Nunca scroll horizontal.
- Accesibilidad: contraste 4.5:1, foco visible, `<label>` en todo campo, objetivos táctiles ≥44 px, texto ≥14 px, respeta `prefers-reduced-motion`.
- Componentes base existentes: Card `max-w-[605px]`, radio 28 px, padding 48 px (24 px en móvil); Button `min-h-11`, radio 14 px, peso 700, variantes `primary|secondary|ghost|danger`, `loading` cambia el texto; Field con label, `*` rojo, borde 1.5 px y ayuda `aria-live` ("✕ …" / "✓ …"); PasswordField con Mostrar/Ocultar; Banner `role="alert"` err/ok; ConfirmDialog en toda acción destructiva; ProductCard con "Últimas unidades" si el stock es ≤5; Sidebar con nombre, "Rol: Cliente/Administrador", menú y "Cerrar sesión".

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

- HU-1: valida sintaxis `^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$`; rechaza dominios con `mailinator`, `yopmail`, `tempmail`, `10minutemail`, `guerrillamail`, `fake`, `test`, `example` y TLD `.xyz .tk .ml .ga .cf .gq .top`; contraseña ≥12; error "Correo o contraseña incorrectos…"; éxito "¡Bienvenido a Perfumería Néctar!". Ya está en `validaciones.js`/`Login.jsx`.
- HU-2: nombre, correo, contraseña y confirmación; ≥12 con letras y números; "Las contraseñas no coinciden"; correo repetido da error; rol Cliente; éxito "¡Cuenta creada con éxito! Te llevamos al inicio de sesión…" y redirección a `/login` con el correo escrito.
- HU-3/HU-10: cierre de sesión visible; "Atrás" no muestra datos; expira a los 30 min sin actividad con "Tu sesión expiró por inactividad (30 min)"; confirmación al cerrar sesión.
- HU-4: foto, marca, nombre, presentación, precio y stock; búsqueda por nombre; filtros Mujer/Hombre/Unisex y marca; orden por más vendidos y precio; "N productos encontrados"; sin resultados "0 productos encontrados" con chips y "Limpiar filtros".
- HU-5: nombre, marca, precio, stock y categoría; precio > 0; stock ≥ 0; foto con vista previa local (JPG/PNG/WEBP ≤2 MB; Cloudinary queda pendiente); confirmar antes de eliminar; no eliminar con ventas: "No se puede eliminar «nombre»: tiene ventas registradas."
- HU-6/HU-7: cliente registrado; fecha y hora automáticas; total calculado; no vender sin productos ni más que el stock: "Stock insuficiente: solo hay N unidad(es) de «nombre»."; subtotal por línea; editar o quitar líneas antes de confirmar; éxito "¡Venta #N registrada con éxito!".
- HU-8: venta existente; dirección, ciudad y teléfono de 9 dígitos obligatorios; estados pendiente, en camino y entregado; actualizar estado y listar.
- HU-9: fecha y proveedor; perfumes con cantidad > 0 y estado Bueno/Con observaciones/Dañado; al confirmar sube el stock; historial y detalle.
- HU-11: catálogo en ≤3 s con 50 usuarios; páginas internas con `React.lazy` + `Suspense`, `loading="lazy"` y esqueletos.
- HU-12: token en `Authorization`; cada rol solo accede a lo suyo; nada de `dangerouslySetInnerHTML`; errores genéricos "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.".
- HU-13/HU-15: probar 375, 768 y 1100 px sin scroll horizontal; Chrome/Edge/Firefox/Safari y móviles; si el navegador es viejo muestra "Tu navegador es demasiado antiguo…" (pendiente); `browserslist` ya está en `package.json`.
- HU-14: `ErrorBoundary`, mensajes amigables, compra en ≤5 pasos, botones y mensajes consistentes, `*` en obligatorios.

## Antes de terminar

1. Repasa los criterios de la HU uno por uno, incluidos los errores.
2. `npm run lint` → `npm run build` sin errores.
3. Revisa 375, 768 y 1100 px, sin scroll horizontal; todo en español y sin colores fuera de `tokens.css`.
4. Prueba como Cliente, Administrador y sin sesión cuando aplique.
