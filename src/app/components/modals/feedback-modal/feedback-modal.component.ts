import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkCircleOutline, schoolOutline, businessOutline, personOutline } from 'ionicons/icons';

/**
 * Componente de modal interactivo y premium para recoger sugerencias
 * de la comunidad Inacap Smart.
 */
@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonSpinner, TranslateModule]
})
export class FeedbackModalComponent {
  private modalCtrl = inject(ModalController);

  // Estados reactivos controlados por señales (Angular Signals)
  selectedRol = signal<string | null>(null);
  suggestionText = signal<string>('');
  isSubmitting = signal<boolean>(false);
  showSuccess = signal<boolean>(false);

  constructor() {
    // Registro de iconos visuales
    addIcons({ closeOutline, checkmarkCircleOutline, schoolOutline, businessOutline, personOutline });
  }

  /**
   * Setea el rol seleccionado por el usuario.
   */
  selectRol(rol: string) {
    this.selectedRol.set(rol);
  }

  /**
   * Valida si el formulario es apto para ser enviado.
   */
  get isValidForm(): boolean {
    return this.selectedRol() !== null && this.suggestionText().trim().length >= 5;
  }

  /**
   * Simula el envío del formulario al backend y activa la animación de éxito.
   */
  submitForm() {
    if (!this.isValidForm || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    // Simulación de delay de red del servidor (1.5 segundos)
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.showSuccess.set(true);

      // Cierre automático del modal después de 2.2 segundos para que el usuario aprecie el estado de éxito
      setTimeout(() => {
        this.close();
      }, 2200);
    }, 1500);
  }

  /**
   * Cierra el modal de forma fluida.
   */
  close() {
    this.modalCtrl.dismiss();
  }
}
