import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
    IonContent, IonIcon, IonRouterOutlet, IonPopover, IonList, IonItem, IonLabel, PopoverController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
    time, videocam, rocket, people, grid, gridOutline,
    menuOutline, closeOutline, timeOutline, videocamOutline, 
    rocketOutline, newspaperOutline, peopleOutline, 
    logOutOutline, analyticsOutline, personOutline, listOutline
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        IonIcon, IonRouterOutlet, IonPopover, IonList, IonItem, IonLabel
    ]
})
export class DashboardPage implements OnInit {
    authService = inject(AuthService);
    private router = inject(Router);
    private popoverController = inject(PopoverController);

    mobileMenuOpen = false;

    constructor() {
        addIcons({
            grid, time, videocam, rocket, people, gridOutline,
            menuOutline, closeOutline, timeOutline, videocamOutline, 
            rocketOutline, newspaperOutline, peopleOutline, 
            logOutOutline, analyticsOutline, personOutline, listOutline
        });
    }

    ngOnInit() {
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    async logout() {
        // Cierra cualquier popover abierto (como el del nivel de administrador)
        try {
            await this.popoverController.dismiss();
        } catch (e) {
            // Se ignora si no hay un popover abierto
        }
        
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
