import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { newspaperOutline, arrowForwardOutline } from 'ionicons/icons';
import { Noticia } from '../../futuro.models';

@Component({
  selector: 'app-noticias-futuro',
  templateUrl: './noticias-futuro.component.html',
  styleUrls: ['./noticias-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslateModule]
})
export class NoticiasFuturoComponent {
  @Input() noticias: Noticia[] = [];

  constructor() {
    addIcons({ newspaperOutline, arrowForwardOutline });
  }
}
