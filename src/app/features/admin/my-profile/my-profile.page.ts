import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  cameraOutline,
  calendarOutline,
  createOutline,
  shieldCheckmarkOutline,
  keyOutline,
  warningOutline,
  trashOutline,
  checkmarkOutline,
  closeOutline,
  saveOutline
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';
import { environment } from '../../../../environments/environment';

/**
 * Vista "Mi Perfil" del panel administrativo.
 * Muestra datos reales del admin autenticado y permite editar campos de perfil.
 */
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner],
})
export class MyProfilePage implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);

  // Estado
  isLoading = signal(true);
  isEditing = signal(false);
  isSaving = signal(false);
  saveMessage = signal<string | null>(null);

  // Datos del perfil (cargados desde API)
  profile = signal<Usuario | null>(null);

  // Formulario de edición (copia temporal)
  editForm = {
    nombre: '',
    apellido: '',
    telefono: ''
  };

  constructor() {
    addIcons({
      personOutline, cameraOutline, calendarOutline, createOutline,
      shieldCheckmarkOutline, keyOutline, warningOutline, trashOutline,
      checkmarkOutline, closeOutline, saveOutline
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  /**
   * Carga el perfil real desde GET /api/usuarios/me
   */
  loadProfile(): void {
    this.isLoading.set(true);
    this.http.get<Usuario>(`${environment.apiUrl}/usuarios/me`).subscribe({
      next: (user) => {
        this.profile.set(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        // Fallback: usar datos del AuthService si la API falla
        const fallback = this.authService.currentUser();
        if (fallback) {
          this.profile.set(fallback);
        }
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Obtiene las iniciales del usuario para el avatar
   */
  getInitials(): string {
    const p = this.profile();
    if (!p) return 'A';
    const first = (p.nombre || '').charAt(0).toUpperCase();
    const last = (p.apellido || '').charAt(0).toUpperCase();
    return first + last;
  }

  /**
   * Formatea el rol del usuario para mostrarlo legible
   */
  getRolLabel(): string {
    const p = this.profile();
    if (!p) return 'Administrador';
    switch (p.rol) {
      case 'super_admin': return 'Super Administrador';
      case 'admin': return 'Administrador de Contenido';
      default: return 'Administrador';
    }
  }

  /**
   * Formatea la fecha de creación como "Miembro desde Mes Año"
   */
  getMemberSince(): string {
    const p = this.profile();
    if (!p?.created_at) return 'Fecha no disponible';
    const date = new Date(p.created_at);
    const month = date.toLocaleString('es-CL', { month: 'long' });
    const year = date.getFullYear();
    return `Miembro desde ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  }

  /**
   * Formatea el último login
   */
  getLastLogin(): string {
    const p = this.profile();
    if (!p?.last_login_at) return 'No registrado';
    const date = new Date(p.last_login_at);
    return date.toLocaleString('es-CL', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  /**
   * Activa el modo edición cargando los datos actuales en el formulario
   */
  startEditing(): void {
    const p = this.profile();
    if (!p) return;
    this.editForm = {
      nombre: p.nombre || '',
      apellido: p.apellido || '',
      telefono: p.telefono || ''
    };
    this.isEditing.set(true);
    this.saveMessage.set(null);
  }

  /**
   * Cancela la edición sin guardar
   */
  cancelEditing(): void {
    this.isEditing.set(false);
    this.saveMessage.set(null);
  }

  /**
   * Guarda los cambios del perfil via PUT /api/usuarios/me
   */
  saveProfile(): void {
    if (this.isSaving()) return;

    // Validación mínima
    if (!this.editForm.nombre.trim() || !this.editForm.apellido.trim()) {
      this.saveMessage.set('Nombre y apellido son obligatorios');
      return;
    }

    this.isSaving.set(true);
    this.saveMessage.set(null);

    const payload = {
      nombre: this.editForm.nombre.trim(),
      apellido: this.editForm.apellido.trim(),
      telefono: this.editForm.telefono.trim() || null
    };

    this.http.put<{ message: string; user: Usuario }>(`${environment.apiUrl}/usuarios/me`, payload).subscribe({
      next: (response) => {
        // Actualizar estado local
        this.profile.set(response.user);
        // Actualizar AuthService para reflejar cambios en toda la app (ej: nombre en header)
        this.authService.updateCurrentUser(response.user);
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.saveMessage.set('Perfil actualizado correctamente');

        // Limpiar mensaje después de 3s
        setTimeout(() => this.saveMessage.set(null), 3000);
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        this.isSaving.set(false);
        this.saveMessage.set('Error al guardar los cambios');
      }
    });
  }
}
