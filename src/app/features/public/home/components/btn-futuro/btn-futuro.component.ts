import { Component, ElementRef, ViewChild, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-btn-futuro',
  templateUrl: './btn-futuro.component.html',
  styleUrls: ['./btn-futuro.component.scss'],
  standalone: true
})
export class BtnFuturoComponent {
  @ViewChild('rippleContainer') rippleContainer!: ElementRef;
  isAnimating = false;

  constructor(private router: Router, private renderer: Renderer2, private elRef: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent | TouchEvent) {
    if (this.isAnimating) return;

    this.isAnimating = true;

    // Crear la onda expansiva
    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'ripple');
    
    // Calcular coordenadas
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
    
    // Iniciar Navegación
    setTimeout(() => {
      this.isAnimating = false;
      this.renderer.removeChild(this.rippleContainer.nativeElement, ripple);
      this.router.navigate(['/futuro']);
    }, 1500);
  }
}
