# VisIAcap - Tótem Interactivo (Frontend)

Aplicación cliente para el Tótem del Aniversario 60 de Inacap. Desarrollada con Ionic y Angular, diseñada para ejecutarse en Pantalla táctil y Web.

## Funcionalidades Principales

La aplicación cuenta con 3 módulos de navegación horizontal:

1. Pasado: Línea de tiempo interactiva histórica.

2. Presente: Visualización de proyectos actuales de la sede.

3. Futuro: Proyectos de innovación estudiantil.

Además, incluye un panel de administración (/admin) para gestionar el contenido.

## Stack Tecnológico

- Framework: Ionic 8+ / Angular 20

- Estilos: SCSS / Ionic Utilities

- Gestión de Estado: Servicios RxJS

- Conexión: API REST (Node.js)

## Instalación y Despliegue

1. Clonar el repositorio:

```powershell
git clone https://github.com/inacodecl/visIAcap_web.git
```

2. Instalar dependencias:

```powershell
npm install
```

3. Ejecutar en Desarrollo:
Abre el servidor local con recarga en vivo:

```powershell
ionic serve
```

La app estará disponible en http://localhost:8100/.


## Configuración de API

Para cambiar la dirección del Backend, edita el archivo:
src/app/services/api.service.ts

```powershell
private apiUrl = 'http://localhost:3000/api'; // Desarrollo
```

## Desarrolladores
- Estudiante de Inacap Renca



