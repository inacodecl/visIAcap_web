import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
    IonCardTitle, IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
    IonList, IonListHeader, IonBadge, IonModal, IonFab, IonFabButton,
    IonSearchbar, IonNote,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, close, checkmarkCircle, search, eye, hourglass, save } from 'ionicons/icons';
import { TimelineService } from '../../../core/services/timeline.service';
import { Historia } from '../../../core/models/historia.model';

@Component({
    selector: 'app-history-manager',
    templateUrl: './history-manager.page.html',
    styleUrls: ['./history-manager.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
        IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
        IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
        IonBadge, IonModal, IonFab, IonFabButton,
        IonSearchbar, IonNote,
    ]
})
export class HistoryManagerPage implements OnInit {
    private timelineService = inject(TimelineService);
    private fb = inject(FormBuilder);

    // Signals
    historias = this.timelineService.historias;
    searchTerm = signal('');

    // Computed para filtrado local
    filteredHistorias = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const all = this.historias();
        if (!term) return all;

        return all.filter(h =>
            h.titulo?.toLowerCase().includes(term) ||
            h.anio?.toString().includes(term)
        );
    });

    // Estado del formulario
    isModalOpen = false;
    isEditing = false;
    currentEditingId: number | null = null;
    isLoading = false;

    historyForm: FormGroup = this.fb.group({
        anio: [''], // Se llenará automáticamente
        fecha: ['', [Validators.required]],
        titulo: ['', [Validators.required, Validators.maxLength(150)]],
        descripcion: ['', [Validators.required]],
        visible: [true]
    });

    constructor() {
        addIcons({ add, create, trash, close, checkmarkCircle, search, eye, hourglass, save });
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true; // Show loading indicator if available
        // 'es' locale, true para incluir ocultos (si backend lo soporta)
        this.timelineService.getHistorias('es', true).subscribe({
            next: (data) => {
                console.log('DEBUG: Historias cargadas:', data);
                if (data.length === 0) console.warn('DEBUG: Array de historias vacío');
                this.isLoading = false;
            },
            error: (err) => {
                console.error('DEBUG: Error loading history with hidden items:', err);
                this.isLoading = false;
                // Fallback: si falla con includeHidden=true (por error 500 del backend), 
                // intentar carga normal (aunque no mostrará ocultos, al menos mostrará algo)
                console.warn('DEBUG: Falling back to normal load...');
                this.timelineService.getHistorias('es', false).subscribe(
                    (dataFallback) => console.log('DEBUG: Fallback data:', dataFallback),
                    (errFallback) => console.error('DEBUG: Fallback failed:', errFallback)
                );
            }
        });
    }

    openCreateModal() {
        this.isEditing = false;
        this.currentEditingId = null;
        // Fecha por defecto hoy
        const today = new Date().toISOString().split('T')[0];
        this.historyForm.reset({ visible: true, fecha: today });
        this.isModalOpen = true;
    }

    openEditModal(historia: Historia) {
        this.isEditing = true;
        this.currentEditingId = historia.id;

        let fechaFormatted = '';
        if (historia.fecha) {
            // Asegurar formato YYYY-MM-DD para el input date
            // Si viene como string '2026-01-27T...' o objeto Date
            const d = new Date(historia.fecha);
            if (!isNaN(d.getTime())) {
                fechaFormatted = d.toISOString().split('T')[0];
            }
        }

        this.historyForm.patchValue({
            anio: historia.anio,
            fecha: fechaFormatted,
            titulo: historia.titulo,
            descripcion: historia.descripcion,
            visible: historia.visible
        });
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    async saveHistoria() {
        if (this.historyForm.invalid) {
            this.historyForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const formValue = { ...this.historyForm.value };

        // Derivar año automáticamente de la fecha seleccionada
        if (formValue.fecha) {
            const dateObj = new Date(formValue.fecha); // YYYY-MM-DD
            if (!isNaN(dateObj.getTime())) {
                formValue.anio = dateObj.getFullYear();
            }
        }

        if (this.isEditing && this.currentEditingId) {
            // Usar PUT para reemplazo total al editar desde formulario
            this.timelineService.updateHistoria(this.currentEditingId, formValue).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.closeModal();
                    this.showToast('Hito actualizado correctamente');
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                    this.showToast('Error al actualizar hito', 'danger');
                }
            });
        } else {
            // Create (POST)
            this.timelineService.createHistoria(formValue).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.closeModal();
                    this.showToast('Hito creado correctamente');
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                    this.showToast('Error al crear hito', 'danger');
                }
            });
        }
    }

    // Nuevo método para Toggle rápido usando PATCH
    async toggleVisibility(historia: Historia, event: any) {
        const newStatus = event.detail.checked;

        // Evitar loop infinito si el cambio viene del modelo
        if (historia.visible === newStatus) return;

        this.timelineService.updatePartialHistoria(historia.id, { visible: newStatus }).subscribe({
            next: () => {
                this.showToast(`Hito ${newStatus ? 'visible' : 'oculto'}`);
            },
            error: (err) => {
                console.error(err);
                // Revertir cambio visual si falla (opcional, requeriría referencia al toggle)
                this.showToast('Error al cambiar visibilidad', 'danger');
                event.target.checked = !newStatus; // Revertir UI
            }
        });
    }

    deleteHistoria(id: number) {
        if (!confirm('¿Estás seguro de eliminar este hito?')) return;

        this.timelineService.deleteHistoria(id).subscribe({
            next: () => this.showToast('Hito eliminado'),
            error: err => {
                console.error(err);
                this.showToast('Error al eliminar', 'danger');
            }
        });
    }

    // Helper Toast
    private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
        const toast = document.createElement('ion-toast');
        toast.message = message;
        toast.duration = 2000;
        toast.color = color;
        toast.position = 'bottom';
        document.body.appendChild(toast);
        await toast.present();
    }
}
