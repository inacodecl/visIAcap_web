import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonSkeletonText, IonIcon, IonContent } from '@ionic/angular/standalone';
import { time, videocam, rocket, people, analyticsOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from '../../../../core/services/auth.service';
import { TimelineService } from '../../../../core/services/timeline.service';
import { EntrevistaService } from '../../../../core/services/entrevista.service';
import { ProyectosService } from '../../../../core/services/proyectos.service';
import { UserService } from '../../../../core/services/user.service';

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

    isLoading = signal<boolean>(true);
    stats = signal({
        historias: 0,
        entrevistas: 0,
        proyectos: 0,
        usuarios: 0
    });

    constructor() {
        addIcons({ time, videocam, rocket, people, analyticsOutline });
    }

    ngOnInit() {
        this.loadMetrics();
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
