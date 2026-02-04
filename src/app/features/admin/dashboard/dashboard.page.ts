import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
    IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon,
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
        IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
        IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon,
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

        // Cargar datos en paralelo (simulado para las counts, idealmente el backend tendría un endpoint de stats)
        // Como no tenemos endpoint de stats, haremos llamadas ligeras o obtendremos los arrays.

        // 1. Historias (Línea de tiempo)
        const historias$ = this.timelineService.getHistorias('es', true);

        // 2. Entrevistas
        const entrevistas$ = this.entrevistaService.getEntrevistas(true);

        // 3. Proyectos
        const proyectos$ = this.proyectosService.getProyectos('es');

        // Ejecutar llamadas
        // Nota: Para usuarios solo cargamos si es superadmin, pero para simplificar métricas cargaremos todo si es posible
        // O manejaremos la lógica aquí.

        // Usamos Promesas para gestionar la asincronía básica de carga simultánea
        Promise.all([
            this.toPromise(historias$),
            this.toPromise(entrevistas$),
            this.toPromise(proyectos$),
            this.authService.isSuperAdmin ? this.toPromise(this.userService.getUsuarios(1, 1)) : Promise.resolve(null)
        ]).then(([historias, entrevistas, proyectos, usuarios]) => {

            this.stats.set({
                historias: Array.isArray(historias) ? historias.length : 0,
                entrevistas: Array.isArray(entrevistas) ? entrevistas.length : 0,
                proyectos: Array.isArray(proyectos) ? proyectos.length : 0,
                usuarios: usuarios && usuarios.total ? usuarios.total : (Array.isArray(usuarios) ? usuarios.length : 0) // Manejo flexible de respuesta usuarios
            });

            this.isLoading.set(false);
        }).catch(err => {
            console.error('Error cargando métricas', err);
            this.isLoading.set(false);
        });
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
