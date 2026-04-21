import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { newspaperOutline, arrowForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { Noticia } from '../../futuro.models';

@Component({
  selector: 'app-noticias-futuro',
  templateUrl: './noticias-futuro.component.html',
  styleUrls: ['./noticias-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonIcon]
})
export class NoticiasFuturoComponent {
  @Input() noticias: Noticia[] = [];
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  constructor() {
    addIcons({ newspaperOutline, arrowForwardOutline, arrowBackOutline });
  }

  scrollNews(direction: 'prev' | 'next') {
    const element = this.carousel.nativeElement;
    const scrollAmount = element.offsetWidth * 0.8;
    
    if (direction === 'prev') {
      element.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
