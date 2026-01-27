import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonToolbar, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonImg, IonSkeletonText
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, playCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { EntrevistaService } from '../../../../core/services/entrevista.service';
import { Entrevista } from '../../../../core/models/entrevista.model';
import { HomeHeaderComponent } from '../../../../components/headers/home-header/home-header.component';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-entrevistas',
    templateUrl: './entrevistas.page.html',
    styleUrls: ['./entrevistas.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule,
        IonButton, IonIcon, IonGrid, IonRow, IonCol, IonCard,
        IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
        IonSkeletonText,
        HomeHeaderComponent, HomeFooterComponent
    ]
})
export class EntrevistasPage implements OnInit, AfterViewInit, OnDestroy {

    private entrevistaService = inject(EntrevistaService);
    private router = inject(Router);

    // States
    entrevistas = signal<Entrevista[]>([]);
    isLoading = signal<boolean>(true);
    error = signal<string | null>(null);

    // Animation Refs
    @ViewChildren('cardElement', { read: ElementRef }) cardElements!: QueryList<ElementRef>;
    private observer: IntersectionObserver | null = null;

    constructor() {
        addIcons({ arrowBackOutline, playCircleOutline, alertCircleOutline });
    }

    ngOnInit() {
        this.loadEntrevistas();
    }

    ngAfterViewInit() {
        this.setupIntersectionObserver();

        // Revisa los observadores cuando los datos cambian (gestionados por cambios en QueryList)
        this.cardElements.changes.subscribe(() => {
            this.setupIntersectionObserver();
        });
    }

    ngOnDestroy() {
        this.disconnectObserver();
    }

    loadEntrevistas() {
        this.isLoading.set(true);
        this.error.set(null);

        this.entrevistaService.getEntrevistas().subscribe({
            next: (data) => {
                // Simular un pequeño delay para que se aprecie la animación de carga (opcional, quitar en prod si es muy lento)
                setTimeout(() => {
                    this.entrevistas.set(data);
                    this.isLoading.set(false);
                }, 500);
            },
            error: (err) => {
                console.error('Error cargando entrevistas', err);
                this.error.set('No se pudieron cargar las entrevistas. Intenta nuevamente.');
                this.isLoading.set(false);
            }
        });
    }

    setupIntersectionObserver() {
        this.disconnectObserver();

        const options = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% visible
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Stop observing once visible to save resources
                    this.observer?.unobserve(entry.target);
                }
            });
        }, options);

        this.cardElements.forEach(card => {
            this.observer?.observe(card.nativeElement);
        });
    }

    disconnectObserver() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    goBack() {
        this.router.navigate(['/pasado']);
    }

    openVideo(url: string) {
        if (url) {
            window.open(url, '_blank');
        }
    }

    ionViewWillEnter() {
        // Escenario para reiniciar animaciones si es necesario
        document.body.classList.add('page-entrevistas-active');
    }

    ionViewWillLeave() {
        document.body.classList.remove('page-entrevistas-active');
    }

}
