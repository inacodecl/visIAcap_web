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
    calendarClearOutline, bookmark, listOutline, timeOutline, locationOutline, bulbOutline
} from 'ionicons/icons';

// Servicios
import { NoticiasFuturoService } from '../../../../core/services/noticias-futuro.service';
import { EsteMesService } from '../../../../core/services/este-mes.service';
import { ProximamenteService } from '../../../../core/services/proximamente.service';

@Component({
    selector: 'app-futuro-item-modal',
    templateUrl: './futuro-item-modal.component.html',
    styleUrls: ['./futuro-item-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
        IonIcon, IonItem, IonLabel, IonToggle
    ]
})
export class FuturoItemModalComponent implements OnInit {
    private modalCtrl = inject(ModalController);
    private noticiasService = inject(NoticiasFuturoService);
    private esteMesService = inject(EsteMesService);
    private proximamenteService = inject(ProximamenteService);

    @Input() type!: 'noticias' | 'este-mes' | 'proximamente';
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
            calendarClearOutline, bookmark, listOutline, timeOutline, locationOutline, bulbOutline 
        });
    }

    ngOnInit() {
        if (this.item) {
            this.isEdit = true;
            this.formData = { ...this.item };
            
            // Ajustes de tipos para selects/inputs si fuera necesario
            if (this.type === 'noticias' && this.formData.fecha) {
                // Asegurar formato YYYY-MM-DD para input date
                const date = new Date(this.formData.fecha);
                if (!isNaN(date.getTime())) {
                    this.formData.fecha = date.toISOString().split('T')[0];
                }
            }
        } else {
            // Valores por defecto según tipo
            if (this.type === 'noticias') {
                this.formData.resumen = '';
                this.formData.etiqueta = 'Nuevo';
            } else if (this.type === 'este-mes') {
                this.formData.descripcion = '';
                this.formData.dia = new Date().getDate().toString().padStart(2, '0');
                this.formData.mes = new Date().toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
                this.formData.tipo = 'Evento';
            } else if (this.type === 'proximamente') {
                this.formData.descripcion = '';
                this.formData.icono = 'bulb-outline';
            }
        }
    }

    getLabelSingular(): string {
        if (this.type === 'noticias') return 'Noticia';
        if (this.type === 'este-mes') return 'Evento del Mes';
        return 'Próximo Evento';
    }

    save() {
        if (!this.formData.titulo) return;

        let obs: any; // Use any to handle different Observable return types
        if (this.isEdit) {
            if (this.type === 'noticias') obs = this.noticiasService.update(this.formData.id, this.formData);
            else if (this.type === 'este-mes') obs = this.esteMesService.update(this.formData.id, this.formData);
            else obs = this.proximamenteService.update(this.formData.id, this.formData);
        } else {
            if (this.type === 'noticias') obs = this.noticiasService.create(this.formData);
            else if (this.type === 'este-mes') obs = this.esteMesService.create(this.formData);
            else obs = this.proximamenteService.create(this.formData);
        }

        obs.subscribe({
            next: () => this.modalCtrl.dismiss('confirm'),
            error: (err: any) => console.error('Error saving futuro item:', err)
        });
    }

    close() {
        this.modalCtrl.dismiss();
    }
}
