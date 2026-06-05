import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkCircleOutline, schoolOutline, businessOutline, personOutline, qrCodeOutline } from 'ionicons/icons';
import { FeedbackService } from '../../../core/services/feedback.service';

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
  private feedbackService = inject(FeedbackService);

  // Estados reactivos controlados por señales (Angular Signals)
  selectedRol = signal<string | null>(null);
  suggestionText = signal<string>('');
  isSubmitting = signal<boolean>(false);
  showSuccess = signal<boolean>(false);
  showQR = signal<boolean>(false);

  constructor() {
    // Registro de iconos visuales
    addIcons({ closeOutline, checkmarkCircleOutline, schoolOutline, businessOutline, personOutline, qrCodeOutline });
  }

  /**
   * Alterna la visualización del código QR de la encuesta.
   */
  toggleQR() {
    this.showQR.update(show => !show);
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
   * Envía el formulario al backend e inicia la animación de éxito al confirmar.
   */
  submitForm() {
    if (!this.isValidForm || this.isSubmitting()) {
      return;
    }

    const rol = this.selectedRol();
    const comentario = this.suggestionText();

    if (!rol) return;

    this.isSubmitting.set(true);

    this.feedbackService.sendFeedback(rol, comentario).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showSuccess.set(true);

        // Cierre automático del modal después de 2.2 segundos para que el usuario aprecie el estado de éxito
        setTimeout(() => {
          this.close();
        }, 2200);
      },
      error: (error) => {
        console.error('Error al enviar feedback:', error);
        this.isSubmitting.set(false);
        // Fallback en caso de error: reconfigurar envío
      }
    });
  }

  /**
   * Cierra el modal de forma fluida.
   */
  close() {
    this.modalCtrl.dismiss();
  }
}
