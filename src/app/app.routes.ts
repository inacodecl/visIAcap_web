import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },

  {
    path: 'login-admin',
    loadComponent: () => import('./pages/admin/login-admin/login-admin.page').then(m => m.LoginAdminPage)
  },
  {
    path: 'pasado',
    loadComponent: () => import('./pages/pasado/pasado.page').then(m => m.PasadoPage)
  },
  {
    path: 'pasado/entrevistas',
    loadComponent: () => import('./pages/pasado/entrevistas/entrevistas.page').then(m => m.EntrevistasPage)
  },
  {
    path: 'admin/historias',
    loadComponent: () => import('./pages/admin/history-manager/history-manager.page').then(m => m.HistoryManagerPage),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/usuarios',
    loadComponent: () => import('./pages/admin/user-manager/user-manager.page').then(m => m.UserManagerPage),
    canActivate: [adminGuard]
  },
  {
    path: 'timeline',
    loadComponent: () => import('./pages/timeline/timeline.page').then(m => m.TimelinePage)
  }
];
