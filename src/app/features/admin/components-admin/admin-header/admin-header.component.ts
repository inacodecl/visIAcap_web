import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';

@Component({
    selector: 'app-admin-header',
    templateUrl: './admin-header.component.html',
    styleUrls: ['./admin-header.component.scss'],
    standalone: true,
    imports: [CommonModule, IonHeader, IonButtons, IonBackButton, IonButton, IonIcon]
})
export class AdminHeaderComponent {
    @Input() title: string = 'SEDE<br>RENCA (ADMIN)';
    @Input() backUrl: string = '/admin/dashboard';
    @Output() onRefresh = new EventEmitter<void>();

    constructor() {
        addIcons({ refresh });
    }

    triggerRefresh() {
        this.onRefresh.emit();
    }
}
