# AGENTS.md — Perfumería Néctar (frontend)

Tienda virtual de perfumes. React 19 + Vite 8 + Tailwind v4, JavaScript (`.jsx`, **sin TypeScript**). Este archivo es la especificación del proyecto (Trello HU-1 a HU-15) y las reglas para agentes. Si algo no está aquí, **pregunta antes de inventarlo**.

## 1. Comandos

- `npm run dev` — servidor de desarrollo en `http://localhost:5173`. Reinícialo si cambias `vite.config.js` o instalas paquetes.
- `npm run lint` — ESLint (`eslint .`, ignora `dist`).
- `npm test` — Vitest (`vitest run`). Las pruebas viven junto al código como `*.test.js`.
- `npm run build` — build a `dist/`. Antes de terminar: `lint`, `test` y luego `build` deben pasar.
- `npm run preview` — sirve el build.
- Sin typecheck ni codegen. No agregues scripts más allá de los existentes.
- Login de prueba (mock): `cliente.perfumeria@gmail.com` / `Perfume2026!` (definido en `src/auth/mockApi.js`).

## 2. Estado actual (no asumas más de lo que existe)

- Rutas en `src/App.jsx`: `/` redirige a `/cuenta` o `/login`; `/login`; `/cuenta`; `*` → `/`.
- `ProtectedRoute` y `PublicOnlyRoute` están definidos **dentro de `App.jsx`**, no en archivos aparte.
- Páginas existentes: `src/page/Login.jsx`, `src/page/Account.jsx`.
- Auth: `src/auth/session.js`, `src/auth/mockApi.js`. Validaciones: `src/utils/validaciones.js` y `src/utils/validacionesHU5.js`.
- Pruebas: `src/utils/validaciones.test.js` (funciones) y `src/page/Login.test.jsx` (interfaz) con Vitest (`npm test`).
- Aún no existen `src/components/`, catálogo/carrito/pedidos/admin, ni `RoleRoute`/`useIdleLogout`. Las secciones 4–6 describen el **objetivo**; crea solo lo que la HU en curso necesite.

## 3. Reglas

- Una HU por vez, con cambios pequeños. Antes de terminar, repasa uno por uno los criterios de esa HU.
- Toda la interfaz va en **español**: textos, errores, etiquetas, `alt`, `aria-label`.
- Estilos: **Tailwind v4** vía `@tailwindcss/vite`; no existe `tailwind.config.js`. Colores y fuentes salen solo de `src/styles/tokens.css` (`@theme`) y se usan como clases (`bg-primary`, `font-serif`). Nunca hex sueltos ni librerías de UI (Bootstrap, MUI).
- Dependencias: solo se permite instalar `react-router-dom`. Vitest y Testing Library ya están como `devDependency` para pruebas; para cualquier otra, pregunta.
- `Fraunces` se carga con `<link>` de Google Fonts en `index.html`; no se instala paquete.
- API: URL desde `import.meta.env.VITE_API_URL` (local `http://localhost:8080`, con **http**; con https aparece `EPROTO: The TLS handshake failed`). Los endpoints no están definidos: no los inventes. Mientras tanto usa datos simulados aislados en `src/auth/mockApi.js`.
- No toques el backend.
- Nunca guardes contraseñas ni tokens en `localStorage`. La sesión vive en `sessionStorage` bajo `perfumeria.session` y solo se maneja desde `src/auth/session.js`.
- Sin `console.log`, sin credenciales de prueba visibles en pantalla ni código comentado. No agregues comentarios al código salvo que se pidan.
- ESLint aplica `react-refresh`: **no exportes constantes ni funciones auxiliares desde un archivo de componente**; ponlas en `src/utils/`.
- Estilo: 2 espacios, comillas simples, sin punto y coma.
- Las páginas van en `src/page/` (con `src`).

## 4. Diseño

Tokens (`--color-*`, `--font-*`) en `src/styles/tokens.css`; no los dupliques ni inventes colores.

- **Componentes base** (créalos cuando la HU los use): Card (fondo `card`, radio 28 px, padding 48 px / 24 px en celular, `max-w-[605px]`, sombra grande); Button (min-h 44 px, ancho completo en tarjetas, radio 14 px, peso 700, variantes `primary`/`secondary`/`ghost`/`danger`, `disabled` opacidad .6, `loading` cambia el texto y bloquea); Field (label arriba, `*` rojo en obligatorios, borde 1.5 px, radio 12 px, ayuda `aria-live="polite"`: gris / rojo "✕ …" / verde "✓ …"); PasswordField (botón Mostrar/Ocultar); Banner (`role="alert"`, variantes err/ok); ConfirmDialog obligatorio en acciones destructivas ("¿Eliminar «nombre»?", "Sí, eliminar", "Cancelar"); ProductCard (foto cuadrada `object-cover`, marca, nombre, ml, `S/ 189.90`, stock, etiqueta roja "Últimas unidades" con stock ≤ 5, "Sin foto" si falta); Sidebar (nombre, insignia "Rol: Cliente"/"Rol: Administrador", menú según rol, "Cerrar sesión").
- **Pantallas de acceso** (`/`, `/login`, `/registro`, sesión expirada): split 50/50. Izquierda: degradado `bg-1 → bg-3`, frasco, pétalos, "Néctar Supremo · ESENCIA · ELEGANCIA · ESTILO". Derecha: formulario en Card centrado, títulos `font-serif` peso 700. **<900 px**: escena arriba ~330 px y formulario como hoja blanca con esquinas superiores de 28 px.
- **Pantallas internas**: fondo `surface`, Sidebar oscuro (`bg-1`) de 250 px, contenido con 32 px de margen. En celular el Sidebar es un menú desplegable.
- Quiebres: 640 px y 900 px. Nunca scroll horizontal a 375/768/1100 px.
- Accesibilidad: contraste ≥ 4.5:1, foco visible, `<label>` en cada campo, objetivos táctiles ≥ 44 px, texto ≥ 14 px, respeta `prefers-reduced-motion`.

## 5. Rutas (objetivo)

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/` | Bienvenida: "Iniciar sesión" (primary) y "Crear cuenta" (secondary) | Público |
| `/login` | HU-1 | Público |
| `/registro` | HU-2 | Público |
| `/tienda` | HU-4 Catálogo | Cliente y Administrador |
| `/carrito`, `/pedidos` | Carrito y pedidos | Cliente |
| `/cuenta` | Cuenta, menú lateral y cierre de sesión | Con sesión |
| `/admin/perfumes` | HU-5 | Administrador |
| `/admin/ventas` | HU-6 y HU-7 | Administrador |
| `/admin/envios` | HU-8 | Administrador |
| `/admin/recepcion` | HU-9 | Administrador |
| `*` | Redirige a `/` con `replace` | — |

Sin sesión → `/login` con "Inicia sesión para continuar". Cliente en ruta de administrador → "Acceso denegado" (candado rojo y botón "Volver a la tienda").

## 6. Historias de usuario (criterios del Trello)

**HU-1 Inicio de sesión** (`src/page/Login.jsx`)
Valida credenciales; si fallan: "Correo o contraseña incorrectos…". Si aciertan: acceso y "¡Bienvenido a Perfumería Néctar!". Rechaza dominios sospechosos (`mailinator`, `yopmail`, `tempmail`, `10minutemail`, `guerrillamail`, `fake`, `test`, `example` y TLD `.xyz .tk .ml .ga .cf .gq .top`). Contraseña ≥ 12 caracteres. Correo con `^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$`. Estados: ✓ verde, Mostrar/Ocultar, botón en `loading`.

**HU-2 Registro**
Nombre, correo, contraseña y confirmación. Contraseña ≥ 12 con letras y números. Si no coinciden: "Las contraseñas no coinciden". Correo repetido → error; valida sintaxis. Rol **Cliente**. La contraseña se cifra en el backend (BCrypt); el frontend nunca la guarda. Éxito: "¡Cuenta creada con éxito! Te llevamos al inicio de sesión…" y redirección a `/login` con el correo escrito.

**HU-3 Cierre de sesión**
"Cerrar sesión" termina la sesión y vuelve a la bienvenida. El Cliente solo ve tienda, carrito y pedidos; en admin → "Acceso denegado". Expira a los 30 min sin actividad. Tras cerrar sesión, "Atrás" no muestra datos. El menú lateral muestra nombre y rol.

**HU-4 Catálogo**
Foto, marca, nombre, presentación, precio y stock. Búsqueda por nombre. Filtros por categoría (Mujer, Hombre, Unisex) y marca. Orden por más vendidos y por precio. "Últimas unidades" con stock bajo. Imagen por defecto sin foto. "N productos encontrados". Sin resultados: "0 productos encontrados", filtros activos como chips y "Limpiar filtros".

**HU-5 Registro de perfumes (admin)**
Nombre, marca, precio, stock y categoría. Precio > 0, stock ≥ 0. Foto a Cloudinary visible en catálogo; solo JPG/PNG/WEBP ≤ 2 MB. Editar. Confirmar antes de eliminar. No eliminar con ventas: "No se puede eliminar «nombre»: tiene ventas registradas."

**HU-6 Registro de ventas**
Cliente registrado. Fecha y hora automáticas. Total calculado. No permitir ventas sin productos. Al confirmar descuenta stock. Éxito: "¡Venta #N registrada con éxito!".

**HU-7 Detalle de venta**
Uno o varios perfumes con cantidad > 0. No vender más que el stock: "Stock insuficiente: solo hay N unidad(es) de «nombre»." Subtotal por línea (precio × cantidad). Modificar o quitar líneas antes de confirmar. Ver detalle de una venta registrada.

**HU-8 Pedido de envío**
Asociado a una venta existente. Dirección, ciudad y teléfono (9 dígitos) obligatorios. Estados: pendiente, en camino, entregado. Actualizar estado. Lista con su estado.

**HU-9 Recepción de carga**
Fecha y proveedor. Perfumes con cantidad > 0 y estado (Bueno, Con observaciones, Dañado). Al confirmar sube el stock. Historial y detalle de cada recepción.

**HU-10 Control de acceso**
Cerrar sesión visible e invalidante. "Atrás" no vuelve a internas. Sin sesión en ruta protegida → login. Expira por inactividad con "Tu sesión expiró por inactividad (30 min)". Confirmación al cerrar sesión.

**HU-11 Tiempo de respuesta**
Catálogo en ≤ 3 s, también con 50 usuarios y datos completos. Usa `React.lazy`, `loading="lazy"` con tamaños fijos y esqueletos de carga.

**HU-12 Seguridad**
Token en `Authorization`. Cada rol solo accede a lo suyo. Valida y limpia todo texto; nunca `dangerouslySetInnerHTML`. Solo HTTPS en producción. Errores sin detalles internos: "Ocurrió un error inesperado. Inténtalo de nuevo más tarde."

**HU-13 Usabilidad y diseño adaptable**
Todo se adapta a celular y computadora sin scroll horizontal. Controles fáciles de tocar. Imágenes sin deformar. Textos claros. Coincide con Figma.

**HU-14 Disponibilidad y respaldo**
`ErrorBoundary` y mensajes amigables. Compra en ≤ 5 pasos (Elegir perfume → Carrito → Datos de envío → Pago → Confirmar). Nombres de botones consistentes, mensajes en español, confirmación al eliminar, obligatorios con `*`. (Railway y respaldos son del backend.)

**HU-15 Compatibilidad**
Chrome, Edge, Firefox, Safari; Android/iOS; Windows/macOS/Linux; sin cortes ni scroll horizontal. Navegador antiguo: "Tu navegador es demasiado antiguo. Actualízalo a la última versión de Chrome, Edge, Firefox o Safari." Configura `browserslist` en `package.json`.

## 7. Sesión y roles

`src/auth/session.js` guarda en `sessionStorage` (clave `perfumeria.session`) `{ email, name, role: "Cliente" | "Administrador", token, lastActivity }`. Exporta `saveSession`, `clearSession`, `getSession`, `isAuthenticated`, `hasRole`.

- `ProtectedRoute` redirige a `/login` sin sesión. `RoleRoute` muestra "Acceso denegado" si el rol no coincide (cuando se cree).
- `useIdleLogout` actualizará `lastActivity` con clic/tecla/movimiento y cerrará a los 1 800 000 ms (30 min).
- Al cerrar sesión: `clearSession()`, `navigate("/", { replace: true })` y revisa la sesión también en `pageshow`, para que "Atrás" no muestre datos.

## 8. Definición de terminado

1. Cumple todos los criterios de su HU, incluidos los casos de error.
2. Se ve bien a 375 px, 768 px y 1100 px, sin scroll horizontal.
3. Sin textos en inglés ni colores fuera de `tokens.css`.
4. `npm run lint`, `npm test` y `npm run build` pasan sin errores.
5. Probado a mano como cliente, administrador y sin sesión (cuando la HU lo requiera).
