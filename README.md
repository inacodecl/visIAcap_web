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

