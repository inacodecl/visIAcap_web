import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HomeHeaderComponent } from '../../../../components/headers/home-header/home-header.component';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { WhiteCubeComponent } from '../../../../components/background/brillo/white-cube/white-cube.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { ProyectosService } from '../../../../core/services/proyectos.service';
import { Proyecto } from '../../../../core/models/proyecto.model';

@Component({
    selector: 'app-presente',
    templateUrl: './presente.page.html',
    styleUrls: ['./presente.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        CommonModule,
        FormsModule,
        IonButton,
        IonIcon,
        IonSpinner,
        HomeHeaderComponent,
        HomeFooterComponent,
        WhiteCubeComponent
    ]
})
export class PresentePage implements OnInit {
    private proyectosService = inject(ProyectosService);
    private router = inject(Router);

    // Signal para los proyectos
    proyectos = this.proyectosService.proyectos;
    isLoading = signal(false);

    constructor() {
        addIcons({ arrowBackOutline });
    }

    ngOnInit() {
        this.loadProyectos();
    }

    loadProyectos() {
        this.isLoading.set(true);
        this.proyectosService.getProyectos('es').subscribe({
            next: () => this.isLoading.set(false),
            error: (err) => {
                console.error('Error cargando proyectos:', err);
                this.isLoading.set(false);
            }
        });
    }

    goBack() {
        this.router.navigate(['/home']);
    }

    goToProject(proyecto: Proyecto) {
        console.log('Navegando a proyecto:', proyecto.slug);
        // Navegar al detalle del proyecto o a la URL externa si existe
        if (proyecto.url_externa) {
            window.open(proyecto.url_externa, '_blank');
        } else {
            this.router.navigate(['/presente/projects', proyecto.slug]);
        }
    }

}
