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

  constructor() {
    addIcons({ bulbOutline, arrowBackOutline, arrowForwardOutline });
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
