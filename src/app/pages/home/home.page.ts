import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HomeHeaderComponent } from '../../components/headers/home-header/home-header.component';
import { HomeFooterComponent } from '../../components/footers/home-footer/home-footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonButton,
    IonIcon,
    HomeHeaderComponent,
    HomeFooterComponent
  ]
})
export class HomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  irAGestionUsuarios() {
    this.router.navigate(['/gestion-usuarios']);
  }

  navegarPasado() {
    console.log('Navegar a Pasado');
    this.router.navigate(['/pasado']);
  }

  navegarPresente() {
    console.log('Navegar a Presente');
    // Implementar navegación aquí
  }

  navegarFuturo() {
    console.log('Navegar a Futuro');
    // Implementar navegación aquí
  }

}
