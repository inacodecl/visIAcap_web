import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonCardTitle, IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
    IonList, IonListHeader, IonBadge, IonModal, IonFab, IonFabButton,
    IonSearchbar, IonMenuButton, IonNote,
    IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, close, checkmarkCircle, search, eye, hourglass, save, rocket, globe } from 'ionicons/icons';
import { ProyectosService } from '../../../core/services/proyectos.service';
import { Proyecto } from '../../../core/models/proyecto.model';

@Component({
    selector: 'app-project-manager',
    templateUrl: './project-manager.page.html',
    styleUrls: ['./project-manager.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
        IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
        IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
        IonBadge, IonModal, IonFab, IonFabButton,
        IonSearchbar, IonMenuButton, IonNote,
    ]
})
export class ProjectManagerPage implements OnInit {
    private proyectosService = inject(ProyectosService);
    private fb = inject(FormBuilder);

    // Signals
    proyectos = this.proyectosService.proyectos;
    searchTerm = signal('');

    // Computed para filtrado local
    filteredProyectos = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const all = this.proyectos();
        if (!term) return all;

        return all.filter(p =>
            p.titulo?.toLowerCase().includes(term) ||
            p.slug?.toLowerCase().includes(term) ||
            p.resumen?.toLowerCase().includes(term)
        );
    });

    // Estado del formulario
    isModalOpen = false;
    isEditing = false;
    currentEditingId: number | null = null;
    isLoading = false;

    projectForm: FormGroup = this.fb.group({
        slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
        titulo: ['', [Validators.required, Validators.maxLength(150)]],
        resumen: [''],
        descripcion: [''],
        start_date: [''],
        end_date: [''],
        location: [''],
        image_cover_url: [''],
        url_externa: [''],
        is_published: [true],
        featured: [false]
    });

    constructor() {
        addIcons({ add, create, trash, close, checkmarkCircle, search, eye, hourglass, save, rocket, globe });
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        this.proyectosService.getProyectos('es').subscribe({
            next: (data) => {
                console.log('DEBUG: Proyectos cargados:', data);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('DEBUG: Error cargando proyectos:', err);
                this.isLoading = false;
            }
        });
    }

    openCreateModal() {
        this.isEditing = false;
        this.currentEditingId = null;
        this.projectForm.reset({ is_published: true, featured: false });
        this.isModalOpen = true;
    }

    openEditModal(proyecto: Proyecto) {
        this.isEditing = true;
        this.currentEditingId = proyecto.id;

        let startFormatted = '';
        let endFormatted = '';
        if (proyecto.start_date) {
            const d = new Date(proyecto.start_date);
            if (!isNaN(d.getTime())) startFormatted = d.toISOString().split('T')[0];
        }
        if (proyecto.end_date) {
            const d = new Date(proyecto.end_date);
            if (!isNaN(d.getTime())) endFormatted = d.toISOString().split('T')[0];
        }

        this.projectForm.patchValue({
            slug: proyecto.slug,
            titulo: proyecto.titulo,
            resumen: proyecto.resumen,
            descripcion: proyecto.descripcion,
            start_date: startFormatted,
            end_date: endFormatted,
            location: proyecto.location,
            image_cover_url: proyecto.image_cover_url,
            url_externa: proyecto.url_externa,
            is_published: proyecto.is_published,
            featured: proyecto.featured
        });
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    async saveProyecto() {
        if (this.projectForm.invalid) {
            this.projectForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const formValue = { ...this.projectForm.value };
        // Forzar tipo 'presente' para estos proyectos
        formValue.tipo = 'presente';

        if (this.isEditing && this.currentEditingId) {
            this.proyectosService.updateProyecto(this.currentEditingId, formValue).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.closeModal();
                    this.showToast('Proyecto actualizado correctamente');
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                    this.showToast('Error al actualizar proyecto', 'danger');
                }
            });
        } else {
            this.proyectosService.createProyecto(formValue).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.closeModal();
                    this.showToast('Proyecto creado correctamente');
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                    if (err.status === 409) {
                        this.showToast('El slug ya existe, usa otro', 'warning');
                    } else {
                        this.showToast('Error al crear proyecto', 'danger');
                    }
                }
            });
        }
    }

    deleteProyecto(id: number) {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        this.proyectosService.deleteProyecto(id).subscribe({
            next: () => this.showToast('Proyecto eliminado'),
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
