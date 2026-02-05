import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

/**
 * RedCardComponent - Tarjeta modal con efecto blob animado
 * 
 * Una tarjeta glassmorphism con un blob rojo animado
 * que muestra información detallada de un hito.
 * 
 * @usage
 * <app-red-card 
 *   [titulo]="milestone.titulo"
 *   [descripcion]="milestone.descripcion"
 *   [anio]="milestone.anio"
 *   [isClosing]="isModalClosing"
 *   (onClose)="closeModal()">
 * </app-red-card>
 */
@Component({
  selector: 'app-red-card',
  templateUrl: './red-card.component.component.html',
  styleUrls: ['./red-card.component.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class RedCardComponent {
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() anio: number = 0;
  @Input() media: { url: string, tipo: string, alt?: string }[] = [];
  @Input() tags: { id: number, nombre: string, slug: string }[] = [];
  @Input() isClosing: boolean = false;

  @Output() onClose = new EventEmitter<void>();

  constructor() {
    addIcons({ closeOutline });
  }

  close() {
    this.onClose.emit();
  }
}
