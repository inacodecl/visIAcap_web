import { Component, ElementRef, ViewChild, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-btn-pasado',
  templateUrl: './btn-pasado.component.html',
  styleUrls: ['./btn-pasado.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class BtnPasadoComponent {
  @ViewChild('rippleContainer') rippleContainer!: ElementRef;
  isExpanded = false;
  isNavigating = false;
  expansionTimeout: any;

  constructor(private router: Router, private renderer: Renderer2, private elRef: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent | TouchEvent) {
    if (this.isNavigating) return;

    if (!this.isExpanded) {
        // PRIMER CLIC: Expandir y animar icono
        this.isExpanded = true;
        this.createRipple(event);

        // Auto-colapsar después de 5 segundos
        clearTimeout(this.expansionTimeout);
        this.expansionTimeout = setTimeout(() => {
            if (!this.isNavigating) this.isExpanded = false;
        }, 5000);
        return;
    }

    // SEGUNDO CLIC: Navegar
    clearTimeout(this.expansionTimeout);
    this.isNavigating = true;
    this.createRipple(event);
    
    // Iniciar Navegación en un timeout breve para ver el ripple
    setTimeout(() => {
      this.isNavigating = false;
      this.isExpanded = false;
      this.router.navigate(['/pasado']);
    }, 400);
  }

  private createRipple(event: MouseEvent | TouchEvent) {
    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'ripple');
    
    const btnElement = this.elRef.nativeElement.querySelector('.glass-btn');
    const rect = btnElement.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    let clientX = 0;
    let clientY = 0;

    if (window.TouchEvent && event instanceof TouchEvent) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    const left = clientX - rect.left - size / 2;
    const top = clientY - rect.top - size / 2;

    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'left', `${left}px`);
    this.renderer.setStyle(ripple, 'top', `${top}px`);

    this.renderer.appendChild(this.rippleContainer.nativeElement, ripple);

    setTimeout(() => {
        if (this.rippleContainer?.nativeElement?.contains(ripple)) {
            this.renderer.removeChild(this.rippleContainer.nativeElement, ripple);
        }
    }, 600);
  }
}
