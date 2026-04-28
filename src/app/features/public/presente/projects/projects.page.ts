import { Component, OnInit, inject, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
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
    IonContent, CommonModule, FormsModule, RouterModule,
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
  
  totalFeatured = computed(() => this.proyectosService.proyectos().filter(p => p.featured).length);

  latestYear = computed(() => {
    const projs = this.proyectosService.proyectos();
    if (!projs || projs.length === 0) return new Date().getFullYear();
    const sorted = [...projs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return new Date(sorted[0].created_at).getFullYear();
  });

  totalCategories = computed(() => {
    const cats = new Set<number>();
    this.proyectosService.proyectos().forEach(p => {
      if (p.categories) {
        p.categories.forEach(c => cats.add(c.id));
      }
    });
    return cats.size > 0 ? cats.size : 0; 
  });

  // Animación del Header
  progressHeader: number = 0; 
  readonly SCROLL_RANGE = 200; // Rango más corto para celular

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    
    // Header progress
    let progressHeader = scrollTop / this.SCROLL_RANGE;
    progressHeader = Math.max(0, Math.min(1, progressHeader));
    this.progressHeader = progressHeader; // Guarda el valor para el binding CSS
  }

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
