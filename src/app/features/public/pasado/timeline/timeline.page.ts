import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, QueryList, ElementRef, inject, ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
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
    BackgroundBrilloComponent
  ]
})
export class TimelinePage implements OnInit, AfterViewInit, OnDestroy {

  private timelineService = inject(TimelineService);
  private cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService); 

  @ViewChildren('milestoneNode') milestoneNodes!: QueryList<ElementRef>;
  @ViewChildren('milestoneCard') milestoneCards!: QueryList<ElementRef>;
  
  @ViewChild('timelineWrapper') timelineWrapper!: ElementRef;
  @ViewChild('timelineSvg') timelineSvg!: ElementRef;
  @ViewChild('pathBase') pathBase!: ElementRef;
  @ViewChild('pathProgress') pathProgress!: ElementRef;

  milestones: TimelineEvent[] = [];
  isLoading = true;
  error: string | null = null;

  // Animación del Header
  headerHeight = 350; 
  logoWidth = 600; 
  textScale = 1; 
  contentOffset = 0; 

  readonly MAX_HEIGHT = 350;
  readonly MIN_HEIGHT = 150;
  readonly SCROLL_RANGE = 400;

  // Lógica de Curva Dinámica
  private pathLength = 0;
  private lengthMap: {y: number, l: number}[] = [];
  private cardObserver!: IntersectionObserver;

  constructor() {
    addIcons({ add, remove, alertCircle, chevronDown, arrowBack, locationOutline, calendarOutline, settingsSharp });
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Configurar el IntersectionObserver para las tarjetas Glassmorphism
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px', 
        threshold: 0.1
    };

    this.cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    this.milestoneCards.changes.subscribe(() => {
        this.observeCards();
        setTimeout(() => this.drawDynamicLine(), 100);
    });
  }

  ngOnDestroy() {
      if (this.cardObserver) {
          this.cardObserver.disconnect();
      }
  }

  loadData() {
    this.isLoading = true;
    this.error = null;

    this.timelineService.getHistorias().subscribe({
      next: (data) => {
        this.milestones = data
          .filter(h => h.visible)
          .sort((a, b) => {
            const dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
            const dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
            if (dateA !== 0 && dateB !== 0) return dateA - dateB;
            return a.anio - b.anio;
          })
          .map(h => {
            let parsedMedia: any = h.media;
            let parsedTags: any = h.tags;

            if (typeof h.media === 'string') {
              try { parsedMedia = JSON.parse(h.media); } catch (e) { parsedMedia = []; }
            }
            if (typeof h.tags === 'string') {
              try { parsedTags = JSON.parse(h.tags); } catch (e) { parsedTags = []; }
            }

            return {
              ...h,
              media: Array.isArray(parsedMedia) ? parsedMedia : [],
              tags: Array.isArray(parsedTags) ? parsedTags : [],
              expanded: false // El Estado de Tarjeta
            };
          });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando timeline', err);
        this.error = 'No se pudo cargar la línea de tiempo. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  ionViewWillEnter() {
    this.loadData();
  }

  @HostListener('window:resize')
  onResize() {
      if (!this.isLoading && this.milestones.length > 0) {
          this.drawDynamicLine();
      }
  }

  // --- LÓGICA DE DIBUJO DE SVG (CURVA) ---
  private drawDynamicLine() {
      if (!this.timelineWrapper || !this.timelineSvg || !this.pathBase || !this.pathProgress || this.milestoneNodes.length === 0) return;

      const wrapperElement = this.timelineWrapper.nativeElement;
      const svgElement = this.timelineSvg.nativeElement;
      const pathBaseEl = this.pathBase.nativeElement;
      const pathProgressEl = this.pathProgress.nativeElement;

      const wrapperRect = wrapperElement.getBoundingClientRect();
      
      this.timelineSvg.nativeElement.setAttribute('width', wrapperRect.width);
      this.timelineSvg.nativeElement.setAttribute('height', wrapperRect.height);

      let d = '';
      let toggleCurve = true; 

      const nodes = this.milestoneNodes.toArray().map(ref => ref.nativeElement);

      nodes.forEach((node, index) => {
          const rect = node.getBoundingClientRect();
          const x = (rect.left - wrapperRect.left) + (rect.width / 2);
          const y = (rect.top - wrapperRect.top) + (rect.height / 2);

          if (index === 0) {
              d += `M ${x} ${y - 100} L ${x} ${y} `;
          } else {
              const prevRect = nodes[index - 1].getBoundingClientRect();
              const prevX = (prevRect.left - wrapperRect.left) + (prevRect.width / 2);
              const prevY = (prevRect.top - wrapperRect.top) + (prevRect.height / 2);

              const distanceY = y - prevY;
              const offset = toggleCurve ? -80 : 80; 

              d += `C ${prevX + offset} ${prevY + distanceY/3}, ${x + offset} ${y - distanceY/3}, ${x} ${y} `;
              toggleCurve = !toggleCurve;
          }

          if (index === nodes.length - 1) {
              d += `L ${x} ${y + 150}`;
          }
      });

      pathBaseEl.setAttribute('d', d);
      pathProgressEl.setAttribute('d', d);

      this.pathLength = pathProgressEl.getTotalLength();
      pathProgressEl.style.strokeDasharray = this.pathLength;
      pathProgressEl.style.strokeDashoffset = this.pathLength;
      
      this.lengthMap = [];
      const steps = 300; 
      for (let i = 0; i <= steps; i++) {
          const l = (i / steps) * this.pathLength;
          const point = pathProgressEl.getPointAtLength(l);
          this.lengthMap.push({ y: point.y, l: l });
      }

      this.updateScrollProgress(0); 
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    
    // Header
    let progressHeader = scrollTop / this.SCROLL_RANGE;
    progressHeader = Math.max(0, Math.min(1, progressHeader));
    this.headerHeight = this.MAX_HEIGHT + (this.MIN_HEIGHT - this.MAX_HEIGHT) * progressHeader;
    this.logoWidth = 600 + (350 - 600) * progressHeader;
    this.textScale = 1 + (0.7 - 1) * progressHeader;

    // SVG Curva Geometría
    this.updateScrollProgress(scrollTop);
  }

  private updateScrollProgress(scrollTop: number) {
      if (!this.timelineWrapper || !this.pathProgress) return;

      const windowHeight = window.innerHeight;
      const wrapperRect = this.timelineWrapper.nativeElement.getBoundingClientRect();
      const pathProgressEl = this.pathProgress.nativeElement;
      
      const targetY = (windowHeight / 2) - wrapperRect.top;
      let drawLength = 0;
      
      if (targetY <= 0) {
          drawLength = 0;
      } else if (this.lengthMap.length > 0) {
          let lastMapPoint = this.lengthMap[this.lengthMap.length - 1];
          if (targetY >= lastMapPoint.y) {
              drawLength = this.pathLength;
          } else {
              for (let i = 0; i < this.lengthMap.length - 1; i++) {
                  if (targetY >= this.lengthMap[i].y && targetY <= this.lengthMap[i+1].y) {
                      const t = (targetY - this.lengthMap[i].y) / (this.lengthMap[i+1].y - this.lengthMap[i].y);
                      drawLength = this.lengthMap[i].l + t * (this.lengthMap[i+1].l - this.lengthMap[i].l);
                      break;
                  }
              }
          }
      }

      pathProgressEl.style.strokeDashoffset = this.pathLength - drawLength;

      const nodes = this.milestoneNodes.toArray().map(ref => ref.nativeElement);
      nodes.forEach((node) => {
          const nodeRect = node.getBoundingClientRect();
          const nodeCenterY = nodeRect.top + (nodeRect.height / 2);
          if (nodeCenterY < windowHeight / 2) {
              node.classList.add('active');
          } else {
              node.classList.remove('active');
          }
      });
  }

  private observeCards() {
      this.milestoneCards.forEach(card => this.cardObserver.observe(card.nativeElement));
  }

  // --- ACCIONES DEL USUARIO (TARJETAS EXPANDIBLES) ---
  expandMilestone(milestone: TimelineEvent, cardElement: HTMLElement) {
      if (milestone.expanded) return;

      // Cerrar las demás
      this.milestones.forEach(m => m.expanded = false);
      
      // Expandir actual
      milestone.expanded = true;

      // Scroll suave hacia la tarjeta para asegurar visibilidad en la caja del Scroll de Ionic
      setTimeout(() => {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
  }

  closeMilestone(milestone: TimelineEvent, event: Event) {
      event.stopPropagation(); // Evitar que el clic se propague al div de "expandMilestone"
      milestone.expanded = false;
  }
}
