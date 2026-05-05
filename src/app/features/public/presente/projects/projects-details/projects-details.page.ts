import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, IonChip, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, arrowBackOutline, globe, time, location, calendarNumber, analytics, imagesOutline, folderOpen, qrCodeOutline, alertCircleOutline, calendarOutline, locationOutline, pulseOutline, folderOutline } from 'ionicons/icons';
import { ProyectosService } from '../../../../../core/services/proyectos.service';
import { Proyecto } from '../../../../../core/models/proyecto.model';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../../core/services/language.service';
import { ExternalTabService } from '../../../../../core/services/external-tab.service';
import { ExternalLinkButtonComponent } from '../../../../../components/buttons/external-link-button/external-link-button.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { HomeFooterComponent } from '../../../../../components/footers/home-footer/home-footer.component';
import { FanMenuComponent } from '../../../home/components/fan-menu/fan-menu.component';

@Component({
    selector: 'app-projects-details',
    templateUrl: './projects-details.page.html',
    styleUrls: ['./projects-details.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, IonSpinner, RouterModule, TranslateModule, QRCodeComponent, HomeFooterComponent, FanMenuComponent]
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
        addIcons({ arrowBackOutline, alertCircleOutline, calendarOutline, locationOutline, pulseOutline, imagesOutline, folderOutline, qrCodeOutline, arrowBack, calendarNumber, location, analytics, folderOpen, globe, time });
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
        this.router.navigate(['/presente']);
    }

    private externalTabService = inject(ExternalTabService);

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

    openUrl(url: string) {
        this.externalTabService.openTab(url);
    }

    // ========================================
    // Animación Header V2 (Scroll)
    // ========================================
    progressHeader: number = 0;
    private readonly SCROLL_RANGE = 200;

    onScroll(event: any) {
        const scrollTop = event.detail.scrollTop;
        let progress = scrollTop / this.SCROLL_RANGE;
        this.progressHeader = Math.max(0, Math.min(1, progress));
    }
}
