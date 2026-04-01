import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RotateCubeComponent } from '../../../components/loading/rotate-cube/rotate-cube.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

/**
 * SplashPage - Pantalla de bienvenida de la aplicación
 * 
 * Muestra el logo de INACAP con animaciones de entrada y salida.
 * Espera a que las traducciones estén cargadas antes de mostrar textos.
 * Después de 3 segundos, navega automáticamente al Home.
 */
@Component({
    selector: 'app-splash',
    templateUrl: './splash.page.html',
    styleUrls: ['./splash.page.scss'],
    standalone: true,
    imports: [CommonModule, RotateCubeComponent, IonGrid, IonRow, IonCol, TranslateModule]
})
export class SplashPage implements OnInit, OnDestroy {

    private router = inject(Router);
    private translate = inject(TranslateService);

    // Estado de la animación de salida
    isExiting = false;

    /** Flag que indica si las traducciones ya están disponibles */
    translationsReady = false;

    // Duración del splash en milisegundos
    private readonly SPLASH_DURATION = 3000;
    // Duración de la animación de salida en milisegundos
    private readonly EXIT_ANIMATION_DURATION = 800;

    private langSub?: Subscription;

    ngOnInit() {
        this.waitForTranslations();
    }

    ngOnDestroy() {
        this.langSub?.unsubscribe();
    }

    /**
     * Espera a que el archivo de traducciones esté cargado.
     * Si ya está disponible, muestra inmediatamente; 
     * si no, se suscribe al evento onLangChange.
     */
    private waitForTranslations() {
        // Intentar obtener una traducción inmediatamente
        const testKey = this.translate.instant('SPLASH.SEDE');

        if (testKey && testKey !== 'SPLASH.SEDE') {
            // Las traducciones ya están cargadas
            this.translationsReady = true;
            this.startSplashTimer();
        } else {
            // Esperar a que se carguen las traducciones
            this.langSub = this.translate.onLangChange.subscribe(() => {
                this.translationsReady = true;
                this.startSplashTimer();
                this.langSub?.unsubscribe();
            });
        }
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
