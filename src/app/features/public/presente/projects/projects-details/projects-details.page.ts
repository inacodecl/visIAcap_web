import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonContent, IonIcon, IonButton, IonSpinner, IonChip, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, globe, time, location, calendarNumber, analytics, arrowForwardCircle, imagesOutline, folderOpen } from 'ionicons/icons';
import { ProyectosService } from '../../../../../core/services/proyectos.service';
import { Proyecto } from '../../../../../core/models/proyecto.model';

@Component({
    selector: 'app-projects-details',
    templateUrl: './projects-details.page.html',
    styleUrls: ['./projects-details.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, IonButton, IonIcon, IonSpinner, RouterModule, IonChip, IonLabel]
})
export class ProjectsDetailsPage implements OnInit {
    private route = inject(ActivatedRoute);
    private proyectosService = inject(ProyectosService);

    proyecto = signal<Proyecto | null>(null);
    isLoading = signal(true);
    error = signal(false);

    constructor() {
        addIcons({ arrowBack, calendarNumber, location, analytics, imagesOutline, folderOpen, arrowForwardCircle, globe, time });
    }

    ngOnInit() {
        // Obtenemos el ID de la ruta
        const idStr = this.route.snapshot.paramMap.get('id');
        if (idStr) {
            this.loadProyecto(+idStr);
        } else {
            this.error.set(true);
            this.isLoading.set(false);
        }
    }

    loadProyecto(id: number) {
        this.isLoading.set(true);
        this.error.set(false);

        this.proyectosService.getProyecto(id, 'es').subscribe({
            next: (data: Proyecto) => {
                this.proyecto.set(data);
                this.isLoading.set(false);
            },
            error: (err: any) => {
                console.error('Error cargando proyecto', err);
                this.error.set(true);
                this.isLoading.set(false);
            }
        });
    }

    openExternalUrl() {
        const url = this.proyecto()?.url_externa;
        if (url) {
            window.open(url, '_blank');
        }
    }
}
