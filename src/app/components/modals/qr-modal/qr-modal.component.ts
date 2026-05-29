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

  // Estado para el modo presentación secreto
  isPresentationMode = false;
  private clickCount = 0;
  private clickTimeout: any;

  constructor() {
    // Añadimos el icono de cierre
    addIcons({ closeOutline });
  }

  /**
   * Maneja el clic en el QR. Al hacer 3 clics rápidos en desktop,
   * se activa el modo presentación que amplía el QR y cambia la distribución.
   */
  onQrClick() {
    // Solo activable en pantallas desktop (ancho >= 1024px) y con orientación horizontal (landscape)
    // Esto evita que se active en tótems verticales (e.g. 1080x1920) o tablets verticales
    if (window.innerWidth < 1024 || window.innerWidth <= window.innerHeight) {
      return;
    }

    clearTimeout(this.clickTimeout);
    this.clickCount++;

    if (this.clickCount === 3) {
      this.isPresentationMode = !this.isPresentationMode;
      this.clickCount = 0;
    } else {
      this.clickTimeout = setTimeout(() => {
        this.clickCount = 0;
      }, 2000); // Resetea el contador si pasan más de 2 segundos sin clics
    }
  }

  /**
   * Cierra el modal de forma fluida.
   */
  close() {
    this.modalCtrl.dismiss();
  }
}
