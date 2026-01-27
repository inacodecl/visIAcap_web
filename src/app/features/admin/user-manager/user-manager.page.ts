import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonList, IonBadge, IonModal, IonFab, IonFabButton, IonToggle,
    IonSpinner, IonItemGroup, IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, close, person } from 'ionicons/icons';
import { UserService } from '../../../core/services/user.service';
import { Usuario, UsuarioRol } from '../../../core/models/usuario.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-user-manager',
    templateUrl: './user-manager.page.html',
    styleUrls: ['./user-manager.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
        IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent,
        IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
        IonList, IonBadge, IonModal, IonFab, IonFabButton, IonToggle,
        IonSpinner, IonItemGroup, IonMenuButton
    ]
})
export class UserManagerPage implements OnInit {
    private userService = inject(UserService);
    private fb = inject(FormBuilder);

    users: Usuario[] = []; // Asumimos array simple por ahora
    isLoading = false;
    isModalOpen = false;

    userForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rol: ['editor', [Validators.required]]
    });

    constructor() {
        addIcons({ add, create, trash, close, person });
    }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.isLoading = true;
        this.userService.getUsuarios().subscribe({
            next: (response: any) => {
                console.log('DEBUG: Usuarios RAW response:', response);
                // Adaptar según respuesta. Si es array direct:
                this.users = Array.isArray(response) ? response : response.data || [];
                console.log('DEBUG: Usuarios procesados:', this.users);
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

    toggleUserStatus(user: Usuario, event: any) {
        const isActive = event.detail.checked;

        // Convert boolean to 1/0 for MySQL if needed, or backend handles it.
        // Tipado dice is_active: boolean
        if (user.is_active === isActive) return;

        this.userService.updateUsuario(user.id, { is_active: isActive }).subscribe({
            next: () => this.showToast(`Usuario ${isActive ? 'activado' : 'desactivado'}`),
            error: (err) => {
                console.error(err);
                event.target.checked = !isActive;
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
