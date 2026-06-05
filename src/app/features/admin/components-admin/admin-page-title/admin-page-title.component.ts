import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { rocket, videocam, time, images, chatboxEllipsesOutline } from 'ionicons/icons';

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
    @Input() themeColor: 'red' | 'blue' | 'orange' | 'green' | 'primary' = 'blue';
    @Input() searchPlaceholder: string = 'Buscar...';
    @Input() showSearch: boolean = true;

    @Output() searchChange = new EventEmitter<string>();

    constructor() {
        addIcons({ rocket, videocam, time, images, chatboxEllipsesOutline });
    }

    onSearchInput(event: any) {
        this.searchChange.emit(event.target.value);
    }
}
