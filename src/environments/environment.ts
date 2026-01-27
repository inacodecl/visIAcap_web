// Este archivo se puede reemplazar durante la compilación mediante el uso del array `fileReplacements`.
// `ng build` reemplaza `environment.ts` con `environment.prod.ts`.
// La lista de reemplazos de archivos se puede encontrar en `angular.json`.

export const environment = {
  production: false,
  apiUrl: '/api'
};

/*
 * Para facilitar la depuración en modo de desarrollo, puedes importar el siguiente archivo
 * para ignorar los marcos de pila de errores relacionados con la zona, como `zone.run`, `zoneDelegate.invokeTask`.
 *
 * Esta importación debe comentarse en el modo de producción porque tendrá un impacto negativo
 * en el rendimiento si se produce un error.
 */
// import 'zone.js/plugins/zone-error';  // Incluido con Angular CLI.
