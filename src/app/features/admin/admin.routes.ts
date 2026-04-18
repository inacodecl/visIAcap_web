import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
        children: [
            {
                path: '',
                redirectTo: 'resumen',
                pathMatch: 'full'
            },
            {
                path: 'resumen',
                loadComponent: () => import('./dashboard/resumen/resumen.page').then(m => m.ResumenPage)
            },
            {
                path: 'historias',
                loadComponent: () => import('./history-manager/history-manager.page').then(m => m.HistoryManagerPage)
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./user-manager/user-manager.page').then(m => m.UserManagerPage)
            },
            {
                path: 'entrevistas',
                loadComponent: () => import('./interview-manager/interview-manager.page').then(m => m.InterviewManagerPage)
            },
            {
                path: 'proyectos',
                loadComponent: () => import('./project-manager/project-manager.page').then(m => m.ProjectManagerPage)
            },
            {
                path: 'futuro',
                loadComponent: () => import('./futuro-manager/futuro-manager.page').then(m => m.FuturoManagerPage)
            },
            {
                path: 'mi-perfil',
                loadComponent: () => import('./my-profile/my-profile.page').then(m => m.MyProfilePage)
            },
            {
                path: 'mi-actividad',
                loadComponent: () => import('./my-activity/my-activity.page').then(m => m.MyActivityPage)
            }
        ]
    },
    {
        path: 'historias',
        redirectTo: 'dashboard/historias',
        pathMatch: 'full'
    },
    {
        path: 'usuarios',
        redirectTo: 'dashboard/usuarios',
        pathMatch: 'full'
    },
    {
        path: 'entrevistas',
        redirectTo: 'dashboard/entrevistas',
        pathMatch: 'full'
    },
    {
        path: 'proyectos',
        redirectTo: 'dashboard/proyectos',
        pathMatch: 'full'
    },
    {
        path: 'futuro',
        redirectTo: 'dashboard/futuro',
        pathMatch: 'full'
    }
];
