import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
    IonContent, IonCard, IonIcon, IonGrid, IonRow, IonCol,
    IonSkeletonText, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { time, videocam, rocket, people, arrowForwardCircle, grid, logOut, chevronForwardOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { TimelineService } from '../../../core/services/timeline.service';
import { EntrevistaService } from '../../../core/services/entrevista.service';
import { ProyectosService } from '../../../core/services/proyectos.service';
import { UserService } from '../../../core/services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        IonContent, IonCard, IonIcon, IonGrid, IonRow, IonCol,
        IonSkeletonText, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton
    ]
})
export class DashboardPage implements OnInit {
    // Inyección de Servicios
    authService = inject(AuthService);
    private router = inject(Router);
    private timelineService = inject(TimelineService);
    private entrevistaService = inject(EntrevistaService);
    private proyectosService = inject(ProyectosService);
    private userService = inject(UserService);

    // Estado con Signals
    isLoading = signal<boolean>(true);

    // Métricas
    stats = signal({
        historias: 0,
        entrevistas: 0,
        proyectos: 0,
        usuarios: 0
    });

    constructor() {
        addIcons({ grid, logOut, time, videocam, rocket, people, chevronForwardOutline, arrowForwardCircle });
    }

    ngOnInit() {
        this.loadMetrics();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }

    loadMetrics() {
        this.isLoading.set(true);

        const isSuperAdmin = this.authService.isSuperAdmin;

        // Array de promesas
        const promises: Promise<any>[] = [];

        if (isSuperAdmin) {
            // SuperAdmin: Solo carga usuarios
            promises.push(Promise.resolve([])); // Historias placeholder
            promises.push(Promise.resolve([])); // Entrevistas placeholder
            promises.push(Promise.resolve([])); // Proyectos placeholder
            promises.push(this.toPromise(this.userService.getUsuarios(1, 1)));
        } else {
            // Admin (Content): Carga todo MENOS usuarios
            promises.push(this.toPromise(this.timelineService.getHistorias('es', true)));
            promises.push(this.toPromise(this.entrevistaService.getEntrevistas(true)));
            promises.push(this.toPromise(this.proyectosService.getProyectos('es')));
            promises.push(Promise.resolve(null)); // Usuarios placeholder
        }

        Promise.all(promises).then(([historias, entrevistas, proyectos, usuarios]) => {
            this.stats.set({
                historias: Array.isArray(historias) ? historias.length : 0,
                entrevistas: Array.isArray(entrevistas) ? entrevistas.length : 0,
                proyectos: Array.isArray(proyectos) ? proyectos.length : 0,
                usuarios: this.extractTotal(usuarios)
            });

            this.isLoading.set(false);
        }).catch(err => {
            console.error('Error cargando métricas', err);
            this.isLoading.set(false);
        });
    }

    private extractTotal(response: any): number {
        if (!response) return 0;
        if (typeof response === 'number') return response;
        if (Array.isArray(response)) return response.length;

        // Estructura paginada común { data: [], meta: { total: 10 } }
        if (response.meta) {
            return response.meta.total || response.meta.totalItems || 0;
        }

        // Estructura plana con total { data: [], total: 10 }
        if (response.total) return response.total;

        // Fallback a longitud de data si existe
        if (response.data && Array.isArray(response.data)) return response.data.length;

        return 0;
    }

    // Helper para convertir observable a promesa y manejar errores sin romper el Promise.all
    private toPromise(obs: any): Promise<any> {
        return new Promise(resolve => {
            obs.subscribe({
                next: (data: any) => resolve(data),
                error: () => resolve([])
            });
        });
    }
}
