import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonItem, IonLabel, IonToggle, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    close, textOutline, documentTextOutline, imageOutline, 
    calendarClearOutline, bookmark, listOutline, timeOutline, locationOutline, bulbOutline, trash
} from 'ionicons/icons';

// Servicios
import { NoticiasFuturoService } from '../../../../core/services/noticias-futuro.service';
import { EsteMesService } from '../../../../core/services/este-mes.service';
import { UploadService } from '../../../../core/services/upload.service';
import { AdminImageUploadComponent } from '../../components-admin/admin-image-upload/admin-image-upload.component';

@Component({
    selector: 'app-futuro-item-modal',
    templateUrl: './futuro-item-modal.component.html',
    styleUrls: ['./futuro-item-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
        IonIcon, IonItem, IonLabel, IonToggle,
        AdminImageUploadComponent
    ]
})
export class FuturoItemModalComponent implements OnInit {
    private modalCtrl = inject(ModalController);
    private noticiasService = inject(NoticiasFuturoService);
    private esteMesService = inject(EsteMesService);
    private uploadService = inject(UploadService);

    newlyUploadedImages: string[] = [];

    @Input() type!: 'noticias' | 'este-mes';
    @Input() item?: any;

    isEdit = false;
    formData: any = {
        titulo: '',
        is_published: true,
        order_index: 0
    };

    constructor() {
        addIcons({ 
            close, textOutline, documentTextOutline, imageOutline, 
            calendarClearOutline, bookmark, listOutline, timeOutline, locationOutline, bulbOutline, trash 
        });
    }

    ngOnInit() {
        if (this.item) {
            this.isEdit = true;
            this.formData = { ...this.item };
            
            // Ajustes de tipos para selects/inputs si fuera necesario
            if (this.type === 'noticias') {
                this.formData.imagen_url = this.formData.imagen_url || this.formData.imagen;
                if (this.formData.fecha) {
                    // Asegurar formato YYYY-MM-DD para input date
                    const date = new Date(this.formData.fecha);
                    if (!isNaN(date.getTime())) {
                        this.formData.fecha = date.toISOString().split('T')[0];
                    }
                }
            }
        } else {
            // Valores por defecto según tipo
            if (this.type === 'noticias') {
                this.formData.resumen = '';
                this.formData.etiqueta = 'Nuevo';
                this.formData.imagen_url = '';
            } else if (this.type === 'este-mes') {
                this.formData.descripcion = '';
                this.formData.dia = new Date().getDate().toString().padStart(2, '0');
                this.formData.mes = new Date().toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
                this.formData.tipo = 'Evento';
            }
        }
    }

    getLabelSingular(): string {
        if (this.type === 'noticias') return 'Noticia';
        return 'Evento del Mes';
    }

    private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
        const toast = document.createElement('ion-toast');
        toast.message = message;
        toast.duration = 2000;
        toast.color = color;
        toast.position = 'bottom';
        document.body.appendChild(toast);
        await toast.present();
    }

    onImageUploaded(url: string) {
        this.newlyUploadedImages.push(url);
        this.formData.imagen_url = url;
        this.formData.imagen = url;
    }

    removeImage() {
        const currentUrl = this.formData.imagen_url || this.formData.imagen;
        this.formData.imagen_url = '';
        this.formData.imagen = '';

        if (currentUrl && this.newlyUploadedImages.includes(currentUrl)) {
            this.uploadService.deleteImage(currentUrl, 'noticias').subscribe({
                next: () => console.log('Imagen huérfana eliminada:', currentUrl),
                error: (err) => console.error('Error al limpiar imagen huérfana:', err)
            });
            this.newlyUploadedImages = this.newlyUploadedImages.filter(u => u !== currentUrl);
        }
    }

    save() {
        if (!this.formData.titulo) {
            this.showToast('No se puede guardar. El título es obligatorio.', 'danger');
            return;
        }

        let obs: any; // Use any to handle different Observable return types
        if (this.isEdit) {
            if (this.type === 'noticias') obs = this.noticiasService.update(this.formData.id, this.formData);
            else obs = this.esteMesService.update(this.formData.id, this.formData);
        } else {
            if (this.type === 'noticias') obs = this.noticiasService.create(this.formData);
            else obs = this.esteMesService.create(this.formData);
        }

        obs.subscribe({
            next: () => {
                this.newlyUploadedImages = []; // Limpiar tracker ya que la noticia se guardó con éxito
                this.modalCtrl.dismiss('confirm');
            },
            error: (err: any) => console.error('Error saving futuro item:', err)
        });
    }

    close() {
        if (this.newlyUploadedImages.length > 0) {
            this.newlyUploadedImages.forEach(url => {
                this.uploadService.deleteImage(url, 'noticias').subscribe({
                    next: () => console.log('Limpieza: Imagen huérfana eliminada:', url),
                    error: (err) => console.error('Limpieza: Error al eliminar:', err)
                });
            });
            this.newlyUploadedImages = [];
        }
        this.modalCtrl.dismiss();
    }
}
