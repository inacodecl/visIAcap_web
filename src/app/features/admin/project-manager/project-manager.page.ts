import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonHeader, IonContent, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonButton, IonBackButton, IonIcon,
    IonSearchbar, IonButtons, ModalController, AlertController, ToastController,
    IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    rocket, trash, create, globe, add, close, list, pricetags, arrowForward
} from 'ionicons/icons';
import { ProyectosService } from '../../../core/services/proyectos.service';
import { Proyecto } from '../../../core/models/proyecto.model';
import { ProjectManagerCreateComponent } from './project-manager-create/project-manager-create.component';
import { MetadataManagerModalComponent } from './metadata-manager-modal/metadata-manager-modal.component';

@Component({
    selector: 'app-project-manager',
    templateUrl: './project-manager.page.html',
    styleUrls: ['./project-manager.page.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonHeader, IonContent, IonGrid, IonRow, IonCol,
        IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonButton, IonBackButton, IonIcon,
        IonSearchbar, IonButtons, IonToolbar, IonSegment, IonSegmentButton, IonLabel
    ]
})
export class ProjectManagerPage implements OnInit {
    private proyectosService = inject(ProyectosService);
    private modalCtrl = inject(ModalController);
    private alertCtrl = inject(AlertController);
    private toastCtrl = inject(ToastController);

    // Signals
    searchTerm = signal('');
    currentType = signal('presente'); // Default tab
    proyectos = this.proyectosService.proyectos;

    // Computed Filter
    filteredProyectos = computed(() => {
        const term = this.searchTerm().toLowerCase();
        return this.proyectos().filter(p =>
            (p.titulo?.toLowerCase().includes(term) ?? false) ||
            (p.slug?.toLowerCase().includes(term) ?? false)
        );
    });

    constructor() {
        addIcons({ rocket, add, arrowForward, pricetags, list, globe, create, trash, close });
    }

    ngOnInit() {
        this.loadProyectos();
    }

    loadProyectos() {
        this.proyectosService.getProyectos('es', this.currentType(), true).subscribe();
    }

    segmentChanged(event: any) {
        this.currentType.set(event.detail.value);
        this.loadProyectos();
    }

    // --- PROJECT MODAL HANDLER ---
    async openCreateModal() {
        const modal = await this.modalCtrl.create({
            component: ProjectManagerCreateComponent,
            cssClass: 'glass-modal'
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
                    cssClass: 'glass-modal'
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
            cssClass: 'glass-modal'
        });
        await modal.present();
    }

    async openCategoriesManager() {
        const modal = await this.modalCtrl.create({
            component: MetadataManagerModalComponent,
            componentProps: { type: 'categorias' },
            cssClass: 'glass-modal'
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
