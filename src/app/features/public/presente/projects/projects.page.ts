import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForward, arrowBack } from 'ionicons/icons';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { ProyectosService } from '../../../../core/services/proyectos.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, FormsModule, RouterModule,
    IonButton, IonIcon,
    HomeFooterComponent
  ]
})
export class ProjectsPage implements OnInit {
  private proyectosService = inject(ProyectosService);

  // Computados para separar destacados de normales
  featuredProject = computed(() => this.proyectosService.proyectos().find(p => p.featured));
  regularProjects = computed(() => {
    const featured = this.featuredProject();
    return this.proyectosService.proyectos().filter(p => !featured || p.id !== featured.id);
  });

  constructor() {
    addIcons({ arrowForward, arrowBack });
  }

  ngOnInit() {
    this.proyectosService.getProyectos('es').subscribe();
  }

}
