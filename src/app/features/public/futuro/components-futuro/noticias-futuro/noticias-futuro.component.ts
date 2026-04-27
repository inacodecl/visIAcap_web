import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { newspaperOutline, arrowForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { Noticia } from '../../futuro.models';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-noticias-futuro',
  templateUrl: './noticias-futuro.component.html',
  styleUrls: ['./noticias-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NoticiasFuturoComponent {
  @Input() noticias: Noticia[] = [];

  constructor() {
    addIcons({ newspaperOutline, arrowForwardOutline, arrowBackOutline });
  }
}
