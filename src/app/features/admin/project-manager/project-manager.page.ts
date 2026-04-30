import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonButton, IonIcon,
    IonSegment, IonSegmentButton, IonLabel, IonPopover, ModalController, ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    rocket, trash, create, globe, add, close, list, pricetags, arrowForward, videocam, personOutline, informationCircleOutline
} from 'ionicons/icons';
import { ProyectosService } from '../../../core/services/proyectos.service';
import { Proyecto } from '../../../core/models/proyecto.model';
import { ProjectManagerCreateComponent } from './project-manager-create/project-manager-create.component';
import { MetadataManagerModalComponent } from './metadata-manager-modal/metadata-manager-modal.component';
import { AdminHeaderComponent } from '../components-admin/admin-header/admin-header.component';
import { AdminPageTitleComponent } from '../components-admin/admin-page-title/admin-page-title.component';
import { AdminActionCardComponent } from '../components-admin/admin-action-card/admin-action-card.component';
import { AdminEmptyStateComponent } from '../components-admin/admin-empty-state/admin-empty-state.component';

@Component({
    selector: 'app-project-manager',
    templateUrl: './project-manager.page.html',
    styleUrls: ['./project-manager.page.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonGrid, IonRow, IonCol,
        IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonButton, IonIcon,
        IonSegment, IonSegmentButton, IonLabel, IonPopover,
        AdminPageTitleComponent, AdminActionCardComponent, AdminEmptyStateComponent
    ]
})
export class ProjectManagerPage implements OnInit {
    private proyectosService = inject(ProyectosService);
    private modalCtrl = inject(ModalController);
    private alertCtrl = inject(AlertController);
    private toastCtrl = inject(ToastController);

    // Signals
    searchTerm = signal('');
    filterType = signal('presente'); // Filtro LOCAL
    proyectos = this.proyectosService.proyectos;

    // Computed Filter (Texto + Tipo)
    filteredProyectos = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const type = this.filterType();

        return this.proyectos().filter(p => {
            const matchesSearch = (p.titulo?.toLowerCase().includes(term) ?? false) ||
                (p.slug?.toLowerCase().includes(term) ?? false);
            const matchesType = p.tipo === type;

            return matchesSearch && matchesType;
        });
    });

    constructor() {
        addIcons({ rocket, add, arrowForward, pricetags, list, globe, create, trash, close, videocam, personOutline, informationCircleOutline });
    }

    ngOnInit() {
        this.loadProyectos();
    }

    loadProyectos() {
        // Pedimos 'all' al backend. El servicio actualiza la señal 'proyectos'.
        this.proyectosService.getProyectos('es', 'all', true).subscribe();
    }

    segmentChanged(event: any) {
        // Solo actualizamos la señal de filtro local
        this.filterType.set(event.detail.value);
    }

    // --- PROJECT MODAL HANDLER ---
    async openCreateModal() {
        const modal = await this.modalCtrl.create({
            component: ProjectManagerCreateComponent,
            cssClass: 'glass-modal project-modal-large'
        });

        await modal.present();
        const { data } = await modal.onWillDismiss();

        if (data === 'confirm') {
            this.showToast('Proyecto creado correctamente');
            this.loadProyectos();
        }
    }

    async openEditModal(proyecto: Proyecto) {
        const loading = await this.modalCtrl.create({
            component: await import('@ionic/angular/standalone').then(m => m.IonSpinner),
            cssClass: 'transparent-modal',
            backdropDismiss: false
        });
        await loading.present();

        this.proyectosService.getProyecto(proyecto.id, 'es').subscribe({
            next: async (fullProject: Proyecto) => {
                await loading.dismiss();
                const modal = await this.modalCtrl.create({
                    component: ProjectManagerCreateComponent,
                    componentProps: { proyecto: fullProject },
                    cssClass: 'glass-modal project-modal-large'
                });

                modal.onDidDismiss().then((result) => {
                    if (result.data === true) {
                        this.showToast('Proyecto actualizado exitosamente');
                        this.loadProyectos();
                    }
                });

                await modal.present();
            },
            error: async (err: any) => {
                console.error(err);
                await loading.dismiss();
                this.showToast('Error al cargar detalles del proyecto', 'danger');
            }
        });
    }

    // --- DELETE PROJECT ---
    async deleteProyecto(id: number) {
        const alert = await this.alertCtrl.create({
            header: 'Confirmar Eliminación',
            message: '¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    handler: () => {
                        this.proyectosService.deleteProyecto(id).subscribe({
                            next: () => {
                                this.showToast('Proyecto eliminado');
                                this.loadProyectos();
                            },
                            error: (err) => console.error(err)
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    // --- METADATA QUICK ACTIONS --- //
    async openTagsManager() {
        const modal = await this.modalCtrl.create({
            component: MetadataManagerModalComponent,
            componentProps: { type: 'tags' },
            cssClass: 'corporate-modal'
        });
        await modal.present();
    }

    async openCategoriesManager() {
        const modal = await this.modalCtrl.create({
            component: MetadataManagerModalComponent,
            componentProps: { type: 'categorias' },
            cssClass: 'corporate-modal'
        });
        await modal.present();
    }

    private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            color,
            position: 'bottom'
        });
        await toast.present();
    }
}
