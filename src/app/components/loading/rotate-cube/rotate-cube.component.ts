import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * RotateCubeComponent - Componente de carga animado
 * 
 * Un cubo que gira y se deforma al tocar el suelo,
 * creando una animación de carga fluida y visualmente atractiva.
 * 
 * @usage
 * <app-rotate-cube></app-rotate-cube>
 */
@Component({
    selector: 'app-rotate-cube',
    templateUrl: './rotate-cube.component.html',
    styleUrls: ['./rotate-cube.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class RotateCubeComponent { }
