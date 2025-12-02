import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)},
  {
    path: 'gestion-usuarios',
    loadComponent: () => import('./pages/admin/gestion-usuarios/gestion-usuarios.page').then( m => m.GestionUsuariosPage)
  },
  {
    path: 'login-admin',
    loadComponent: () => import('./pages/admin/login-admin/login-admin.page').then( m => m.LoginAdminPage)
  }
];
