import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  shieldCheckmark,
  mailOutline,
  lockClosedOutline,
  lockClosed,
  eyeOutline,
  eyeOffOutline,
  alertCircleOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Interfaz para las partículas ambientales del fondo.
 * Cada partícula tiene posición, tamaño y parámetros de animación.
 */
interface Particle {
  x: number;      // Posición horizontal en porcentaje (0-100)
  y: number;      // Posición vertical en porcentaje (0-100)
  size: number;    // Tamaño en píxeles
  duration: number; // Duración de la animación en segundos
  delay: number;   // Retraso inicial en segundos
  opacity: number; // Opacidad base (0-1)
}

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonIcon
  ],
})
export class LoginAdminPage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  /** Partículas generadas proceduralmente para el fondo */
  particles: Particle[] = [];

  /** Número total de partículas a renderizar */
  private readonly PARTICLE_COUNT = 35;

  constructor() {
    addIcons({
      arrowBackOutline,
      shieldCheckmark,
      mailOutline,
      lockClosedOutline,
      lockClosed,
      eyeOutline,
      eyeOffOutline,
      alertCircleOutline,
      arrowForwardOutline
    });
  }

  ngOnInit(): void {
    this.generateParticles();
  }

  /**
   * Genera partículas con posiciones y parámetros aleatorios.
   * Cada partícula tiene un tamaño entre 2-5px y una animación
   * con duración variable para crear un efecto orgánico.
   */
  private generateParticles(): void {
    this.particles = Array.from({ length: this.PARTICLE_COUNT }, () => ({
      x: Math.random() * 100,
      y: 100 + Math.random() * 20, // Inician ligeramente fuera de pantalla abajo
      size: 2 + Math.random() * 3,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
      opacity: 0.2 + Math.random() * 0.5
    }));
  }

  /** Alterna la visibilidad del campo de contraseña */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /** Navega de vuelta al inicio */
  goBack(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Procesa el envío del formulario de login.
   * Valida credenciales vía AuthService y redirige al Dashboard si es exitoso.
   */
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          // Redirección directa al Dashboard para todos los administradores
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = 'Credenciales inválidas. Por favor intenta nuevamente.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Credenciales inválidas o acceso denegado.';
        } else {
          this.errorMessage = 'Error de conexión. Intenta más tarde.';
        }
        console.error(err);
      }
    });
  }
}
