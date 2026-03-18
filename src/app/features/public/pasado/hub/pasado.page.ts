import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, timeOutline, chatbubblesOutline, arrowForwardOutline, playOutline } from 'ionicons/icons';

@Component({
    selector: 'app-pasado',
    templateUrl: './pasado.page.html',
    styleUrls: ['./pasado.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        CommonModule,
        FormsModule,
        IonButton,
        IonIcon,
        IonGrid,
        IonRow,
        IonCol,
        HomeFooterComponent
    ]
})
export class PasadoPage implements OnInit {

    constructor(private router: Router) {
        addIcons({ arrowBackOutline, timeOutline, chatbubblesOutline, arrowForwardOutline, playOutline });
    }

    ngOnInit() {
    }

    goBack() {
        this.router.navigate(['/home']);
    }

    goToTimeline() {
        this.router.navigate(['/pasado/timeline']);
    }

    goToInterviews() {
        this.router.navigate(['/pasado/interviews']);
    }

}
