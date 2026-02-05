import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonImg, IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { HomeHeaderComponent } from '../../../../components/headers/home-header/home-header.component';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { ProyectosService } from '../../../../core/services/proyectos.service';
import { addIcons } from 'ionicons';
import { arrowForward } from 'ionicons/icons';

@Component({
    selector: 'app-futuro',
    templateUrl: './futuro.page.html',
    styleUrls: ['./futuro.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule, HomeHeaderComponent, HomeFooterComponent,
        IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonImg, IonBadge, IonButton, IonIcon
    ]
})
export class FuturoPage implements OnInit {
    private proyectosService = inject(ProyectosService);

    proyectos = this.proyectosService.proyectos;

    constructor() {
        addIcons({ arrowForward });
    }

    ngOnInit() {
        this.proyectosService.getProyectos('es', 'futuro').subscribe();
    }
}
