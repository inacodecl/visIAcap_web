import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

/**
 * Componente modal de alta fidelidad para mostrar el código QR de InacapSmart.
 * Diseñado con estética premium y optimizado para Tótems y dispositivos móviles.
 */
@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class QrModalComponent {
  private modalCtrl = inject(ModalController);

  constructor() {
    // Añadimos el icono de cierre
    addIcons({ closeOutline });
  }

  /**
   * Cierra el modal de forma fluida.
   */
  close() {
    this.modalCtrl.dismiss();
  }
}
