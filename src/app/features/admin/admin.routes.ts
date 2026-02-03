import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'historias',
        pathMatch: 'full'
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
    }
];
