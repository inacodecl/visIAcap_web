import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonToolbar, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonImg, IonSkeletonText, IonModal
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EntrevistaService } from '../../../../core/services/entrevista.service';
import { Entrevista } from '../../../../core/models/entrevista.model';
import { GeometricOverlayTopComponent } from '../../home/components/geometric-overlay-top/geometric-overlay-top.component';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { arrowBackOutline, playCircleOutline, alertCircleOutline, videocamOutline, filmOutline, closeCircleOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-entrevistas',
    templateUrl: './entrevistas.page.html',
    styleUrls: ['./entrevistas.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule,
        IonButton, IonIcon, IonGrid, IonRow, IonCol, IonCard,
        IonCardHeader, IonCardTitle,
        IonSkeletonText, IonModal,
        GeometricOverlayTopComponent, HomeFooterComponent
    ]
})
export class EntrevistasPage implements OnInit, AfterViewInit, OnDestroy {

    private entrevistaService = inject(EntrevistaService);
    private router = inject(Router);

    // States
    entrevistas = signal<Entrevista[]>([]);
    isLoading = signal<boolean>(true);
    error = signal<string | null>(null);

    // Video Modal States
    isVideoModalOpen = signal<boolean>(false);
    currentVideoUrl = signal<SafeResourceUrl | null>(null);
    private sanitizer = inject(DomSanitizer);

    // Animation Refs
    @ViewChildren('cardElement', { read: ElementRef }) cardElements!: QueryList<ElementRef>;
    private observer: IntersectionObserver | null = null;

    constructor() {
        addIcons({ arrowBackOutline, playCircleOutline, alertCircleOutline, videocamOutline, filmOutline, closeCircleOutline });
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
        if (!url) return;

        // Extract YouTube ID
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        const videoId = match && match[1];

        if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&fs=1&enablejsapi=1`;
            this.currentVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
            this.isVideoModalOpen.set(true);
        } else {
            // Fallback for non-youtube links or error
            window.open(url, '_blank');
        }
    }

    closeVideo() {
        this.isVideoModalOpen.set(false);
        // Pequeño delay para remover el iframe después de que termine la animación
        setTimeout(() => {
            this.currentVideoUrl.set(null);
        }, 300);
    }

    ionViewWillEnter() {
        // Escenario para reiniciar animaciones si es necesario
        document.body.classList.add('page-entrevistas-active');
    }

    ionViewWillLeave() {
        document.body.classList.remove('page-entrevistas-active');
    }

}
