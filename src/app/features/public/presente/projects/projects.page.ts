import { Component, OnInit, inject, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonHeader } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, arrowBackOutline, rocketOutline, folderOpenOutline } from 'ionicons/icons';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { ProyectosService } from '../../../../core/services/proyectos.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language.service';
import { register } from 'swiper/element/bundle';
import { FanMenuComponent } from '../../home/components/fan-menu/fan-menu.component';
register();

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, CommonModule, FormsModule, RouterModule,
    IonIcon,
    HomeFooterComponent,
    TranslateModule,
    FanMenuComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsPage implements OnInit {
  private proyectosService = inject(ProyectosService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  // Computados para separar destacados de normales
  featuredProjects = computed(() => this.proyectosService.proyectos().filter(p => p.featured));
  regularProjects = computed(() => this.proyectosService.proyectos().filter(p => !p.featured));

  // Estadísticas Dinámicas Reales
  totalProjects = computed(() => this.proyectosService.proyectos().length);
  
  totalCategories = computed(() => {
    const cats = new Set<number>();
    this.proyectosService.proyectos().forEach(p => {
      if (p.categories) {
        p.categories.forEach(c => cats.add(c.id));
      }
    });
    // Retornamos la cantidad de categorías únicas. 
    // Si la API no retorna categorías en el listado, ponemos 4 como base visual.
    return cats.size > 0 ? cats.size : 4; 
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
