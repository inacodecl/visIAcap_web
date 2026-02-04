import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { timeOutline, businessOutline, rocketOutline, personCircleOutline, informationCircleOutline, accessibilityOutline, logInOutline, languageOutline, closeOutline } from 'ionicons/icons';
import { GeometricOverlayTopComponent } from './components/geometric-overlay-top/geometric-overlay-top.component';
import { GeometricOverlayBottomComponent } from './components/geometric-overlay-bottom/geometric-overlay-bottom.component';

@Component({
    selector: 'app-homev2',
    templateUrl: './homev2.page.html',
    styleUrls: ['./homev2.page.scss'],
    standalone: true,
    imports: [IonContent, CommonModule, FormsModule, IonIcon, GeometricOverlayTopComponent, GeometricOverlayBottomComponent]
})
export class Homev2Page implements OnInit {

    constructor(
        private router: Router,
        private actionSheetCtrl: ActionSheetController
    ) {
        addIcons({ timeOutline, businessOutline, rocketOutline, personCircleOutline, informationCircleOutline, accessibilityOutline, logInOutline, languageOutline, closeOutline });
    }

    ngOnInit() {
    }

    /**
     * Navegación con retraso para permitir ver la animación del botón.
     * Ideal para Tótems y dispositivos táctiles.
     * @param route Ruta a navegar
     */
    private navigateWithDelay(route: string) {
        // Retraso de 300ms para que la animación CSS (scale) se aprecie
        setTimeout(() => {
            this.router.navigate([route]);
        }, 300);
    }

    navegarPasado() {
        this.navigateWithDelay('/pasado');
    }

    navegarPresente() {
        this.navigateWithDelay('/presente');
    }

    navegarFuturo() {
        this.navigateWithDelay('/futuro');
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
