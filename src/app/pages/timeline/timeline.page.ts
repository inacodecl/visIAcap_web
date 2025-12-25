import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { HomeHeaderComponent } from '../../components/headers/home-header/home-header.component';
import { HomeFooterComponent } from '../../components/footers/home-footer/home-footer.component';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { ChangeDetectorRef } from '@angular/core';

interface Milestone {
  year: number;
  image: string;
  description: string;
  expanded: boolean;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HomeHeaderComponent,
    HomeFooterComponent,
    IonIcon,
    IonButton]
})
export class TimelinePage implements OnInit {

  @ViewChildren('milestoneItem') milestoneElements!: QueryList<ElementRef>;

  // Control para reiniciar la animación CSS de la línea
  animateLine = false;

  milestones: Milestone[] = [
    { year: 1960, image: 'assets/img/img-1960.png', description: 'Fundación de INACAP.', expanded: false },
    { year: 1962, image: 'assets/img/img-1962.png', description: 'Primeros cursos técnicos.', expanded: false },
    { year: 1966, image: 'assets/img/img-1966.png', description: 'Expansión a regiones.', expanded: false },
    { year: 1967, image: 'assets/img/img-1967.png', description: 'Nuevas tecnologías.', expanded: false },
    { year: 1968, image: 'assets/img/img-1968-s1.png', description: 'Modernización curricular.', expanded: false },
    { year: 1970, image: 'https://placehold.co/300x200/333/fff?text=1970', description: 'Acreditación institucional.', expanded: false },
    { year: 1980, image: 'https://placehold.co/300x200/333/fff?text=1980', description: 'Nuevas tecnologías.', expanded: false },
    { year: 1990, image: 'https://placehold.co/300x200/333/fff?text=1990', description: 'Modernización curricular.', expanded: false },
    { year: 2000, image: 'https://placehold.co/300x200/333/fff?text=2000', description: 'Acreditación institucional.', expanded: false },
    { year: 2010, image: 'https://placehold.co/300x200/333/fff?text=2010', description: 'Nuevas sedes.', expanded: false },
    { year: 2024, image: 'https://placehold.co/300x200/333/fff?text=2024', description: 'Innovación y Futuro.', expanded: false },
  ];

  // Variables de estado para la animación continua
  headerHeight = 350; // Altura inicial aproximada 
  logoWidth = 600; // Ancho inicial
  headerPadding = 20; // Padding inicial
  headerBdrop = 0; // Opacidad/Blur inicial

  readonly MAX_HEIGHT = 350; // ~30vh
  readonly MIN_HEIGHT = 100; // Altura mínima deseada
  readonly SCROLL_RANGE = 400; // Distancia de scroll para completar la animación

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({ add, remove });
  }

  ngOnInit() {
  }

  // Se ejecuta cada vez que la vista entra (navegación)
  ionViewWillEnter() {
    this.animateLine = false; // Reiniciar animación CSS de la línea
    this.currentScrollTop = 0; // Reiniciar rastreador de scroll
    this.updateAnimations(0); // Forzar estado inicial (fuera de pantalla)
  }

  ionViewDidEnter() {
    // 1. Iniciar animación CSS de la línea con un pequeño retraso
    setTimeout(() => {
      this.animateLine = true;
      this.cdr.detectChanges(); // Notificar cambio a Angular

      // 2. Iniciar animación de entrada de las tarjetas
      if (this.milestoneElements && this.milestoneElements.length > 0) {
        this.startEntranceAnimation();
      } else {
        // Si los elementos no están listos, esperar a que cambien
        this.milestoneElements.changes.subscribe(() => {
          this.startEntranceAnimation();
        });
      }
    }, 100);
  }

  /**
   * Inicia el bucle de animación para la entrada suave de las tarjetas.
   * Interpola entre la posición inicial (fuera de pantalla) y la posición de scroll actual.
   */
  private startEntranceAnimation() {
    const startTime = Date.now();
    const duration = 1200; // Duración de 1.2s

    const animate = () => {
      const now = Date.now();
      let progress = (now - startTime) / duration;
      if (progress > 1) progress = 1;

      // Easing: easeOutCubic (comienza rápido, frena suave al final)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      this.updateAnimations(easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  toggleMilestone(milestone: Milestone) {
    milestone.expanded = !milestone.expanded;
  }

  onScroll(event: any) {
    // Al hacer scroll manual, asumimos que la entrada ya terminó (factor 1)
    this.currentScrollTop = event.detail.scrollTop;
    this.updateAnimations(1);
  }

  private currentScrollTop = 0;

  /**
   * Actualiza las animaciones de cabecera y tarjetas.
   * @param entranceFactor 0 -> 1 (0 = inicio carga, 1 = carga completa/scroll normal)
   */
  private updateAnimations(entranceFactor: number) {
    const scrollTop = this.currentScrollTop;
    const viewportHeight = window.innerHeight;

    // ----------------------------
    // 1. Animación del Encabezado
    // ----------------------------
    let progressHeader = scrollTop / this.SCROLL_RANGE;
    // Clampear valor entre 0 y 1
    progressHeader = Math.max(0, Math.min(1, progressHeader));

    this.headerHeight = this.MAX_HEIGHT + (this.MIN_HEIGHT - this.MAX_HEIGHT) * progressHeader;
    this.logoWidth = 600 + (240 - 600) * progressHeader;
    this.headerPadding = 20 + (10 - 20) * progressHeader;

    // ----------------------------
    // 2. Animación de Tarjetas (Scrubbing)
    // ----------------------------
    if (this.milestoneElements) {
      this.milestoneElements.forEach((elementRef, index) => {
        const element = elementRef.nativeElement;
        const rect = element.getBoundingClientRect();

        // Calcular progreso basado en posición en viewport
        const distanceFromBottom = viewportHeight - rect.top;
        const animationRange = 500; // Rango de pixeles para completar la animación
        let itemProgress = distanceFromBottom / animationRange;

        // Clampear entre 0 y 1
        itemProgress = Math.max(0, Math.min(1, itemProgress));

        // Propiedades Objetivo (Estado final según scroll)
        const targetScale = 0.5 + (0.5 * itemProgress); // De 0.5 a 1.0
        const targetOpacity = itemProgress; // De 0 a 1

        // Determinación de dirección (Izquierda/Derecha)
        const isOdd = index % 2 !== 0; // Impares (índice 1, 3...) vs Pares (0, 2...)
        // Nota: Ajustar según lógica visual deseada (Impares izquierda, Pares derecha)
        const startX = isOdd ? -50 : 50; // Unidades en 'vw'

        // Posición Objetivo del Scroll: 'startX' se reduce a 0 conforme 'itemProgress' llega a 1
        const targetX = startX * (1 - itemProgress);

        // Interpolación Final (Mezcla con animación de entrada)
        // Si entranceFactor es 0, forzamos posición startX (lejos).
        // Si entranceFactor es 1, usamos targetX (calculado por scroll).

        const finalX = (targetX * entranceFactor) + (startX * (1 - entranceFactor));
        const finalScale = (targetScale * entranceFactor) + (0.5 * (1 - entranceFactor));
        const finalOpacity = (targetOpacity * entranceFactor);

        // Aplicar estilos optimizados
        element.style.transform = `translateX(${finalX}vw) scale(${finalScale})`;
        element.style.opacity = `${finalOpacity}`;
      });
    }
  }
}
