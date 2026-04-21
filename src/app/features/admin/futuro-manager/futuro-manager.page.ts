import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonButton, IonIcon,
    IonSegment, IonSegmentButton, IonLabel, ModalController, ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    rocketOutline, trash, create, addCircleOutline, bookmark, calendarOutline, 
    informationCircleOutline, close, bulbOutline, megaphoneOutline, timeOutline
} from 'ionicons/icons';

// Servicios del Futuro
import { NoticiasFuturoService } from '../../../core/services/noticias-futuro.service';
import { EsteMesService } from '../../../core/services/este-mes.service';

// Tipos
import { Noticia, EventoEsteMes } from '../../public/futuro/futuro.models';

// Componentes Admin
import { AdminHeaderComponent } from '../components-admin/admin-header/admin-header.component';
import { AdminPageTitleComponent } from '../components-admin/admin-page-title/admin-page-title.component';
import { AdminActionCardComponent } from '../components-admin/admin-action-card/admin-action-card.component';
import { AdminEmptyStateComponent } from '../components-admin/admin-empty-state/admin-empty-state.component';

// Modal (lo crearemos a continuación)
import { FuturoItemModalComponent } from './futuro-item-modal/futuro-item-modal.component';

@Component({
    selector: 'app-futuro-manager',
    templateUrl: './futuro-manager.page.html',
    styleUrls: ['./futuro-manager.page.scss'],
    imports: [
        CommonModule, FormsModule,
        IonContent, IonGrid, IonRow, IonCol,
        IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonButton, IonIcon,
        IonSegment, IonSegmentButton, IonLabel,
        AdminPageTitleComponent, AdminActionCardComponent, AdminEmptyStateComponent
    ]
})
export class FuturoManagerPage implements OnInit {
    private noticiasService = inject(NoticiasFuturoService);
    private esteMesService = inject(EsteMesService);
    private modalCtrl = inject(ModalController);
    private alertCtrl = inject(AlertController);
    private toastCtrl = inject(ToastController);

    // Signals
    searchTerm = signal('');
    activeSegment = signal<'noticias' | 'este-mes'>('noticias');

    // Data signals from services
    noticias = this.noticiasService.noticias;
    esteMes = this.esteMesService.eventos;

    // Computed Filter
    filteredItems = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const segment = this.activeSegment();
        let items: any[] = [];

        if (segment === 'noticias') items = this.noticias();
        else if (segment === 'este-mes') items = this.esteMes();

        if (!term) return items;

        return items.filter(item => 
            (item.titulo?.toLowerCase().includes(term)) || 
            (item.resumen?.toLowerCase().includes(term)) ||
            (item.descripcion?.toLowerCase().includes(term))
        );
    });

    constructor() {
        addIcons({ 
            rocketOutline, trash, create, addCircleOutline, bookmark, calendarOutline, 
            informationCircleOutline, close, bulbOutline, megaphoneOutline, timeOutline 
        });
    }

    ngOnInit() {
        this.loadAllData();
    }

    loadAllData() {
        this.noticiasService.getAllAdmin('es').subscribe();
        this.esteMesService.getAllAdmin('es').subscribe();
    }

    loadCurrentSegment() {
        const seg = this.activeSegment();
        if (seg === 'noticias') this.noticiasService.getAllAdmin('es').subscribe();
        else if (seg === 'este-mes') this.esteMesService.getAllAdmin('es').subscribe();
    }

    segmentChanged(event: any) {
        this.activeSegment.set(event.detail.value);
        this.searchTerm.set('');
    }

    getActiveLabelSingular(): string {
        const seg = this.activeSegment();
        if (seg === 'noticias') return 'Noticia';
        return 'Evento (Mes)';
    }

    getEventMetadata(item: any): string {
        const seg = this.activeSegment();
        if (seg === 'noticias') return item.fecha || 'Sin fecha';
        return `${item.dia} ${item.mes}`;
    }

    // --- CRUD HANDLERS ---

    async openCreateModal() {
        const modal = await this.modalCtrl.create({
            component: FuturoItemModalComponent,
            componentProps: { 
                type: this.activeSegment() 
            },
            cssClass: 'glass-modal'
        });

        await modal.present();
        const { data } = await modal.onWillDismiss();

        if (data === 'confirm') {
            this.showToast('Creado correctamente');
            this.loadCurrentSegment();
        }
    }

    async openEditModal(item: any) {
        const modal = await this.modalCtrl.create({
            component: FuturoItemModalComponent,
            componentProps: { 
                type: this.activeSegment(),
                item: { ...item } // Copia para no mutar el original antes de guardar
            },
            cssClass: 'glass-modal'
        });

        await modal.present();
        const { data } = await modal.onWillDismiss();

        if (data === 'confirm') {
            this.showToast('Actualizado correctamente');
            this.loadCurrentSegment();
        }
    }

    async deleteItem(item: any) {
        const alert = await this.alertCtrl.create({
            header: 'Confirmar Eliminación',
            message: '¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    handler: () => {
                        const seg = this.activeSegment();
                        let obs;
                        if (seg === 'noticias') obs = this.noticiasService.delete(item.id);
                        else obs = this.esteMesService.delete(item.id);

                        obs.subscribe({
                            next: () => {
                                this.showToast('Eliminado correctamente');
                                this.loadCurrentSegment();
                            },
                            error: (err) => {
                                console.error(err);
                                this.showToast('Error al eliminar', 'danger');
                            }
                        });
                    }
                }
            ]
        });
        await alert.present();
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
