import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircleOutline, informationCircleOutline, accessibilityOutline, logInOutline, languageOutline, closeOutline } from 'ionicons/icons';
import { GeometricOverlayTopComponent } from './components/geometric-overlay-top/geometric-overlay-top.component';
import { GeometricOverlayBottomComponent } from './components/geometric-overlay-bottom/geometric-overlay-bottom.component';

// Componentes Individuales de Botones
import { BtnPasadoComponent } from './components/btn-pasado/btn-pasado.component';
import { BtnPresenteComponent } from './components/btn-presente/btn-presente.component';
import { BtnFuturoComponent } from './components/btn-futuro/btn-futuro.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule, IonIcon, 
        IonGrid, IonRow, IonCol, 
        GeometricOverlayTopComponent, GeometricOverlayBottomComponent, 
        BtnPasadoComponent, BtnPresenteComponent, BtnFuturoComponent
    ]
})
export class HomePage implements OnInit {

    constructor(
        private router: Router,
        private actionSheetCtrl: ActionSheetController
    ) {
        addIcons({ personCircleOutline, informationCircleOutline, accessibilityOutline, logInOutline, languageOutline, closeOutline });
    }

    ngOnInit() {
    }

    async openOptions() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Opciones de Sistema',
            buttons: [
                {
                    text: 'Acceso Administrativo',
                    icon: 'log-in-outline',
                    handler: () => {
                        this.router.navigate(['/auth/login']);
                    }
                },
                {
                    text: 'Idioma (Próximamente)',
                    icon: 'language-outline',
                    handler: () => {
                        console.log('Opción de idioma seleccionada');
                    }
                },
                {
                    text: 'Cancelar',
                    icon: 'close-outline',
                    role: 'cancel'
                }
            ]
        });

        await actionSheet.present();
    }

}
