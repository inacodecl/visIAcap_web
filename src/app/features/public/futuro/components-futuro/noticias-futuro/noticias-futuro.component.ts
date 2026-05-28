import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { newspaperOutline, arrowForwardOutline, arrowBackOutline, closeOutline, calendarOutline, pricetagOutline } from 'ionicons/icons';
import { Noticia } from '../../futuro.models';
import { register } from 'swiper/element/bundle';
import { LanguageService } from 'src/app/core/services/language.service';

register();

@Component({
  selector: 'app-noticias-futuro',
  templateUrl: './noticias-futuro.component.html',
  styleUrls: ['./noticias-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonIcon, IonModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NoticiasFuturoComponent {
  @Input() noticias: Noticia[] = [];

  isModalOpen = false;
  selectedNoticia: Noticia | null = null;
  displayDate: string = '';
  private closeTimeoutId: any;
  private languageService = inject(LanguageService);

  constructor() {
    addIcons({ newspaperOutline, arrowForwardOutline, arrowBackOutline, closeOutline, calendarOutline, pricetagOutline });
  }

  openModal(noticia: Noticia) {
    if (this.closeTimeoutId) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }
    this.selectedNoticia = noticia;
    this.displayDate = this.extractDateFallback(noticia);
    this.isModalOpen = true;
  }

  private extractDateFallback(noticia: Noticia): string {
    if (noticia.fecha && noticia.fecha.trim() !== '') {
      return noticia.fecha;
    }
    
    // Si no hay fecha, intentar con el campo 'mes' si existe
    if (noticia.mes && noticia.mes.trim() !== '') {
      return noticia.mes;
    }

    // Como último recurso, extraer el mes de 'created_at'
    if (noticia.created_at) {
      const date = new Date(noticia.created_at);
      if (!isNaN(date.getTime())) {
        const lang = this.languageService.getCurrentLang();
        const monthName = date.toLocaleString(lang, { month: 'long' });
        return monthName.charAt(0).toUpperCase() + monthName.slice(1);
      }
    }
    
    return '';
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeTimeoutId = setTimeout(() => {
      this.selectedNoticia = null;
    }, 300); // Esperar que termine la animación
  }
}
