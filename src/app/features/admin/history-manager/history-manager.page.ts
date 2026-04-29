import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
    IonCardTitle, IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
    IonBadge, IonModal,
    IonNote, IonSelect, IonSelectOption,
    IonIcon, IonGrid, IonRow, IonCol, ModalController, ToastController, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, close, checkmarkCircle, search, eye, hourglass, save, time, arrowForward, images, pricetags, link, refresh, location } from 'ionicons/icons';
import { TimelineService } from '../../../core/services/timeline.service';
import { MetadataService } from '../../../core/services/metadata.service';
import { Historia, HistoriaTag, HistoriaMedia } from '../../../core/models/historia.model';
import { MetadataManagerModalComponent } from '../project-manager/metadata-manager-modal/metadata-manager-modal.component';
import { AdminHeaderComponent } from '../components-admin/admin-header/admin-header.component';
import { AdminPageTitleComponent } from '../components-admin/admin-page-title/admin-page-title.component';
import { AdminActionCardComponent } from '../components-admin/admin-action-card/admin-action-card.component';
import { AdminEmptyStateComponent } from '../components-admin/admin-empty-state/admin-empty-state.component';
import { UploadService } from '../../../core/services/upload.service';
import { AdminImageUploadComponent } from '../components-admin/admin-image-upload/admin-image-upload.component';

@Component({
    selector: 'app-history-manager',
    templateUrl: './history-manager.page.html',
    styleUrls: ['./history-manager.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
        IonIcon, IonGrid, IonRow, IonCol,
        IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
        IonBadge, IonModal,
        IonNote, IonSelect, IonSelectOption, IonSpinner,
        AdminPageTitleComponent, AdminActionCardComponent, AdminEmptyStateComponent,
        AdminImageUploadComponent
    ]
})
export class HistoryManagerPage implements OnInit {
    private timelineService = inject(TimelineService);
    private metadataService = inject(MetadataService);
    private uploadService = inject(UploadService);
    private fb = inject(FormBuilder);
    private modalCtrl = inject(ModalController);
    private toastCtrl = inject(ToastController);

    // Track recently uploaded images to delete if form is cancelled
    newlyUploadedImages: string[] = [];

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
        order_index: [0], // Evitar error de nulo en DB
        location: [''],
        categoria_id: [null],
        audio_url: [''],

        // Relaciones
        media: this.fb.array([]), // Array de Multimedia extra
        tags: [[]] // Array de IDs de tags
    });

    constructor() {
        addIcons({ time, arrowForward, refresh, create, trash, close, eye, images, add, link, pricetags, checkmarkCircle, search, hourglass, save, location });
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

    addMediaItem(url: string) {
        if (this.mediaArray.length >= 3) {
            this.showToast('Límite de 3 imágenes alcanzado', 'warning');
            return;
        }
        
        // Track the URL so we can delete it if the form is cancelled
        this.newlyUploadedImages.push(url);
        
        this.mediaArray.push(this.fb.group({
            url: [url, Validators.required],
            tipo: ['image'], // Now strictly image
            alt: ['']
        }));
    }

    removeMediaItem(index: number) {
        const item = this.mediaArray.at(index).value;
        this.mediaArray.removeAt(index);
        
        // Si la imagen fue recién subida en esta sesión y el usuario la quita, la eliminamos del servidor
        if (item && item.url && this.newlyUploadedImages.includes(item.url)) {
            this.uploadService.deleteImage(item.url, 'hitos').subscribe({
                next: () => console.log('Imagen huérfana eliminada:', item.url),
                error: (err) => console.error('Error al limpiar imagen huérfana:', err)
            });
            // Quitar de la lista de newlyUploadedImages
            this.newlyUploadedImages = this.newlyUploadedImages.filter(u => u !== item.url);
        }
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
        this.newlyUploadedImages = []; // Reset cleanup tracker

        const today = new Date().toISOString().split('T')[0];
        this.historyForm.reset({
            visible: true,
            fecha: today,
            media: [],
            tags: [],
            location: ''
        });

        this.isModalOpen = true;
    }

    openEditModal(historia: Historia) {
        this.isEditing = true;
        this.currentEditingId = historia.id;
        this.mediaArray.clear();
        this.newlyUploadedImages = []; // Reset cleanup tracker

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
            tags: tagIds,
            location: historia.location || '',
            audio_url: historia.audio_url || ''
        });

        // Marcar formulario como prístino tras cargar datos para trackear cambios correctamente
        this.historyForm.markAsPristine();
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        
        // Si hay imágenes subidas recientemente y se cerró el modal (ej. botón Cancelar), las eliminamos
        if (this.newlyUploadedImages.length > 0) {
            this.newlyUploadedImages.forEach(url => {
                this.uploadService.deleteImage(url, 'hitos').subscribe({
                    next: () => console.log('Limpieza: Imagen huérfana eliminada:', url),
                    error: (err) => console.error('Limpieza: Error al eliminar:', err)
                });
            });
            this.newlyUploadedImages = [];
        }
    }

    // --- CRUD ---

    async saveHistoria() {
        if (this.historyForm.invalid) {
            this.historyForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        let payload: any = {};

        // Si es creación, mandamos todo el formulario (los defaults ya están seteados).
        // Si es edición, mandamos SÓLO lo que se haya ensuciado (dirty) o arreglos forzados.
        if (!this.isEditing) {
            payload = { ...this.historyForm.value };
        } else {
            Object.keys(this.historyForm.controls).forEach(key => {
                const control = this.historyForm.get(key);
                // Si el control fue modificado por el usuario, o si es media/tags (las relaciones siempre las enviamos en PUT/PATCH por seguridad)
                if (control?.dirty || key === 'media' || key === 'tags' || key === 'fecha') {
                    payload[key] = control?.value;
                }
            });
        }

        // Asegurar campos calculados si la fecha va en el payload
        if (payload.fecha) {
            const dateObj = new Date(payload.fecha);
            if (!isNaN(dateObj.getTime())) {
                payload.anio = dateObj.getFullYear();
            }
        }

        // Asegurar que media_url tenga valor principal (usar primera imagen de la galería si está vacío)
        if (!payload.media_url && payload.media && payload.media.length > 0) {
            payload.media_url = payload.media[0].url;
        }

        const request$ = (this.isEditing && this.currentEditingId)
            ? this.timelineService.updateHistoria(this.currentEditingId, payload)
            : this.timelineService.createHistoria(payload);

        request$.subscribe({
            next: () => {
                this.isLoading = false;
                // Si guardamos con éxito, las imágenes ya no son huérfanas, limpiamos el tracker antes de cerrar
                this.newlyUploadedImages = [];
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
