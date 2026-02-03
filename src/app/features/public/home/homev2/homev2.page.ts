import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { timeOutline, businessOutline, rocketOutline, personCircleOutline, informationCircleOutline, accessibilityOutline } from 'ionicons/icons';
import { GeometricOverlayTopComponent } from './components/geometric-overlay-top/geometric-overlay-top.component';
import { GeometricOverlayBottomComponent } from './components/geometric-overlay-bottom/geometric-overlay-bottom.component';

@Component({
    selector: 'app-homev2',
    templateUrl: './homev2.page.html',
    styleUrls: ['./homev2.page.scss'],
    standalone: true,
    imports: [IonContent, CommonModule, FormsModule, IonIcon, GeometricOverlayTopComponent, GeometricOverlayBottomComponent]
})
export class Homev2Page implements OnInit {

    constructor(private router: Router) {
        addIcons({ timeOutline, businessOutline, rocketOutline, personCircleOutline, informationCircleOutline, accessibilityOutline });
    }

    ngOnInit() {
    }

    navegar(ruta: string) {
        this.router.navigate([ruta]);
    }

}
