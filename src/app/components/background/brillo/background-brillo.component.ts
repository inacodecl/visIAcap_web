import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de fondo con efecto de estrellas/partículas animadas.
 * Extraído de Uiverse y adaptado para Angular Standalone.
 * 
 * Uso: Colocar como primer hijo de un contenedor con position: relative.
 * El componente ocupa el 100% del contenedor padre.
 */
@Component({
    selector: 'app-background-brillo',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './background-brillo.component.html',
    styleUrls: ['./background-brillo.component.scss'],
})
export class BackgroundBrilloComponent { }
