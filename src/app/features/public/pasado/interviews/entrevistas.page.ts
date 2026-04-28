import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, HostListener } from '@angular/core';
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
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { arrowBackOutline, playCircleOutline, alertCircleOutline, videocamOutline, filmOutline, closeCircleOutline, arrowForwardOutline, play } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language.service';
import { FanMenuComponent } from '../../home/components/fan-menu/fan-menu.component';
@Component({
    selector: 'app-entrevistas',
    templateUrl: './entrevistas.page.html',
    styleUrls: ['./entrevistas.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule,
        IonButton, IonIcon, 
        IonSkeletonText, IonModal,
        HomeFooterComponent,
        TranslateModule,
        FanMenuComponent
    ]
})
export class EntrevistasPage implements OnInit, AfterViewInit, OnDestroy {

    private entrevistaService = inject(EntrevistaService);
    private router = inject(Router);
    private languageService = inject(LanguageService);

    // States
    entrevistas = signal<Entrevista[]>([]);
    isLoading = signal<boolean>(true);
    error = signal<string | null>(null);

    // Video Modal States
    isVideoModalOpen = signal<boolean>(false);
    currentEntrevista = signal<Entrevista | null>(null);
    currentVideoUrl = signal<SafeResourceUrl | null>(null);
    modalBreakpoints = signal<number[]>([0, 0.6]);
    modalInitialBreakpoint = signal<number>(0.6);
    private sanitizer = inject(DomSanitizer);

    // YouTube Player Control
    @ViewChild('youtubeIframe') youtubeIframe!: ElementRef<HTMLIFrameElement>;
    isPlayerPlaying = true;
    private playerCurrentTime = 0;

    // Animation Refs
    @ViewChildren('cardElement', { read: ElementRef }) cardElements!: QueryList<ElementRef>;
    private observer: IntersectionObserver | null = null;

    constructor() {
        addIcons({ arrowBackOutline, videocamOutline, alertCircleOutline, playCircleOutline, arrowForwardOutline, filmOutline, closeCircleOutline, play });
        this.updateModalBreakpoints();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.updateModalBreakpoints();
    }

    private updateModalBreakpoints() {
        if (window.innerWidth <= 768) {
            this.modalBreakpoints.set([0, 0.85]);
            this.modalInitialBreakpoint.set(0.85);
        } else {
            this.modalBreakpoints.set([0, 0.6]);
            this.modalInitialBreakpoint.set(0.6);
        }
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

        this.entrevistaService.getEntrevistas(this.languageService.getCurrentLang()).subscribe({
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

    openVideo(entrevista: Entrevista) {
        if (!entrevista || !entrevista.url_video) return;

        // Extract YouTube ID
        const match = entrevista.url_video.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        const videoId = match && match[1];

        if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&fs=1&enablejsapi=1`;
            this.currentVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
            this.currentEntrevista.set(entrevista);
            this.isVideoModalOpen.set(true);
        } else {
            // Fallback for non-youtube links or error
            window.open(entrevista.url_video, '_blank');
        }
    }

    closeVideo() {
        this.isVideoModalOpen.set(false);
        this.isPlayerPlaying = true;
        this.playerCurrentTime = 0;
        setTimeout(() => {
            this.currentVideoUrl.set(null);
            this.currentEntrevista.set(null);
        }, 300);
    }

    // --- YouTube Player Controls via postMessage ---

    /** Se ejecuta cuando el iframe termina de cargar. Envía 'listening' para que YouTube empiece a enviar actualizaciones de tiempo. */
    onIframeLoad() {
        setTimeout(() => {
            const iframe = this.youtubeIframe?.nativeElement;
            if (iframe?.contentWindow) {
                iframe.contentWindow.postMessage(JSON.stringify({
                    event: 'listening',
                    id: 'ytplayer'
                }), '*');
            }
        }, 800);
    }

    @HostListener('window:message', ['$event'])
    onYouTubeMessage(event: MessageEvent) {
        // Aceptar mensajes de cualquier subdominio de youtube
        if (!event.origin.includes('youtube.com')) return;
        try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            if (data?.info?.currentTime !== undefined) {
                this.playerCurrentTime = data.info.currentTime;
            }
            if (data?.info?.playerState !== undefined) {
                // 1 = playing, 2 = paused
                this.isPlayerPlaying = data.info.playerState === 1;
            }
        } catch { /* Ignorar mensajes no-JSON */ }
    }

    private sendYouTubeCommand(func: string, args: any[] = []) {
        const iframe = this.youtubeIframe?.nativeElement;
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func,
                args
            }), '*');
        }
    }

    togglePlayPause() {
        if (this.isPlayerPlaying) {
            this.sendYouTubeCommand('pauseVideo');
        } else {
            this.sendYouTubeCommand('playVideo');
        }
        this.isPlayerPlaying = !this.isPlayerPlaying;
    }

    seekRelative(seconds: number) {
        const newTime = Math.max(0, this.playerCurrentTime + seconds);
        this.sendYouTubeCommand('seekTo', [newTime, true]);
    }

    ionViewWillEnter() {
        document.body.classList.add('page-entrevistas-active');
    }

    ionViewWillLeave() {
        document.body.classList.remove('page-entrevistas-active');
    }

}
