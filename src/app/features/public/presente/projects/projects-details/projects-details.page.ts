import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, IonChip, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, arrowBackOutline, globe, time, location, calendarNumber, analytics, imagesOutline, folderOpen, qrCodeOutline } from 'ionicons/icons';
import { ProyectosService } from '../../../../../core/services/proyectos.service';
import { Proyecto } from '../../../../../core/models/proyecto.model';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../../core/services/language.service';
import { ExternalLinkButtonComponent } from '../../../../../components/buttons/external-link-button/external-link-button.component';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
    selector: 'app-projects-details',
    templateUrl: './projects-details.page.html',
    styleUrls: ['./projects-details.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, IonSpinner, RouterModule, IonChip, IonLabel, TranslateModule, ExternalLinkButtonComponent, QRCodeComponent]
})
export class ProjectsDetailsPage implements OnInit {
    private route = inject(ActivatedRoute);
    private proyectosService = inject(ProyectosService);
    private router = inject(Router);
    private languageService = inject(LanguageService);

    proyecto = signal<Proyecto | null>(null);
    isLoading = signal(true);
    error = signal(false);

    constructor() {
        addIcons({ arrowBack, arrowBackOutline, calendarNumber, location, analytics, imagesOutline, folderOpen, globe, time, qrCodeOutline });
    }

    ngOnInit() {
        const idStr = this.route.snapshot.paramMap.get('id');
        if (idStr) {
            this.loadProyecto(+idStr);
        } else {
            this.error.set(true);
            this.isLoading.set(false);
        }
    }

    goBack() {
        this.router.navigate(['/presente/projects']);
    }

    loadProyecto(id: number) {
        this.isLoading.set(true);
        this.error.set(false);

        this.proyectosService.getProyecto(id, this.languageService.getCurrentLang()).subscribe({
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

    // openExternalUrl() fue reemplazado por <app-external-link-button>
    // que delega la lógica al ExternalTabService (cooldown + cierre automático).
}
