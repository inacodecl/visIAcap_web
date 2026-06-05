import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonSkeletonText, IonIcon, IonContent } from '@ionic/angular/standalone';
import { 
    time, 
    videocam, 
    rocket, 
    people, 
    analyticsOutline,
    eyeOutline,
    peopleOutline,
    trendingUpOutline,
    alertCircleOutline,
    refreshOutline,
    chevronUpOutline,
    chevronDownOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from '../../../../core/services/auth.service';
import { TimelineService } from '../../../../core/services/timeline.service';
import { EntrevistaService } from '../../../../core/services/entrevista.service';
import { ProyectosService } from '../../../../core/services/proyectos.service';
import { UserService } from '../../../../core/services/user.service';
import { AnalyticsService, MetricaAnalytics } from '../../../../core/services/analytics.service';

@Component({
    selector: 'app-admin-resumen',
    templateUrl: './resumen.page.html',
    styleUrls: ['./resumen.page.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, IonIcon, IonSkeletonText, IonContent]
})
export class ResumenPage implements OnInit {
    authService = inject(AuthService);
    private timelineService = inject(TimelineService);
    private entrevistaService = inject(EntrevistaService);
    private proyectosService = inject(ProyectosService);
    private userService = inject(UserService);
    private analyticsService = inject(AnalyticsService);

    isLoading = signal<boolean>(true);
    stats = signal({
        historias: 0,
        entrevistas: 0,
        proyectos: 0,
        usuarios: 0
    });

    // Signals para Google Analytics
    isLoadingAnalytics = signal<boolean>(true);
    analyticsData = signal<MetricaAnalytics[]>([]);
    analyticsError = signal<string | null>(null);
    totalVistas = signal<number>(0);
    totalUsuarios = signal<number>(0);
    topRuta = signal<string>('');
    topVistas = signal<number>(0);
    showDetailedTable = signal<boolean>(false);

    constructor() {
        addIcons({ 
            time, 
            videocam, 
            rocket, 
            people, 
            analyticsOutline,
            eyeOutline,
            peopleOutline,
            trendingUpOutline,
            alertCircleOutline,
            refreshOutline,
            chevronUpOutline,
            chevronDownOutline
        });
    }

    ngOnInit() {
        this.loadMetrics();
        this.loadAnalytics();
    }

    loadMetrics() {
        this.isLoading.set(true);

        const isSuperAdmin = this.authService.isSuperAdmin;
        const promises: Promise<any>[] = [];

        if (isSuperAdmin) {
            promises.push(Promise.resolve([]));
            promises.push(Promise.resolve([]));
            promises.push(Promise.resolve([]));
            promises.push(this.toPromise(this.userService.getUsuarios(1, 1)));
        } else {
            promises.push(this.toPromise(this.timelineService.getHistorias('es', true)));
            promises.push(this.toPromise(this.entrevistaService.getEntrevistas('es', true)));
            promises.push(this.toPromise(this.proyectosService.getProyectos('es')));
            promises.push(Promise.resolve(null));
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

    /**
     * Carga las métricas reales de Google Analytics 4
     */
    loadAnalytics() {
        this.isLoadingAnalytics.set(true);
        this.analyticsError.set(null);

        this.analyticsService.getMetricas().subscribe({
            next: (res) => {
                if (res.ok && res.data) {
                    this.analyticsData.set(res.data);
                    
                    // Calcular totales locales
                    const vistas = res.data.reduce((acc, curr) => acc + curr.vistas_totales, 0);
                    const usuarios = res.data.reduce((acc, curr) => acc + curr.usuarios_unicos, 0);
                    this.totalVistas.set(vistas);
                    this.totalUsuarios.set(usuarios);

                    // Obtener top ruta (la primera del array ordenado de mayor a menor)
                    if (res.data.length > 0) {
                        this.topRuta.set(res.data[0].ruta);
                        this.topVistas.set(res.data[0].vistas_totales);
                    } else {
                        this.topRuta.set('Ninguna');
                        this.topVistas.set(0);
                    }
                } else {
                    this.analyticsError.set(res.error?.userMessage || 'No se pudieron cargar las métricas de tráfico.');
                }
                this.isLoadingAnalytics.set(false);
            },
            error: (err) => {
                console.error('Error al cargar analíticas en frontend:', err);
                this.analyticsError.set('Ocurrió un error al conectar con el servidor.');
                this.isLoadingAnalytics.set(false);
            }
        });
    }

    /**
     * Contrae o expande la tabla detallada de analíticas
     */
    toggleDetails() {
        this.showDetailedTable.set(!this.showDetailedTable());
    }

    private extractTotal(response: any): number {
        if (!response) return 0;
        if (typeof response === 'number') return response;
        if (Array.isArray(response)) return response.length;
        if (response.meta) {
            return response.meta.total || response.meta.totalItems || 0;
        }
        if (response.total) return response.total;
        if (response.data && Array.isArray(response.data)) return response.data.length;
        return 0;
    }

    private toPromise(obs: any): Promise<any> {
        return new Promise(resolve => {
            obs.subscribe({
                next: (data: any) => resolve(data),
                error: () => resolve([])
            });
        });
    }
}
