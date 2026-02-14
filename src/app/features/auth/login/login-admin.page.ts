import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonCard, IonCardContent,
    IonItem, IonLabel, IonInput,
    IonButton,
    IonText,
    IonIcon
  ],
})
export class LoginAdminPage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]] // MinLength básico
  });

  isLoading = false;
  errorMessage = '';

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/homev2']);
  }

  async onSubmit() {
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
