import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { ButtonBackComponent } from '../../../../components/buttons/button-back/button-back.component';
import { ProyectosService } from '../../../../core/services/proyectos.service';
import { addIcons } from 'ionicons';
import { arrowForward } from 'ionicons/icons';

@Component({
    selector: 'app-futuro',
    templateUrl: './futuro.page.html',
    styleUrls: ['./futuro.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule, HomeFooterComponent, RouterModule,
        IonGrid, IonRow, IonCol, IonIcon,
        ButtonBackComponent
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
