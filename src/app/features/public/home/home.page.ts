import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircleOutline, informationCircleOutline, accessibilityOutline, logInOutline, languageOutline, closeOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';


// Componentes Individuales de Botones
import { BtnPasadoComponent } from './components/btn-pasado/btn-pasado.component';
import { BtnPresenteComponent } from './components/btn-presente/btn-presente.component';
import { BtnFuturoComponent } from './components/btn-futuro/btn-futuro.component';
import { HomeFooterComponent } from '../../../components/footers/home-footer/home-footer.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule, IonIcon, 
        IonGrid, IonRow, IonCol, BtnPasadoComponent, BtnPresenteComponent, BtnFuturoComponent,
        HomeFooterComponent, TranslateModule
    ]
})
export class HomePage implements OnInit {

    constructor(
        private router: Router
    ) {
        addIcons({ personCircleOutline, informationCircleOutline, accessibilityOutline, logInOutline, languageOutline, closeOutline });
    }

    ngOnInit() {
    }

}
