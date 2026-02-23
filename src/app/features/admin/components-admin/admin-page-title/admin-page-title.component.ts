import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { rocket, videocam, time } from 'ionicons/icons';

@Component({
    selector: 'app-admin-page-title',
    templateUrl: './admin-page-title.component.html',
    styleUrls: ['./admin-page-title.component.scss'],
    standalone: true,
    imports: [CommonModule, IonIcon, IonSearchbar]
})
export class AdminPageTitleComponent {
    @Input() title: string = '';
    @Input() icon: string = '';
    @Input() themeColor: 'red' | 'blue' | 'orange' | 'green' = 'blue';
    @Input() searchPlaceholder: string = 'Buscar...';

    @Output() searchChange = new EventEmitter<string>();

    constructor() {
        addIcons({ rocket, videocam, time });
    }

    onSearchInput(event: any) {
        this.searchChange.emit(event.target.value);
    }
}
