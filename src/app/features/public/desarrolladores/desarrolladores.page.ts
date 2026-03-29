import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardSubtitle
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-desarrolladores',
  templateUrl: './desarrolladores.page.html',
  styleUrls: ['./desarrolladores.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardSubtitle,
    TranslateModule
  ]
})
export class DesarrolladoresPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
