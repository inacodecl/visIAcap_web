import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, QueryList, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonIcon, IonButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { TimelineService } from '../../../../core/services/timeline.service';
import { Historia } from '../../../../core/models/historia.model';
import { addIcons } from 'ionicons';
import { chevronDown, arrowBack, locationOutline, calendarOutline, settingsSharp, add, remove, alertCircle } from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { HomeHeaderComponent } from '../../../../components/headers/home-header/home-header.component';
import { BackgroundBrilloComponent } from '../../../../components/background/brillo/background-brillo.component';
import { RedCardComponent } from '../../../../components/cards/red-card.component/red-card.component.component';

// Extendemos la interfaz Historia para incluir estado de la UI
interface TimelineEvent extends Historia {
  expanded: boolean;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonButton, IonIcon, IonSpinner,
    RouterModule,
    IonHeader,
    HomeFooterComponent,
    HomeHeaderComponent,
    BackgroundBrilloComponent,
    RedCardComponent
  ]
})
export class TimelinePage implements OnInit {

  private timelineService = inject(TimelineService);
  private cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService); // Public for HTML access

  @ViewChildren('milestoneItem') milestoneElements!: QueryList<ElementRef>;

  // Control para reiniciar la animación CSS de la línea
  animateLine = false;

  milestones: TimelineEvent[] = [];
  isLoading = true;
  error: string | null = null;

  // Variables de estado para la animación continua
  headerHeight = 350; // Altura inicial aproximada 
  logoWidth = 600; // Ancho inicial
  textScale = 1; // Escala del texto (1 = 100%)
  contentOffset = 0; // Desplazamiento vertical del contenido interno

  // Estado del modal
  selectedMilestone: TimelineEvent | null = null;
  isModalClosing = false;

  readonly MAX_HEIGHT = 350;
  readonly MIN_HEIGHT = 150;
  readonly SCROLL_RANGE = 400;

  private currentScrollTop = 0;

  constructor() {
    addIcons({ add, remove, alertCircle, chevronDown, arrowBack, locationOutline, calendarOutline, settingsSharp });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.error = null;

    this.timelineService.getHistorias().subscribe({
      next: (data) => {
        // Filtrar solo visibles y mapear a TimelineEvent
        this.milestones = data
          .filter(h => h.visible)
          .sort((a, b) => {
            const dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
            const dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
            // Si ambas tienen fecha, ordenamos por fecha
            if (dateA !== 0 && dateB !== 0) return dateA - dateB;
            // Si no, fallback al año
            return a.anio - b.anio;
          })
          .map(h => ({ ...h, expanded: false }));

        this.isLoading = false;
        // La detección de cambios ocurrirá y disparará milestoneElements.changes si aplica
      },
      error: (err) => {
        console.error('Error cargando timeline', err);
        this.error = 'No se pudo cargar la línea de tiempo. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  // Se ejecuta cada vez que la vista entra (navegación)
  ionViewWillEnter() {
    this.animateLine = false; // Reiniciar animación CSS de la línea
    this.currentScrollTop = 0; // Reiniciar rastreador de scroll
    this.updateAnimations(0); // Forzar estado inicial (fuera de pantalla)

    // Sincronización en caliente: Recargar datos al entrar
    // Esto asegura que si se editó en el Admin, se vea aquí de inmediato.
    this.loadData();
  }

  ionViewDidEnter() {
    // 1. Iniciar animación CSS de la línea con un pequeño retraso
    setTimeout(() => {
      this.animateLine = true;
      this.cdr.detectChanges(); // Notificar cambio a Angular

      // 2. Iniciar animación de entrada de las tarjetas
      // Si ya hay datos cargados checkeamos los elementos
      if (this.milestoneElements && this.milestoneElements.length > 0) {
        this.startEntranceAnimation();
      }

      // Siempre nos suscribimos a cambios por si los datos llegan tarde (async)
      if (this.milestoneElements) {
        this.milestoneElements.changes.subscribe(() => {
          // Solo iniciar si no ha iniciado o reiniciar si cambian datos drásticamente
          this.startEntranceAnimation();
        });
      }
    }, 100);
  }

  /**
   * Inicia el bucle de animación para la entrada suave de las tarjetas.
   */
  private startEntranceAnimation() {
    const startTime = Date.now();
    const duration = 1200; // Duración de 1.2s

    const animate = () => {
      const now = Date.now();
      let progress = (now - startTime) / duration;
      if (progress > 1) progress = 1;

      // Easing: easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      this.updateAnimations(easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  toggleMilestone(milestone: TimelineEvent) {
    // Abrir modal con la información del hito
    this.selectedMilestone = milestone;
    this.isModalClosing = false;
  }

  closeModal() {
    // Activar animación de salida
    this.isModalClosing = true;

    // Esperar a que termine la animación antes de cerrar
    setTimeout(() => {
      this.selectedMilestone = null;
      this.isModalClosing = false;
    }, 300);
  }

  onScroll(event: any) {
    this.currentScrollTop = event.detail.scrollTop;
    this.updateAnimations(1);
  }

  /**
   * Actualiza las animaciones de cabecera y tarjetas.
   * @param entranceFactor 0 -> 1 (0 = inicio carga, 1 = carga completa/scroll normal)
   */
  private updateAnimations(entranceFactor: number) {
    const scrollTop = this.currentScrollTop;
    const viewportHeight = window.innerHeight;

    // 1. Animación del Encabezado
    let progressHeader = scrollTop / this.SCROLL_RANGE;
    progressHeader = Math.max(0, Math.min(1, progressHeader));

    this.headerHeight = this.MAX_HEIGHT + (this.MIN_HEIGHT - this.MAX_HEIGHT) * progressHeader;
    this.logoWidth = 600 + (350 - 600) * progressHeader; // De 600 a 350px
    this.textScale = 1 + (0.7 - 1) * progressHeader; // De 1 a 0.7 (no tan pequeño)
    this.contentOffset = 0; // Ya no usamos offset, el contenido se centra automáticamente

    // 2. Animación de Tarjetas
    if (this.milestoneElements) {
      this.milestoneElements.forEach((elementRef, index) => {
        const element = elementRef.nativeElement;
        const rect = element.getBoundingClientRect();

        const distanceFromBottom = viewportHeight - rect.top;
        const animationRange = 500;
        let itemProgress = distanceFromBottom / animationRange;

        itemProgress = Math.max(0, Math.min(1, itemProgress));

        const targetScale = 0.5 + (0.5 * itemProgress);
        const targetOpacity = itemProgress;

        // Alternancia visual (Impares vs Pares)
        const isOdd = index % 2 !== 0;
        const startX = isOdd ? -50 : 50; // Unidades en 'vw'
        const targetX = startX * (1 - itemProgress);

        const finalX = (targetX * entranceFactor) + (startX * (1 - entranceFactor));
        const finalScale = (targetScale * entranceFactor) + (0.5 * (1 - entranceFactor));
        const finalOpacity = (targetOpacity * entranceFactor);

        element.style.transform = `translateX(${finalX}vw) scale(${finalScale})`;
        element.style.opacity = `${finalOpacity}`;
      });
    }
  }
}
