import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
    IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonIcon, IonLabel, IonMenuToggle,
    IonRouterOutlet, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { people, logOut, time } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
        IonList, IonItem, IonIcon, IonLabel, IonMenuToggle,
        IonRouterOutlet, IonButtons, IonButton
    ]
})
export class AdminLayoutComponent {
    authService = inject(AuthService);
    router = inject(Router);

    constructor() {
        addIcons({ people, logOut, time });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']); 
    }
}
