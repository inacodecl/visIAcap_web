import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
    IonItem, IonInput, IonList, IonLabel, IonSpinner, ModalController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, trash, add, pricetags, list } from 'ionicons/icons';
import { MetadataService } from '../../../../core/services/metadata.service';
import { ProyectoTag, ProyectoCategoria } from '../../../../core/models/proyecto.model';

@Component({
    selector: 'app-metadata-manager-modal',
    templateUrl: './metadata-manager-modal.component.html',
    styleUrls: ['./metadata-manager-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
        IonItem, IonInput, IonList, IonLabel, IonSpinner
    ]
})
export class MetadataManagerModalComponent implements OnInit {
    private modalCtrl = inject(ModalController);
    // Cambiado de ProyectosService a MetadataService
    private metadataService = inject(MetadataService);
    private toastCtrl = inject(ToastController);

    @Input() type: 'tags' | 'categorias' = 'tags';

    items = signal<(ProyectoTag | ProyectoCategoria)[]>([]);
    isLoading = signal(false);

    // New Item Form
    newSlug = '';
    newNombre = '';

    constructor() {
        addIcons({ close, trash, add, pricetags, list });
    }

    ngOnInit() {
        this.loadItems();
    }

    get title() {
        return this.type === 'tags' ? 'Gestión de Etiquetas' : 'Gestión de Categorías';
    }

    get icon() {
        return this.type === 'tags' ? 'pricetags' : 'list';
    }

    loadItems() {
        this.isLoading.set(true);
        const request$ = this.type === 'tags'
            ? this.metadataService.getTags('es')
            : this.metadataService.getCategorias('es');

        request$.subscribe({
            next: (data) => {
                this.items.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.isLoading.set(false);
            }
        });
    }

    createItem() {
        if (!this.newSlug || !this.newNombre) return;
        this.isLoading.set(true);

        const payload = { slug: this.newSlug, nombre_es: this.newNombre };
        const request$ = this.type === 'tags'
            ? this.metadataService.createTag(payload)
            : this.metadataService.createCategoria(payload);

        request$.subscribe({
            next: () => {
                this.showToast(`${this.type === 'tags' ? 'Tag' : 'Categoría'} creada`);
                this.newSlug = '';
                this.newNombre = '';
                this.loadItems();
            },
            error: () => {
                this.showToast('Error al crear elemento', 'danger');
                this.isLoading.set(false);
            }
        });
    }

    deleteItem(id: number) {
        if (!confirm('¿Eliminar este elemento?')) return;
        this.isLoading.set(true);

        const request$ = this.type === 'tags'
            ? this.metadataService.deleteTag(id)
            : this.metadataService.deleteCategoria(id);

        request$.subscribe({
            next: () => {
                this.showToast('Elemento eliminado');
                this.loadItems();
            },
            error: () => {
                this.showToast('Error al eliminar', 'danger');
                this.isLoading.set(false);
            }
        });
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    private async showToast(msg: string, color: 'success' | 'danger' = 'success') {
        const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'bottom' });
        t.present();
    }
}
