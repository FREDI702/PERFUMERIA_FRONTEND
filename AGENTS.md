# AGENTS.md — Perfumería Néctar (frontend)

Tienda virtual de perfumes. React 19 + Vite + Tailwind v4, JavaScript (`.jsx`). Este archivo define las reglas, el diseño y los criterios de aceptación (Trello HU-1 a HU-15). Si algo no está aquí, **pregunta antes de inventarlo**.

## 1. Comandos

- `npm run dev` — servidor de desarrollo (puerto 5173). Reinícialo si cambias `vite.config.js` o instalas paquetes.
- `npm run lint` — ESLint (`eslint .`).
- `npm run build` — build a `dist/`. Orden antes de terminar: `lint` → `build`.
- No hay tests ni typecheck. No agregues scripts salvo que te lo pidan.

## 2. Reglas

- Una HU por vez, con cambios pequeños. Antes de terminar, repasa los criterios de esa HU uno por uno.
- Toda la interfaz va en **español**: textos, errores, etiquetas, `alt`, `aria-label`.
- Estilos: **Tailwind v4** (ya instalado con `@tailwindcss/vite`; no existe `tailwind.config.js`). Los colores van como variables en `src/styles/tokens.css` con `@theme`, y se usan desde Tailwind (`bg-primary`). No uses valores de color sueltos ni librerías de UI (Bootstrap, MUI).
- Dependencias: solo se permite instalar `react-router-dom`. Para cualquier otra, pregunta.
- La fuente `Fraunces` (serif, títulos de acceso) se carga con un `<link>` de Google Fonts en `index.html`; no se instala paquete.
- API: la URL sale de `import.meta.env.VITE_API_URL` (local: `http://localhost:8080`, con **http**; con https aparece el error `EPROTO: The TLS handshake failed`). Los endpoints no están definidos aquí: no los inventes. Mientras tanto, usa datos simulados aislados en un solo archivo (`src/auth/mockApi.js`) para poder reemplazarlos.
- No toques el backend.
- Nunca guardes contraseñas ni tokens en `localStorage`. La sesión vive en `sessionStorage` y solo se maneja desde `src/auth/session.js`.
- Sin `console.log`, sin credenciales de prueba visibles en la pantalla ni código comentado.
- ESLint aplica `react-refresh`: **no exportes constantes o funciones auxiliares desde un archivo de componente**; ponlas en archivos aparte (`src/utils/`).
- Estilo de código existente: 2 espacios, comillas simples, sin punto y coma. `src/App.css` es sobrante de la plantilla de Vite; no lo uses y bórralo si ya nada lo importa.

## 3. Estructura

```
src/
  auth/        session.js, mockApi.js, ProtectedRoute.jsx, RoleRoute.jsx, useIdleLogout.js
  components/  Button, Card, Field, PasswordField, Banner, Sidebar, ProductCard, Table, ConfirmDialog
  page/        Welcome, Login, Register, Account, Catalog, Cart, Orders, NotFound
  page/admin/  Perfumes, Sales, Shipments, Receptions
  styles/      tokens.css
  utils/       validaciones (email, contraseña)
  App.jsx      rutas
  main.jsx     importa ./index.css
  index.css    @import "tailwindcss"; @import "./styles/tokens.css";
```

Crea solo lo que la HU en curso necesite. `src/page/` (con `src`) es la carpeta correcta; la carpeta `page/` de la raíz está vacía y no se usa.

## 4. Diseño

### Tokens (`src/styles/tokens.css`)

```css
@theme {
  --color-bg-1: #2b2030;
  --color-bg-2: #4a3550;
  --color-bg-3: #654d68;
  --color-card: #fafafa;
  --color-ink: #1f1b24;
  --color-muted: #6b6470;
  --color-line: #e3dce6;
  --color-eyebrow: #7a4a78;
  --color-lavender: #c9a8f0;
  --color-primary: #111827;
  --color-secondary: #2563eb;
  --color-ok: #1f7a4d;
  --color-ok-bg: #e4f4ea;
  --color-err: #b3261e;
  --color-err-bg: #fbe9e7;
  --color-warn: #8a5a00;
  --color-warn-bg: #fff3d6;
  --color-surface: #f7f3f8;
  --font-sans: Inter, "Segoe UI", system-ui, sans-serif;
  --font-serif: Fraunces, Georgia, serif;
}
```

### Componentes base

- **Card**: fondo `card`, radio 28 px, padding 48 px (24 px en celular), `max-w-[605px]`, sombra grande.
- **Button**: alto mínimo 44 px, ancho completo en tarjetas, radio 14 px, texto en peso 700. Variantes `primary`, `secondary`, `ghost` (borde `line`), `danger`. `disabled` con opacidad .6. `loading` cambia el texto ("Validando credenciales…") y bloquea el clic.
- **Field**: `<label>` arriba, `*` rojo en obligatorios, borde 1.5 px, radio 12 px. Debajo, una línea de ayuda de 14 px con `aria-live="polite"`: gris al inicio, rojo con "✕ …" si falla, verde con "✓ …" si es válido. El borde cambia de color igual que la ayuda.
- **PasswordField**: campo con botón "Mostrar / Ocultar" a la derecha.
- **Banner**: caja con borde sobre el formulario, `err` o `ok`, con `role="alert"`.
- **ConfirmDialog**: obligatorio en toda acción destructiva ("¿Eliminar «nombre»?", botones "Sí, eliminar" y "Cancelar").
- **ProductCard**: foto cuadrada (`object-cover`), marca, nombre, presentación (ml), precio `S/ 189.90`, stock. Etiqueta roja "Últimas unidades" si el stock es 5 o menos. Sin foto: imagen por defecto con "Sin foto".
- **Sidebar** (pantallas internas): nombre del usuario, insignia "Rol: Cliente" o "Rol: Administrador", menú según rol y "Cerrar sesión".

### Layout

- **Pantallas de acceso** (`/`, `/login`, `/registro`, sesión expirada): pantalla dividida 50 % / 50 %. Izquierda: escena del perfume (degradado morado `bg-1 → bg-3`, frasco, pétalos, texto "Néctar Supremo · ESENCIA · ELEGANCIA · ESTILO"). Derecha: formulario sobre `card`, centrado. Títulos en `font-serif`, peso 700.
- **Menos de 900 px**: la escena pasa arriba como cabecera (~330 px) y el formulario sube como hoja blanca con esquinas superiores redondeadas de 28 px.
- **Pantallas internas**: fondo `surface`, Sidebar oscuro (`bg-1`) de 250 px y contenido con 32 px de margen. En celular el Sidebar es un menú desplegable.
- Quiebres: 640 px y 900 px. Nunca scroll horizontal.
- **Accesibilidad**: contraste mínimo 4.5:1, foco visible, todos los campos con `<label>`, objetivos táctiles de 44 px o más, textos de 14 px o más, respeta `prefers-reduced-motion`.

## 5. Rutas

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

Sin sesión → `/login` con el mensaje "Inicia sesión para continuar". Cliente en ruta de administrador → pantalla "Acceso denegado" (candado rojo y botón "Volver a la tienda").

## 6. Historias de usuario (criterios del Trello)

**HU-1 Inicio de sesión** (`src/page/Login.jsx`)
1. Valida las credenciales ingresadas.
2. Si son incorrectas: banner de error "Correo o contraseña incorrectos…".
3. Si son correctas: permite el acceso y muestra "¡Bienvenido a Perfumería Néctar!".
4. Rechaza correos falsos o dominios sospechosos: `mailinator`, `yopmail`, `tempmail`, `10minutemail`, `guerrillamail`, `fake`, `test`, `example` y terminaciones `.xyz .tk .ml .ga .cf .gq .top`.
5. Contraseña de **12 caracteres como mínimo** (no exactos).
6. Valida la sintaxis del correo con `^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$`.
- Estados visibles: ✓ verde en campos válidos, botón Mostrar/Ocultar en la contraseña, botón en estado `loading`.

**HU-2 Registro**
Campos: nombre, correo, contraseña y confirmación. Contraseña de 12 o más caracteres con letras y números. Si no coinciden → "Las contraseñas no coinciden". Correo repetido → error. Valida la sintaxis del correo. La cuenta se crea con rol **Cliente**. La contraseña se cifra en el backend (BCrypt); el frontend nunca la guarda. Éxito → "¡Cuenta creada con éxito! Te llevamos al inicio de sesión…" y redirección a `/login` con el correo ya escrito.

**HU-3 Cierre de sesión**
"Cerrar sesión" termina la sesión y vuelve a la bienvenida. El Cliente solo ve tienda, carrito y pedidos. Cliente en pantalla de administración → "Acceso denegado". La sesión expira a los 30 minutos sin actividad. Tras cerrar sesión, el botón "Atrás" no muestra datos. El menú lateral muestra nombre y rol.

**HU-4 Catálogo**
Foto, marca, nombre, presentación, precio y stock. Búsqueda por nombre. Filtros por categoría (Mujer, Hombre, Unisex) y marca. Orden por más vendidos y por precio. "Últimas unidades" con stock bajo. Imagen por defecto sin foto. Contador "N productos encontrados". Sin resultados: "0 productos encontrados", filtros activos como chips y botón "Limpiar filtros".

**HU-5 Registro de perfumes (admin)**
Nombre, marca, precio, stock y categoría. Precio mayor que 0. Stock no negativo. Foto a Cloudinary, visible en el catálogo; solo JPG, PNG o WEBP de máximo 2 MB. Editar. Confirmar antes de eliminar. No eliminar un perfume con ventas: "No se puede eliminar «nombre»: tiene ventas registradas."

**HU-6 Registro de ventas**
Seleccionar un cliente registrado. Fecha y hora automáticas. Total calculado. No permitir ventas sin productos. Al confirmar, descuenta stock. Éxito: "¡Venta #N registrada con éxito!".

**HU-7 Detalle de venta**
Agregar uno o varios perfumes con cantidad. Cantidad mayor a 0. No vender más que el stock: "Stock insuficiente: solo hay N unidad(es) de «nombre»." Subtotal por línea (precio × cantidad). Modificar o quitar líneas antes de confirmar. Ver el detalle de una venta registrada.

**HU-8 Pedido de envío**
Asociado a una venta existente. Dirección, ciudad y teléfono (9 dígitos), todos obligatorios. Estados: pendiente, en camino, entregado. Actualizar estado. Lista de pedidos con su estado.

**HU-9 Recepción de carga**
Fecha y proveedor. Perfumes recibidos con cantidad mayor a 0 y estado (Bueno, Con observaciones, Dañado). Al confirmar, el stock sube. Historial y detalle de cada recepción.

**HU-10 Control de acceso**
Opción visible de cerrar sesión que invalida la sesión. "Atrás" no vuelve a pantallas internas. Sin sesión en ruta protegida → redirige al login. Expira por inactividad con el mensaje "Tu sesión expiró por inactividad (30 min)". Mensaje de confirmación al cerrar sesión.

**HU-11 Tiempo de respuesta**
Página principal de productos en 3 s como máximo, también con 50 usuarios, con la información completa del producto. Implementación: rutas con `React.lazy`, imágenes con `loading="lazy"` y tamaños fijos, esqueletos de carga.

**HU-12 Seguridad**
API con token en el encabezado `Authorization`. Cada rol solo accede a lo suyo. Valida y limpia todo texto ingresado (nunca `dangerouslySetInnerHTML`). Solo HTTPS en producción. Los errores no muestran detalles internos: "Ocurrió un error inesperado. Inténtalo de nuevo más tarde."

**HU-13 Usabilidad y diseño adaptable**
Todas las pantallas se adaptan a celular y computadora, sin scroll horizontal. Botones y campos fáciles de tocar. Imágenes sin deformarse. Textos claros y legibles. El diseño coincide con Figma.

**HU-14 Disponibilidad y respaldo**
Los errores del servidor no tumban la app: usa un `ErrorBoundary` y mensajes amigables. Comprar en 5 pasos como máximo (Elegir perfume → Carrito → Datos de envío → Pago → Confirmar). Botones con nombres consistentes, mensajes en español, confirmación al eliminar, campos obligatorios con `*`. (Producción en Railway y respaldos son del backend, no del frontend.)

**HU-15 Compatibilidad**
Chrome, Edge, Firefox y Safari; Android e iOS; Windows, macOS y Linux. Sin cortes ni scroll horizontal. Si el navegador es demasiado antiguo: "Tu navegador es demasiado antiguo. Actualízalo a la última versión de Chrome, Edge, Firefox o Safari." Configura `browserslist` en `package.json`.

## 7. Sesión y roles

`src/auth/session.js` guarda en `sessionStorage`, bajo la clave `perfumeria.session`, un objeto `{ email, name, role: "Cliente" | "Administrador", token, lastActivity }`.

- Exporta: `saveSession(user)`, `clearSession()`, `getSession()`, `isAuthenticated()`, `hasRole(role)`.
- `ProtectedRoute` redirige a `/login` sin sesión. `RoleRoute` muestra "Acceso denegado" si el rol no coincide.
- `useIdleLogout` actualiza `lastActivity` con clic, tecla y movimiento, y cierra la sesión a los 1 800 000 ms (30 min).
- Al cerrar sesión: `clearSession()`, `navigate("/", { replace: true })` y revisión de la sesión también en el evento `pageshow`, para que "Atrás" no muestre datos.

## 8. Definición de terminado

1. Cumple todos los criterios de su HU, incluidos los casos de error.
2. Se ve bien a 375 px, 768 px y 1100 px, sin scroll horizontal.
3. Sin textos en inglés ni colores fuera de `tokens.css`.
4. `npm run lint` y `npm run build` pasan sin errores.
5. Probado a mano como cliente, administrador y sin sesión (cuando la HU lo requiera).
