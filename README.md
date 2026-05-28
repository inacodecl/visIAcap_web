# Inacap Renca Smart - Tótem Interactivo (Frontend)

Aplicación cliente para el Tótem del Aniversario 60 de Inacap. Desarrollada con Ionic y Angular, diseñada para ejecutarse en Pantalla táctil y Web.

## Funcionalidades Principales

La aplicación cuenta con 3 módulos de navegación horizontal:

1. **Pasado**: Línea de tiempo interactiva histórica.
2. **Presente**: Visualización de proyectos actuales de la sede.
3. **Futuro**: Proyectos de innovación estudiantil.

Además, incluye un panel de administración (`/admin`) para gestionar el contenido.

## Stack Tecnológico

- **Framework**: Ionic 8+ / Angular 20
- **Estilos**: SCSS / Ionic Utilities
- **Gestión de Estado**: Servicios RxJS + Angular Signals
- **Conexión**: API REST (Node.js/MySQL)

## Instalación y Despliegue

1. **Clonar el repositorio:**

```powershell
git clone https://github.com/inacodecl/visIAcap_web.git
```

2. **Instalar dependencias:**

```powershell
npm install
```

3. **Ejecutar en Desarrollo:**
Abre el servidor local con recarga en vivo:

```powershell
ionic serve
```

La app estará disponible en `http://localhost:8100/`.

## Configuración de API (Backend)

La aplicación ahora consume una API real. Para configurar la URL del backend, edita el archivo:
`src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // URL del Backend Node.js
};
```

## Desarrolladores
- Estudiante de Inacap Renca

## Nueva Arquitectura Modular (Refactor v2)

Se ha reestructurado el proyecto para mejorar la escalabilidad y el mantenimiento:

### Estructura de Carpetas
- **src/app/core**: Servicios, Guards, Modelos e Interceptores compartidos.
- **src/app/features**: Módulos funcionales divididos por dominio (`public`, `admin`, `auth`).
- **src/app/layout**: Componentes "Shell" que definen la estructura visual (`PublicLayout`, `AdminLayout`).

### Roles y Seguridad (RBAC)
- **Public**: Acceso libre a Home, Pasado y Presente.
- **Admin**: Acceso restringido (`/admin`) mediante `AdminGuard`.
- **Auth**: Login separado para administradores.

### UX Tótems
Se ha integrado `src/theme/totem.scss` para estilos específicos de pantallas verticales (1080x1920), aumentando áreas táctiles y tamaños de fuente automáticamente.

# Crear componente

```powershell
ng g c components/[nombre carpet<>]/[nombre componente].component --standalone
```

## Funcionalidad de Código QR InacapSmart (v2.1)

### Descripción
Se ha incorporado una nueva opción en el menú popover del footer llamada **QR InacapSmart**, colocada estéticamente entre "Cambio de Idioma y Traducción" y "Equipo Desarrollador". Al hacer clic sobre ella, se despliega un modal centrado en la pantalla con el código QR que redirige a `https://inacapsmart.cl/home`.
La modal cuenta con efectos visuales premium de **Glassmorphism** (`backdrop-filter`), animaciones fluidas a 60 FPS con transformaciones CSS y un efecto interactivo de línea láser de escáner. El diseño es adaptativo (responsivo) y está especialmente optimizado para pantallas táctiles de gran formato (Tótems interactivos) y dispositivos móviles.

### Tecnologías
- **Componentes Standalone de Angular 17+** (`QrModalComponent`).
- **Ionic Framework 7+** (`ModalController` e `IonIcon`).
- **CSS Avanzado / SCSS** con Glassmorphism (`backdrop-filter`) y Keyframes para micro-interacciones fluidas.
- **Offline First**: Carga la imagen del código QR de manera local (`src/assets/img/qr-inacapsmart.png`), garantizando la funcionalidad completa sin depender de conexión externa a internet en los Tótems de exhibición.

### Instrucciones de Ejecución
1. Asegurarse de tener la imagen del código QR descargada en `src/assets/img/qr-inacapsmart.png`.
2. Ejecutar la aplicación en modo desarrollo local usando:
   ```powershell
   ionic serve
   ```
3. Hacer clic en el botón `(i)` en la esquina inferior del footer y seleccionar **QR InacapSmart**.

### Endpoints y Contratos de Datos
- **Tipo de Acción de Popover**: `'qr'` añadido al contrato de acciones de `SystemMenuComponent`.
- **Ruta del Código QR**: `https://inacapsmart.cl/home`.
