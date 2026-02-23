import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, arrowForward, pricetags, list, videocam, time } from 'ionicons/icons';

@Component({
    selector: 'app-admin-action-card',
    templateUrl: './admin-action-card.component.html',
    styleUrls: ['./admin-action-card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonIcon]
})
export class AdminActionCardComponent {
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() icon: string = 'add';
    @Input() themeColor: 'red' | 'blue' | 'orange' | 'green' = 'blue';

    @Output() cardClick = new EventEmitter<void>();

    constructor() {
        addIcons({ add, arrowForward, pricetags, list, videocam, time });
    }

    onClick() {
        this.cardClick.emit();
    }
}
