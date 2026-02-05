import { Component, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { CommonModule, Location } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
    selector: 'app-button-back',
    standalone: true,
    imports: [CommonModule, IonButton, IonIcon],
    templateUrl: './button-back.component.html',
    styleUrls: ['./button-back.component.scss']
})
export class ButtonBackComponent {
    private location = inject(Location);
    isPressed = false;

    constructor() {
        addIcons({ arrowBack });
    }

    goBack() {
        this.isPressed = true;
        setTimeout(() => {
            this.location.back();
        }, 400);
    }
}
