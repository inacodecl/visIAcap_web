import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonButton, IonIcon, ViewWillEnter
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { logoGithub, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { GeometricOverlayTopComponent } from '../home/components/geometric-overlay-top/geometric-overlay-top.component';
import { HomeFooterComponent } from '../../../components/footers/home-footer/home-footer.component';

@Component({
  selector: 'app-desarrolladores',
  templateUrl: './desarrolladores.page.html',
  styleUrls: ['./desarrolladores.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonButton, IonIcon, TranslateModule, GeometricOverlayTopComponent, HomeFooterComponent
  ]
})
export class DesarrolladoresPage implements OnInit, ViewWillEnter {

  expandedCard: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({ logoGithub, chevronDownOutline, chevronUpOutline });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // Al entrar de nuevo a la página (por Ionic routing cache),
    // nos aseguramos de que todos los cuadros empiecen cerrados limpiamente.
    // Si prefieres que uno inicie abierto por defecto, cambia null por 'jarod'
    this.expandedCard = null;
    this.cdr.detectChanges(); // Forzamos la actualización visual tras volver de caché
  }

  toggleCard(devId: string) {
    this.expandedCard = this.expandedCard === devId ? null : devId;
    this.cdr.detectChanges(); // Forzamos la actualización por seguridad en DOM en caché
  }

}
