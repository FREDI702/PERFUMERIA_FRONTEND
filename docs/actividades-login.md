# Diagrama de actividades: inicio de sesión

Este flujo representa la implementación actual de HU-1 en `src/page/Login.jsx`, `src/utils/validaciones.js`, `src/auth/mockApi.js`, `src/auth/session.js` y `src/App.jsx`.

```mermaid
flowchart TD
  inicio([Inicio]) --> ruta{¿Qué ruta abre la persona?}
  ruta -->|/| raiz{¿Ya tiene sesión?}
  raiz -->|Sí| cuenta[Redirigir a /cuenta]
  raiz -->|No| formulario[Mostrar formulario de inicio de sesión]
  ruta -->|/login| publico{¿Ya tiene sesión?}
  publico -->|Sí| cuenta[Redirigir a /cuenta]
  publico -->|No| formulario[Mostrar formulario de inicio de sesión]
  ruta -->|/cuenta| protegido{¿Existe una sesión guardada?}
  protegido -->|Sí| miCuenta[Mostrar pantalla Mi cuenta]
  protegido -->|No| login[Redirigir a /login]
  ruta -->|Otra ruta| volverRaiz[Redirigir a /]
  volverRaiz --> raiz
  login --> formulario
  cuenta --> fin([Fin])
  miCuenta --> fin

  formulario --> enviar[Enviar correo y contraseña]
  enviar --> validar{¿Correo y contraseña pasan la validación?}
  validar -->|No| errores[Mostrar errores de formato, dominio o longitud]
  errores --> formulario
  validar -->|Sí| mock[Consultar autenticación simulada]
  mock --> credenciales{¿Coinciden las credenciales de prueba?}
  credenciales -->|No| errorCredenciales[Mostrar correo o contraseña incorrectos]
  errorCredenciales --> formulario
  credenciales -->|Sí| guardar[Guardar sesión en sessionStorage]
  guardar --> bienvenida[Mostrar mensaje de bienvenida]
  bienvenida --> navegar[Después de la espera, navegar a /cuenta]
  navegar --> protegido
```

La validación impide enviar campos vacíos, correos con formato no válido, dominios temporales o no confiables y contraseñas menores de 12 caracteres. La autenticación es simulada en el frontend; no hay una API de login conectada.

## Conclusión

El diagrama incluye los caminos de campos válidos e inválidos y las decisiones de acceso a rutas públicas y protegidas.  
Un correo o contraseña inválidos muestran ayuda en el formulario y no llaman a la autenticación simulada.  
Las credenciales incorrectas muestran un mensaje de error y permiten volver a intentar.  
Las credenciales correctas guardan la sesión y llevan a la cuenta.  
La ruta de cuenta comprueba la sesión antes de mostrar información interna.  
La validación, los mensajes, el inicio de sesión simulado y la protección de rutas existen en el código actual.  
La conexión a una API real y el cierre por inactividad todavía no están implementados.
