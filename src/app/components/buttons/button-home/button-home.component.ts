import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, locationOutline, rocketOutline } from 'ionicons/icons';

@Component({
    selector: 'app-button-home',
    standalone: true,
    imports: [CommonModule, IonIcon],
    templateUrl: './button-home.component.html',
    styleUrls: ['./button-home.component.scss'],
})
export class ButtonHomeComponent {
    @Input() label: string = 'Button';
    /**
     * Nombre del ícono de Ionic a mostrar junto al texto.
     * Ejemplos: 'time-outline', 'location-outline', 'rocket-outline'
     */
    @Input() icon: string = '';
    /**
     * Variantes para cambiar el esquema de colores del botón.
     * - pasado: Tonos sepia/retro
     * - presente: Tono actual (Teal/Original)
     * - futuro: Tonos neón/futuristas
     */
    @Input() variant: 'pasado' | 'presente' | 'futuro' = 'presente';

    constructor() {
        // Registrar íconos para Ionic Standalone
        addIcons({ timeOutline, locationOutline, rocketOutline });
    }
}
