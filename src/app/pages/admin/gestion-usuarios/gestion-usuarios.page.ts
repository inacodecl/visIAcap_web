import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonAvatar, IonNote, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonNote,
    IonButtons,
    IonMenuButton]
})
export class GestionUsuariosPage implements OnInit {

  usuarios: any[] = [];

  errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    console.log('Entra a la página de gestión de usuarios');
    this.apiService.getUsuarios().subscribe({
      next: (data) => {
        console.log('Respuesta API cruda:', data);
        if (Array.isArray(data.data)) {
          this.usuarios = data.data;
        }else {
          console.warn('Estructura de datos desconocida:', data);
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.errorMessage = 'Error al cargar usuarios. Por favor, intente nuevamente.';
      }
    });
  }

}
