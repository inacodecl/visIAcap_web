import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { accessibilityOutline, informationCircleOutline, logInOutline, languageOutline, closeOutline } from 'ionicons/icons';

@Component({
    selector: 'app-home-footer',
    templateUrl: './home-footer.component.html',
    styleUrls: ['./home-footer.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class HomeFooterComponent implements OnInit {

    private router = inject(Router);
    private actionSheetCtrl = inject(ActionSheetController);

    constructor() {
        addIcons({ accessibilityOutline, informationCircleOutline, logInOutline, languageOutline, closeOutline });
    }

    ngOnInit() { }

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
