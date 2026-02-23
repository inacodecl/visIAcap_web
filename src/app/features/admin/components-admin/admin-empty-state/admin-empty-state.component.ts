import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-empty-state',
    templateUrl: './admin-empty-state.component.html',
    styleUrls: ['./admin-empty-state.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class AdminEmptyStateComponent {
    @Input() message: string = 'No hay registros para mostrar.';
}
