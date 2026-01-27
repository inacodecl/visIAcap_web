import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./login/login-admin.page').then(m => m.LoginAdminPage)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
