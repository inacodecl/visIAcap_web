import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RotateCubeComponent } from '../../../components/loading/rotate-cube/rotate-cube.component';

import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

/**
 * SplashPage - Pantalla de bienvenida de la aplicación
 * 
 * Muestra el logo de INACAP con animaciones de entrada y salida.
 * Después de 3 segundos, navega automáticamente al Home.
 */
@Component({
    selector: 'app-splash',
    templateUrl: './splash.page.html',
    styleUrls: ['./splash.page.scss'],
    standalone: true,
    imports: [CommonModule, RotateCubeComponent, IonGrid, IonRow, IonCol]
})
export class SplashPage implements OnInit {

    private router = inject(Router);

    // Estado de la animación de salida
    isExiting = false;

    // Duración del splash en milisegundos
    private readonly SPLASH_DURATION = 3000;
    // Duración de la animación de salida en milisegundos
    private readonly EXIT_ANIMATION_DURATION = 800;

    ngOnInit() {
        this.startSplashTimer();
    }

    /**
     * Inicia el temporizador para la transición automática al Home.
     * Primero activa la animación de salida, luego navega.
     */
    private startSplashTimer() {
        setTimeout(() => {
            // Activar animación de salida
            this.isExiting = true;

            // Esperar a que termine la animación de salida antes de navegar
            setTimeout(() => {
                this.router.navigate(['/home'], { replaceUrl: true });
            }, this.EXIT_ANIMATION_DURATION);

        }, this.SPLASH_DURATION);
    }
}
