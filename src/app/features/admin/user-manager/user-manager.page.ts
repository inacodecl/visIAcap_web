import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    IonContent, IonHeader, IonButtons, IonBackButton, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonItem, IonInput, IonSelect, IonSelectOption,
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
        IonContent, IonHeader, IonButtons, IonBackButton, IonButton,
        IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
        IonItem, IonInput, IonSelect, IonSelectOption,
        IonModal, IonToggle, IonSpinner, IonSearchbar
    ]
})
export class UserManagerPage implements OnInit {
    private userService = inject(UserService);
    private authService = inject(AuthService); // Inject Auth Service
    private fb = inject(FormBuilder);

    users = signal<Usuario[]>([]);
    isLoading = false;
    isModalOpen = false;
    searchTerm = signal('');

    // Estado para edición
    editingUserId: number | null = null;
    isEditMode = false;

    // Computed property para filtrar usuarios
    filteredUsers = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const currentUserId = this.authService.currentUser()?.id;

        return this.users()
            .filter(user => user.id !== currentUserId) // Filtro anti-suicidio (No mostrarse a sí mismo)
            .filter(user => {
                const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
                return fullName.includes(term) || user.email.toLowerCase().includes(term);
            });
    });

    userForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [''], // Password opcional en edición
        rol: ['', [Validators.required]] // Rol obligatorio, sin default
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

    // --- MODAL & FORM HANDLING ---

    openCreateModal() {
        this.isEditMode = false;
        this.editingUserId = null;
        this.userForm.reset(); // Reset total, rol queda null/vacío
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]); // Password obligatoria al crear
        this.userForm.get('password')?.updateValueAndValidity();
        this.userForm.get('email')?.enable(); // Email editable al crear
        this.isModalOpen = true;
    }

    openEditModal(user: Usuario) {
        this.isEditMode = true;
        this.editingUserId = user.id;

        this.userForm.patchValue({
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            rol: user.rol,
            password: '' // Limpiar campo password
        });

        this.userForm.get('password')?.clearValidators(); // Password opcional al editar
        this.userForm.get('password')?.updateValueAndValidity();
        this.userForm.get('email')?.disable(); // No permitir cambiar email (identidad)

        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.userForm.reset();
    }

    async saveUser() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const formData = this.userForm.getRawValue(); // getRawValue para incluir campos deshabilitados (email)

        if (this.isEditMode && this.editingUserId) {
            // UDPATE
            // Filtrar password si está vacío para no enviarlo
            if (!formData.password) delete formData.password;

            this.userService.updateUsuario(this.editingUserId, formData).subscribe({
                next: () => {
                    this.finishSave('Usuario actualizado correctamente');
                },
                error: (err) => this.handleError(err, 'Error actualizando usuario')
            });
        } else {
            // CREATE
            this.userService.createUsuario(formData).subscribe({
                next: () => {
                    this.finishSave('Usuario creado correctamente');
                },
                error: (err) => this.handleError(err, 'Error creando usuario. Revisa que el email no exista.')
            });
        }
    }

    private finishSave(message: string) {
        this.isLoading = false;
        this.closeModal();
        this.showToast(message);
        this.loadUsers();
    }

    private handleError(err: any, defaultMsg: string) {
        console.error(err);
        this.isLoading = false;
        const msg = err.error?.error?.userMessage || err.error?.message || defaultMsg;
        this.showToast(msg, 'danger');
    }

    // --- ACTIONS ---

    deleteUser(id: number | undefined) {
        if (!id) return;
        if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
            this.userService.deleteUsuario(id).subscribe({
                next: (res: any) => {
                    this.showToast('Usuario eliminado correctamente');
                    this.loadUsers();
                },
                error: (err) => this.handleError(err, 'Error eliminando usuario')
            })
        }
    }

    toggleUserStatus(user: Usuario, event: any) {
        const isActive = event.detail.checked;
        if (user.is_active === isActive) return;

        this.userService.updateUsuario(user.id, { is_active: isActive }).subscribe({
            next: () => {
                this.showToast(`Usuario ${isActive ? 'activado' : 'desactivado'}`);
                this.users.update(currentUsers =>
                    currentUsers.map(u => u.id === user.id ? { ...u, is_active: isActive } : u)
                );
            },
            error: (err) => {
                event.target.checked = !isActive; // Revertir toggle
                this.handleError(err, 'Error cambiando estado');
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
