import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { bulbOutline, arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';
import { ProyectoFuturo } from '../../futuro.models';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-proyectos-futuro',
  templateUrl: './proyectos-futuro.component.html',
  styleUrls: ['./proyectos-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProyectosFuturoComponent {
  @Input() proyectos: ProyectoFuturo[] = [];

  constructor() {
    addIcons({ bulbOutline, arrowBackOutline, arrowForwardOutline });
  }
}
