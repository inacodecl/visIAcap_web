import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardCircle, openOutline, timeOutline } from 'ionicons/icons';
import { ExternalTabService } from '../../../core/services/external-tab.service';

/**
 * ============================================================
 * ExternalLinkButtonComponent
 * ============================================================
 * Botón reutilizable para abrir URLs externas en nueva pestaña.
 * Muestra un contador visual durante el cooldown de 15 segundos.
 *
 * Uso:
 *   <app-external-link-button
 *     [url]="proyecto()?.url_externa!"
 *     label="Visitar Sitio Web Oficial"
 *     icon="arrow-forward-circle">
 *   </app-external-link-button>
 * ============================================================
 */
@Component({
  selector: 'app-external-link-button',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
  templateUrl: './external-link-button.component.html',
  styleUrls: ['./external-link-button.component.scss']
})
export class ExternalLinkButtonComponent implements OnInit, OnDestroy {

  /** URL externa a abrir cuando se presione el botón. */
  @Input({ required: true }) url!: string;

  /** Texto visible en el botón. */
  @Input() label: string = 'Visitar Sitio Web Oficial';

  /** Nombre del ícono de Ionicons a mostrar (opcional). */
  @Input() icon: string = 'arrow-forward-circle';

  private externalTabService = inject(ExternalTabService);

  // Señales reactivas para el estado del cooldown
  remainingMs = signal(0);
  isOnCooldown = computed(() => this.remainingMs() > 0);

  /** Segundos restantes redondeados hacia arriba, para mostrar en el botón. */
  remainingSeconds = computed(() => Math.ceil(this.remainingMs() / 1000));

  /** Progreso de la barra de cooldown (0–100), donde 100 = lleno = inicio del cooldown. */
  cooldownProgress = computed(() => {
    const totalMs = this.externalTabService.getCooldownMs();
    return Math.min(100, (this.remainingMs() / totalMs) * 100);
  });

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    addIcons({ arrowForwardCircle, openOutline, timeOutline });
  }

  ngOnInit(): void {
    // Si por alguna razón la URL ya está en cooldown al montar el componente
    const remaining = this.externalTabService.getRemainingCooldown(this.url);
    if (remaining > 0) {
      this.startCountdown(remaining);
    }
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  /** Maneja el clic del usuario en el botón. */
  handleClick(): void {
    const result = this.externalTabService.openTab(this.url);

    if (!result.opened && result.remainingMs > 0) {
      // Está en cooldown: iniciar/actualizar el contador visual
      this.startCountdown(result.remainingMs);
    }
    // Si opened === true, no hacemos nada extra (la pestaña ya se abrió/enfocó)
  }

  /** Inicia el intervalo que actualiza el contador regresivo cada 100ms. */
  private startCountdown(initialMs: number): void {
    this.clearInterval();
    this.remainingMs.set(initialMs);

    this.intervalId = setInterval(() => {
      const remaining = this.externalTabService.getRemainingCooldown(this.url);
      this.remainingMs.set(remaining);

      if (remaining <= 0) {
        this.clearInterval();
      }
    }, 100);
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
