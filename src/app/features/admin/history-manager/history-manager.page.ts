import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
    IonCardTitle, IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
    IonList, IonListHeader, IonBadge, IonModal,
    IonSearchbar, IonNote, IonSelect, IonSelectOption,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, ModalController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, close, checkmarkCircle, search, eye, hourglass, save, time, arrowForward, images, pricetags, link } from 'ionicons/icons';
import { TimelineService } from '../../../core/services/timeline.service';
import { MetadataService } from '../../../core/services/metadata.service';
import { Historia, HistoriaTag, HistoriaMedia } from '../../../core/models/historia.model';
import { MetadataManagerModalComponent } from '../project-manager/metadata-manager-modal/metadata-manager-modal.component';

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
        IonBadge, IonModal,
        IonSearchbar, IonNote, IonSelect, IonSelectOption
    ]
})
export class HistoryManagerPage implements OnInit {
    private timelineService = inject(TimelineService);
    private metadataService = inject(MetadataService);
    private fb = inject(FormBuilder);
    private modalCtrl = inject(ModalController);
    private toastCtrl = inject(ToastController);

    // Signals
    historias = this.timelineService.historias;
    tagsList = signal<any[]>([]); // Lista de tags disponibles
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
        visible: [true],
        media_url: [''], // Portada Legacy/Cover

        // Relaciones
        media: this.fb.array([]), // Array de Multimedia extra
        tags: [[]] // Array de IDs de tags
    });

    constructor() {
        addIcons({ time, arrowForward, create, trash, close, eye, add, checkmarkCircle, search, hourglass, save, images, pricetags, link });
    }

    ngOnInit() {
        this.loadData();
        this.loadTags();
    }

    loadData() {
        this.isLoading = true;
        this.timelineService.getHistorias('es', true).subscribe({
            next: (data) => {
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading history:', err);
                this.isLoading = false;
            }
        });
    }

    loadTags() {
        this.metadataService.getTags('es').subscribe(tags => {
            this.tagsList.set(tags);
        });
    }

    // --- FORM ARRAYS ---
    get mediaArray() { return this.historyForm.get('media') as FormArray; }

    addMediaItem() {
        this.mediaArray.push(this.fb.group({
            url: ['', Validators.required],
            tipo: ['image'], // Default image
            alt: ['']
        }));
    }

    removeMediaItem(index: number) {
        this.mediaArray.removeAt(index);
    }

    // --- MODALS ---

    async openTagsManager() {
        const modal = await this.modalCtrl.create({
            component: MetadataManagerModalComponent,
            componentProps: { type: 'tags' },
            cssClass: 'glass-modal'
        });
        await modal.present();
        await modal.onWillDismiss();
        this.loadTags(); // Recargar tags al cerrar el modal
    }

    openCreateModal() {
        this.isEditing = false;
        this.currentEditingId = null;
        this.mediaArray.clear();

        const today = new Date().toISOString().split('T')[0];
        this.historyForm.reset({ visible: true, fecha: today, media: [], tags: [] });

        this.addMediaItem(); // Añadir un item por defecto
        this.isModalOpen = true;
    }

    openEditModal(historia: Historia) {
        this.isEditing = true;
        this.currentEditingId = historia.id;
        this.mediaArray.clear();

        let fechaFormatted = '';
        if (historia.fecha) {
            const d = new Date(historia.fecha);
            if (!isNaN(d.getTime())) {
                fechaFormatted = d.toISOString().split('T')[0];
            }
        }

        // Parsear Media y Tags si vienen como string
        let mediaData: any[] = historia.media || [];
        if (typeof historia.media === 'string') {
            try { mediaData = JSON.parse(historia.media); } catch (e) { mediaData = []; }
        }

        let tagsData: any[] = historia.tags || [];
        if (typeof historia.tags === 'string') {
            try { tagsData = JSON.parse(historia.tags); } catch (e) { tagsData = []; }
        }

        // Poblar Media Array
        if (Array.isArray(mediaData) && mediaData.length > 0) {
            mediaData.forEach(m => {
                this.mediaArray.push(this.fb.group({
                    url: [m.url, Validators.required],
                    tipo: [m.tipo],
                    alt: [m.alt]
                }));
            });
        }

        // Poblar Tags (Extraer IDs)
        const tagIds = (Array.isArray(tagsData)) ? tagsData.map(t => t.id) : [];

        this.historyForm.patchValue({
            anio: historia.anio,
            fecha: fechaFormatted,
            titulo: historia.titulo,
            descripcion: historia.descripcion,
            visible: historia.visible,
            media_url: historia.media_url,
            tags: tagIds
        });

        // Si no hay media, agregar uno vacío por si quiere agregar
        if (this.mediaArray.length === 0) {
            this.addMediaItem();
        }

        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    // --- CRUD ---

    async saveHistoria() {
        if (this.historyForm.invalid) {
            this.historyForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const formValue = { ...this.historyForm.value };

        if (formValue.fecha) {
            const dateObj = new Date(formValue.fecha);
            if (!isNaN(dateObj.getTime())) {
                formValue.anio = dateObj.getFullYear();
            }
        }

        // Asegurar que media_url tenga valor (usar primera imagen de la galería si está vacío)
        if (!formValue.media_url && formValue.media && formValue.media.length > 0) {
            formValue.media_url = formValue.media[0].url;
        }

        const request$ = (this.isEditing && this.currentEditingId)
            ? this.timelineService.updateHistoria(this.currentEditingId, formValue)
            : this.timelineService.createHistoria(formValue);

        request$.subscribe({
            next: () => {
                this.isLoading = false;
                this.closeModal();
                this.showToast(this.isEditing ? 'Hito actualizado' : 'Hito creado');
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
                this.showToast('Error al guardar hito', 'danger');
            }
        });
    }

    async toggleVisibility(historia: Historia, event: any) {
        const newStatus = event.detail.checked;
        if (historia.visible === newStatus) return;

        this.timelineService.updatePartialHistoria(historia.id, { visible: newStatus }).subscribe({
            next: () => this.showToast(`Hito ${newStatus ? 'visible' : 'oculto'}`),
            error: (err) => {
                console.error(err);
                this.showToast('Error al cambiar visibilidad', 'danger');
                event.target.checked = !newStatus;
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

    private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
        const toast = await this.toastCtrl.create({
            message, duration: 2000, color, position: 'bottom'
        });
        toast.present();
    }
}
