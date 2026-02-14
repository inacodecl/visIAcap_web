import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./splash/splash.page').then(m => m.SplashPage)
    },
    {
        path: 'home',
        loadComponent: () => import('./home/homev2/homev2.page').then(m => m.Homev2Page)
    },
    {
        path: 'home-legacy',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
    },
    {
        path: 'pasado',
        children: [
            {
                path: '',
                loadComponent: () => import('./pasado/hub/pasado.page').then(m => m.PasadoPage)
            },
            {
                path: 'timeline',
                loadComponent: () => import('./pasado/timeline/timeline.page').then(m => m.TimelinePage)
            },
            {
                path: 'interviews',
                loadComponent: () => import('./pasado/interviews/entrevistas.page').then(m => m.EntrevistasPage)
            }
        ]
    },
    {
        path: 'presente',
        children: [
            {
                path: '',
                loadComponent: () => import('./presente/projects/projects.page').then(m => m.ProjectsPage)
            },
            {
                path: 'projects/:id',
                loadComponent: () => import('./presente/projects/projects-details/projects-details.page').then(m => m.ProjectsDetailsPage)
            }
        ]
    },
    {
        path: 'futuro',
        loadComponent: () => import('./futuro/hub/futuro.page').then(m => m.FuturoPage)
    },
    {
        path: 'homev2',
        loadComponent: () => import('./home/homev2/homev2.page').then(m => m.Homev2Page)
    }
];
