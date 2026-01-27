import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * WhiteCubeComponent - Fondo de patrón de cubos 3D
 * 
 * Un patrón geométrico de cubos isométricos en tonos grises/blancos.
 * Se usa como fondo decorativo detrás del contenido.
 * 
 * @usage
 * <app-white-cube></app-white-cube>
 */
@Component({
    selector: 'app-white-cube',
    templateUrl: './white-cube.component.html',
    styleUrls: ['./white-cube.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class WhiteCubeComponent { }
