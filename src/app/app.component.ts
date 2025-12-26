import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,
  IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel,
  IonMenuToggle, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { layers, people, logOut, time } from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true, // Add standalone true explicitly if missing, though it seems inferred
  imports: [
    CommonModule,
    IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar,
    IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel,
    IonMenuToggle, RouterModule, IonButtons, IonButton
  ],
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    addIcons({ layers, people, logOut, time });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login-admin']);
  }
}
