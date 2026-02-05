import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonModal, IonToggle, IonSpinner, IonSearchbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, close, person, people, personAdd, arrowForward, mail, lockClosed, shield, rocket } from 'ionicons/icons';
import { UserService } from '../../../core/services/user.service';
import { Usuario } from '../../../core/models/usuario.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-user-manager',
    templateUrl: './user-manager.page.html',
    styleUrls: ['./user-manager.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
        IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
        IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
        IonModal, IonToggle, IonSpinner, IonSearchbar
    ]
})
export class UserManagerPage implements OnInit {
    private userService = inject(UserService);
    private fb = inject(FormBuilder);

    users = signal<Usuario[]>([]);
    isLoading = false;
    isModalOpen = false;
    searchTerm = signal('');

    // Computed property para filtrar usuarios
    filteredUsers = computed(() => {
        const term = this.searchTerm().toLowerCase();
        return this.users().filter(user => {
            const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
            return fullName.includes(term) || user.email.toLowerCase().includes(term);
        });
    });

    userForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rol: ['editor', [Validators.required]]
    });

    constructor() {
        addIcons({ people, personAdd, arrowForward, person, trash, close, mail, lockClosed, shield, rocket, add, create });
    }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.isLoading = true;
        this.userService.getUsuarios().subscribe({
            next: (response: any) => {
                const data = Array.isArray(response) ? response : response.data || [];
                this.users.set(data);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('DEBUG: Error users:', err);
                this.isLoading = false;
                this.showToast('Error cargando usuarios', 'danger');
            }
        });
    }

    openCreateModal() {
        this.userForm.reset({ rol: 'editor' });
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    async createUser() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.userService.createUsuario(this.userForm.value).subscribe({
            next: () => {
                this.isLoading = false;
                this.closeModal();
                this.showToast('Usuario creado correctamente');
                this.loadUsers();
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
                this.showToast('Error creando usuario. Revisa que el email no exista.', 'danger');
            }
        });
    }

    deleteUser(id: number | undefined) {
        if (!id) return;
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            this.userService.deleteUsuario(id).subscribe({
                next: () => {
                    this.showToast('Usuario eliminado correctamente');
                    this.loadUsers();
                },
                error: (err) => {
                    console.error(err);
                    this.showToast('Error eliminando usuario', 'danger');
                }
            })
        }
    }

    toggleUserStatus(user: Usuario, event: any) {
        const isActive = event.detail.checked;
        if (user.is_active === isActive) return; // Evitar llamadas innecesarias

        this.userService.updateUsuario(user.id, { is_active: isActive }).subscribe({
            next: () => {
                this.showToast(`Usuario ${isActive ? 'activado' : 'desactivado'}`);
                // Actualizar localmente para reflejar cambio inmediato en UI si fuera necesario
                // Pero como llamamos al backend, mejor recargar o actualizar el signal específico
                this.users.update(currentUsers =>
                    currentUsers.map(u => u.id === user.id ? { ...u, is_active: isActive } : u)
                );
            },
            error: (err) => {
                console.error(err);
                event.target.checked = !isActive; // Revertir toggle visual
                this.showToast('Error cambiando estado', 'danger');
            }
        });
    }

    private async showToast(message: string, color: string = 'success') {
        const toast = document.createElement('ion-toast');
        toast.message = message;
        toast.duration = 2000;
        toast.color = color;
        toast.position = 'bottom';
        document.body.appendChild(toast);
        await toast.present();
    }
}
