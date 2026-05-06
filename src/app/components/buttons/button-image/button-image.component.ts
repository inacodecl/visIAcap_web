import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-image',
  templateUrl: './button-image.component.html',
  styleUrls: ['./button-image.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ButtonImageComponent {
  /** Emite un evento al hacer click en el botón */
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
