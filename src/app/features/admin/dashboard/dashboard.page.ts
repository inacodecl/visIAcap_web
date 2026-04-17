import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
    IonContent, IonIcon, IonRouterOutlet
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
    time, videocam, rocket, people, grid, gridOutline,
    menuOutline, closeOutline, timeOutline, videocamOutline, 
    rocketOutline, newspaperOutline, peopleOutline, 
    logOutOutline, analyticsOutline 
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
        IonContent, IonIcon, IonRouterOutlet
    ]
})
export class DashboardPage implements OnInit {
    authService = inject(AuthService);
    private router = inject(Router);

    mobileMenuOpen = false;

    constructor() {
        addIcons({
            grid, time, videocam, rocket, people, gridOutline,
            menuOutline, closeOutline, timeOutline, videocamOutline, 
            rocketOutline, newspaperOutline, peopleOutline, 
            logOutOutline, analyticsOutline
        });
    }

    ngOnInit() {
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
