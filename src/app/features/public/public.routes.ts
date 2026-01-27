import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
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
                path: 'projects',
                loadComponent: () => import('./presente/projects/projects.page').then(m => m.ProjectsPage)
            }
        ]
    },
    {
        path: 'futuro',
        loadComponent: () => import('./futuro/hub/futuro.page').then(m => m.FuturoPage)
    }
];
