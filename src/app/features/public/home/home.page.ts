import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ButtonHomeComponent } from '../../../components/buttons/button-home/button-home.component';
import { HomeHeaderComponent } from '../../../components/headers/home-header/home-header.component';
import { HomeFooterComponent } from '../../../components/footers/home-footer/home-footer.component';

/**
 * Interfaz para el efecto ripple
 */
interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    HomeHeaderComponent,
    HomeFooterComponent,
    ButtonHomeComponent
  ]
})
export class HomePage implements OnInit {
  /** Array de efectos ripple activos */
  ripples: RippleEffect[] = [];
  private rippleIdCounter = 0;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /**
   * Crea un efecto ripple al tocar el fondo.
   * @param event Evento del click/tap
   */
  onBackgroundTap(event: MouseEvent) {
    // Obtener posición relativa al contenedor
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Crear nuevo ripple
    const ripple: RippleEffect = {
      x,
      y,
      id: this.rippleIdCounter++
    };

    this.ripples.push(ripple);

    // Eliminar ripple después de la animación (1s)
    setTimeout(() => {
      this.ripples = this.ripples.filter(r => r.id !== ripple.id);
    }, 1000);
  }

  irAGestionUsuarios() {
    this.router.navigate(['/gestion-usuarios']);
  }

  /**
   * Navegación con retraso para permitir ver la animación del botón.
   * Ideal para Tótems y dispositivos táctiles.
   * @param route Ruta a navegar
   */
  private navigateWithDelay(route: string) {
    // Retraso de 400ms para que la animación CSS (0.5s) se aprecie al iniciar
    setTimeout(() => {
      this.router.navigate([route]);
    }, 400);
  }

  navegarPasado() {
    this.navigateWithDelay('/pasado');
  }

  navegarPresente() {
    this.navigateWithDelay('/presente/projects');
  }

  navegarFuturo() {
    this.navigateWithDelay('/futuro');
  }

}
