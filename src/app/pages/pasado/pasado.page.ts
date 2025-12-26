import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HomeHeaderComponent } from '../../components/headers/home-header/home-header.component';
import { HomeFooterComponent } from '../../components/footers/home-footer/home-footer.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
    selector: 'app-pasado',
    templateUrl: './pasado.page.html',
    styleUrls: ['./pasado.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        FormsModule,
        IonButton,
        IonIcon,
        HomeHeaderComponent,
        HomeFooterComponent
    ]
})
export class PasadoPage implements OnInit {

    constructor(private router: Router) {
        addIcons({ arrowBackOutline });
    }

    ngOnInit() {
    }

    goBack() {
        this.router.navigate(['/']);
    }

    goToTimeline() {
        this.router.navigate(['/timeline']);
    }

    goToInterviews() {
        this.router.navigate(['/pasado/entrevistas']);
    }

}
