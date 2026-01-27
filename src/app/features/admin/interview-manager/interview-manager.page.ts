import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonIcon, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
    IonList, IonBadge, IonModal, IonFab, IonFabButton,
    IonSearchbar, IonMenuButton, IonNote, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, close, checkmarkCircle, search, videocam, save } from 'ionicons/icons';
import { EntrevistaService } from '../../../core/services/entrevista.service';
import { Entrevista } from '../../../core/models/entrevista.model';

@Component({
    selector: 'app-interview-manager',
    templateUrl: './interview-manager.page.html',
    styleUrls: ['./interview-manager.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
        IonIcon,
        IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
        IonList, IonModal, IonFab, IonFabButton,
        IonSearchbar, IonMenuButton, IonNote, IonSpinner
    ]
})
export class InterviewManagerPage implements OnInit {
    private entrevistaService = inject(EntrevistaService);
    private fb = inject(FormBuilder);

    // Signals
    entrevistas = this.entrevistaService.entrevistas;
    searchTerm = signal('');

    // Filtered
    filteredEntrevistas = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const all = this.entrevistas();
        if (!term) return all;

        return all.filter(e =>
            e.titulo?.toLowerCase().includes(term) ||
            e.entrevistado?.toLowerCase().includes(term)
        );
    });

    // Validations
    isModalOpen = false;
    isEditing = false;
    currentEditingId: number | null = null;
    isLoading = false;

    // Form
    interviewForm: FormGroup = this.fb.group({
        titulo: ['', [Validators.required, Validators.maxLength(150)]],
        entrevistado: ['', [Validators.required, Validators.maxLength(100)]],
        descripcion: ['', [Validators.required]],
        video_url: ['', [Validators.required, Validators.pattern(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)]],
        visible: [true]
    });

    constructor() {
        addIcons({ add, create, trash, close, checkmarkCircle, search, videocam, save });
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        this.entrevistaService.getEntrevistas(true).subscribe({
            next: () => this.isLoading = false,
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    openCreateModal() {
        this.isEditing = false;
        this.currentEditingId = null;
        this.interviewForm.reset({ visible: true });
        this.isModalOpen = true;
    }

    openEditModal(entrevista: Entrevista) {
        this.isEditing = true;
        this.currentEditingId = entrevista.id;
        this.interviewForm.patchValue({
            titulo: entrevista.titulo,
            entrevistado: entrevista.entrevistado,
            descripcion: entrevista.descripcion,
            video_url: entrevista.video_url,
            visible: entrevista.visible
        });
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    saveEntrevista() {
        if (this.interviewForm.invalid) {
            this.interviewForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const formValue = this.interviewForm.value;

        if (this.isEditing && this.currentEditingId) {
            this.entrevistaService.updateEntrevista(this.currentEditingId, formValue).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.closeModal();
                    this.showToast('Entrevista actualizada');
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                    this.showToast('Error al actualizar', 'danger');
                }
            });
        } else {
            this.entrevistaService.createEntrevista(formValue).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.closeModal();
                    this.showToast('Entrevista creada');
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                    this.showToast('Error al crear', 'danger');
                }
            });
        }
    }

    deleteEntrevista(id: number) {
        if (!confirm('¿Eliminar esta entrevista?')) return;

        this.entrevistaService.deleteEntrevista(id).subscribe({
            next: () => this.showToast('Entrevista eliminada'),
            error: err => {
                console.error(err);
                this.showToast('Error al eliminar', 'danger');
            }
        });
    }

    private async showToast(message: string, color: 'success' | 'danger' = 'success') {
        const toast = document.createElement('ion-toast');
        toast.message = message;
        toast.duration = 2000;
        toast.color = color;
        toast.position = 'bottom';
        document.body.appendChild(toast);
        await toast.present();
    }
}
