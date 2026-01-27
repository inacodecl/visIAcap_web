import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },
  {
    path: '',
    component: PublicLayoutComponent,
    loadChildren: () => import('./features/public/public.routes').then(m => m.routes)
  },
 
  {
    path: 'login-admin',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];
