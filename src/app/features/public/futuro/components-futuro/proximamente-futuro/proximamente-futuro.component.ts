import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarNumberOutline, rocketOutline, arrowForwardOutline, arrowBackOutline, mapOutline } from 'ionicons/icons';
import { EventoProximamente } from '../../futuro.models';

@Component({
  selector: 'app-proximamente-futuro',
  templateUrl: './proximamente-futuro.component.html',
  styleUrls: ['./proximamente-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslateModule]
})
export class ProximamenteFuturoComponent {
  @Input() proximamente: EventoProximamente[] = [];
  @ViewChild('proximamenteCarousel') proximamenteCarouselRef!: ElementRef<HTMLElement>;

  constructor() {
    addIcons({ calendarNumberOutline, rocketOutline, arrowForwardOutline, arrowBackOutline, mapOutline });
  }

  scrollProximamente(direction: 'prev' | 'next') {
    const el = this.proximamenteCarouselRef?.nativeElement;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
    });
  }
}
