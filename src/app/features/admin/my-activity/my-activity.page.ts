import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { environment } from '../../../../environments/environment';
import { addIcons } from 'ionicons';
import {
  filterOutline, downloadOutline, pulseOutline, createOutline,
  addCircleOutline, timeOutline, rocketOutline, videocamOutline,
  newspaperOutline, desktopOutline, chevronBackOutline, chevronForwardOutline,
  personOutline,
  pricetagsOutline,
  folderOpenOutline
} from 'ionicons/icons';

// Interface para mapear la respuesta del backend
interface ActividadLog {
  id: number;
  accion: 'login' | 'crear' | 'editar' | 'eliminar' | 'perfil';
  modulo: string;
  entidad_id: number | null;
  descripcion: string;
  created_at: string;
}

interface MetricasActivity {
  totalHoy: number;
  crear: number;
  editar: number;
  eliminar: number;
}

@Component({
  selector: 'app-my-activity',
  templateUrl: './my-activity.page.html',
  styleUrls: ['./my-activity.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
})
export class MyActivityPage implements OnInit {
  private http = inject(HttpClient);

  // Estado
  actividades: ActividadLog[] = [];
  metricas: MetricasActivity = { totalHoy: 0, crear: 0, editar: 0, eliminar: 0 };
  isLoading = true;
  error = '';

  // Paginación
  currentPage = 1;
  limit = 15;
  totalRecords = 0;
  totalPages = 1;

  // Fechas agrupadas (Hoy, Ayer, etc.)
  actividadesAgrupadas: { dateLabel: string, items: ActividadLog[] }[] = [];

  constructor() {
    addIcons({
      filterOutline, downloadOutline, pulseOutline, createOutline,
      addCircleOutline, timeOutline, rocketOutline, videocamOutline,
      newspaperOutline, desktopOutline, chevronBackOutline, chevronForwardOutline,
      personOutline, pricetagsOutline, folderOpenOutline
    });
  }

  ngOnInit() {
    this.cargarActividad(1);
  }

  cargarActividad(page: number) {
    this.isLoading = true;
    this.error = '';

    const url = `${environment.apiUrl}/actividad/me?page=${page}&limit=${this.limit}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.actividades = res.data;
          this.metricas = res.metricas || this.metricas;
          
          this.totalRecords = res.meta.total;
          this.currentPage = res.meta.page;
          this.totalPages = res.meta.totalPages;

          this.agruparPorFecha();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando actividad', err);
        this.error = 'Hubo un error al cargar tu historial de actividad.';
        this.isLoading = false;
      }
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.cargarActividad(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.cargarActividad(this.currentPage + 1);
    }
  }

  // --- Helpers de Presentación ---

  private agruparPorFecha() {
    const grupos: { [key: string]: ActividadLog[] } = {};

    this.actividades.forEach(item => {
      const date = new Date(item.created_at);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = '';
      if (date.toDateString() === today.toDateString()) {
        label = `Hoy — ${this.formatReadableDate(date)}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = `Ayer — ${this.formatReadableDate(date)}`;
      } else {
        label = this.formatReadableDate(date);
      }

      if (!grupos[label]) grupos[label] = [];
      grupos[label].push(item);
    });

    this.actividadesAgrupadas = Object.keys(grupos).map(key => ({
      dateLabel: key,
      items: grupos[key]
    }));
  }

  private formatReadableDate(d: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('es-ES', options);
  }

  getRelativeTime(dateString: string): string {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHrs < 24) return `Hace ${diffHrs} h ${diffMins % 60} min`;

    // Si es más de 1 día, mostramos la hora exacta en formato HH:MM
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  getThemeClass(accion: string): string {
    const map: any = {
      login: 'theme-orange',
      crear: 'theme-green',
      editar: 'theme-blue',
      eliminar: 'theme-red',
      perfil: 'theme-purple'
    };
    return map[accion] || 'theme-blue';
  }

  getAccionLabel(accion: string): string {
    const map: any = {
      login: 'Inicio Sesión',
      crear: 'Creación',
      editar: 'Edición',
      eliminar: 'Eliminación',
      perfil: 'Perfil'
    };
    return map[accion] || accion;
  }

  getModuloIcon(modulo: string): string {
    const map: any = {
      proyectos: 'rocket-outline',
      entrevistas: 'videocam-outline',
      historias: 'time-outline',
      noticias_futuro: 'newspaper-outline',
      este_mes: 'newspaper-outline',
      usuarios: 'person-outline',
      perfil: 'person-outline',
      tags: 'pricetags-outline',
      categorias: 'folder-open-outline',
      sistema: 'desktop-outline'
    };
    return map[modulo] || 'folder-open-outline';
  }

  getModuloLabel(modulo: string): string {
    const map: any = {
      proyectos: 'Proyectos',
      entrevistas: 'Entrevistas',
      historias: 'Timeline',
      noticias_futuro: 'Noticias Futuro',
      este_mes: 'Este Mes',
      usuarios: 'Gestión Usuarios',
      perfil: 'Mi Perfil',
      tags: 'Tags',
      categorias: 'Categorías',
      sistema: 'Sistema'
    };
    return map[modulo] || modulo;
  }
}
