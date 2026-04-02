import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { bulbOutline, arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import { ProyectoFuturo } from '../../futuro.models';

@Component({
  selector: 'app-proyectos-futuro',
  templateUrl: './proyectos-futuro.component.html',
  styleUrls: ['./proyectos-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslateModule]
})
export class ProyectosFuturoComponent {
  @Input() proyectos: ProyectoFuturo[] = [];
  @ViewChild('proyectosCarousel') proyectosCarouselRef!: ElementRef<HTMLElement>;
  activeSlideIndex = 0;

  constructor() {
    addIcons({ bulbOutline, arrowBackOutline, arrowForwardOutline });
  }

  onCarouselScroll() {
    const el = this.proyectosCarouselRef?.nativeElement;
    if (!el) return;
    
    // En Proyectos, las tarjetas tienen min-width: 450px + gap: 40px = 490px aprox.
    const cardWidth = 450 + 40; 
    const index = Math.round(el.scrollLeft / cardWidth);
    if (this.activeSlideIndex !== index) {
      this.activeSlideIndex = index;
    }
  }

  scrollProyectos(direction: 'prev' | 'next') {
    const el = this.proyectosCarouselRef?.nativeElement;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
    });
  }
}
