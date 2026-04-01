import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, arrowForwardOutline, arrowDownOutline, arrowUpOutline, addOutline } from 'ionicons/icons';
import { EventoEsteMes } from '../../futuro.models';

@Component({
  selector: 'app-este-mes-futuro',
  templateUrl: './este-mes-futuro.component.html',
  styleUrls: ['./este-mes-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslateModule]
})
export class EsteMesFuturoComponent {
  @Input() esteMes: EventoEsteMes[] = [];
  @Input() currentMonthName: string = '';

  visibleEventsCount: number = 3;
  isExpanded: boolean = false;

  /** Cada carácter del mes para el display vertical */
  get monthChars(): string[] {
    return this.currentMonthName ? this.currentMonthName.toUpperCase().split('') : [];
  }

  constructor() {
    addIcons({ calendarOutline, arrowForwardOutline, arrowDownOutline, arrowUpOutline, addOutline });
  }

  toggleEvents(): void {
    if (this.isExpanded) {
      this.visibleEventsCount = 3;
      this.isExpanded = false;
    } else {
      this.visibleEventsCount = this.esteMes.length;
      this.isExpanded = true;
    }
  }
}
