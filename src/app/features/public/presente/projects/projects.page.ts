import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, arrowBackOutline, rocketOutline, folderOpenOutline } from 'ionicons/icons';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { GeometricOverlayTopComponent } from '../../home/components/geometric-overlay-top/geometric-overlay-top.component';
import { ProyectosService } from '../../../../core/services/proyectos.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, FormsModule, RouterModule,
    IonIcon,
    HomeFooterComponent, GeometricOverlayTopComponent,
    TranslateModule
  ]
})
export class ProjectsPage implements OnInit {
  private proyectosService = inject(ProyectosService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  // Computados para separar destacados de normales
  featuredProject = computed(() => this.proyectosService.proyectos().find(p => p.featured));
  regularProjects = computed(() => {
    const featured = this.featuredProject();
    return this.proyectosService.proyectos().filter(p => !featured || p.id !== featured.id);
  });

  constructor() {
    addIcons({ arrowForwardOutline, arrowBackOutline, rocketOutline, folderOpenOutline });
  }

  ngOnInit() {
    this.proyectosService.getProyectos(this.languageService.getCurrentLang()).subscribe();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

}
