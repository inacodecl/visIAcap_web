import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

// Servicios
import { ProyectosService } from 'src/app/core/services/proyectos.service';
import { EsteMesService } from 'src/app/core/services/este-mes.service';
import { Proyecto } from 'src/app/core/models/proyecto.model';

// Modelos migrados
import { ProyectoFuturo, EventoEsteMes } from '../futuro.models';

// Componentes modulares
import { HeroFuturoComponent } from '../components-futuro/hero-futuro/hero-futuro.component';
import { ProyectosFuturoComponent } from '../components-futuro/proyectos-futuro/proyectos-futuro.component';
import { EsteMesFuturoComponent } from '../components-futuro/este-mes-futuro/este-mes-futuro.component';
import { FanMenuComponent } from '../../home/components/fan-menu/fan-menu.component';
@Component({
    selector: 'app-futuro',
    templateUrl: './futuro.page.html',
    styleUrls: ['./futuro.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule, IonIcon,
        HomeFooterComponent,
        TranslateModule,
        HeroFuturoComponent,
        ProyectosFuturoComponent,
        EsteMesFuturoComponent,
        FanMenuComponent
    ]
})
export class FuturoPage implements OnInit {
    private router = inject(Router);
    private proyectosService = inject(ProyectosService);
    private esteMesService = inject(EsteMesService);

    // Estado de carga
    loading = signal<boolean>(true);

    // Mes actual del dispositivo
    nombreMesActual = signal<string>(
        new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase()
    );

    // ========================================
    // Datos de los bloques (Signals)
    // ========================================
    proyectos = signal<ProyectoFuturo[]>([]);
    esteMes = signal<EventoEsteMes[]>([]);

    // Lógica para 'Ver más' eventos
    mostrarTodosEventos = signal(false);

    constructor() {
        addIcons({ arrowBackOutline });
    }

    ngOnInit() {
        this.loadData();
    }

    /**
     * Carga todos los bloques en paralelo desde el backend
     */
    loadData() {
        this.loading.set(true);

        forkJoin({
            proyectos: this.proyectosService.getProyectos('es', 'futuro'),
            esteMes: this.esteMesService.getAll('es')
        }).subscribe({
            next: (res) => {
                this.proyectos.set(this.mapProyectos(res.proyectos));
                this.esteMes.set(res.esteMes);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error al cargar datos del futuro:', err);
                this.loading.set(false);
            }
        });
    }

    /**
     * Mapper de Proyecto -> ProyectoFuturo
     */
    private mapProyectos(proyectos: Proyecto[]): ProyectoFuturo[] {
        return proyectos.map(p => ({
            id: p.id,
            titulo: p.titulo || 'Sin título',
            descripcion: p.resumen || p.descripcion || '',
            imagen: p.image_cover_url || 'assets/placeholder.jpg',
            categoria: p.categories && p.categories.length > 0 ? p.categories[0].nombre : 'General',
            icono: 'bulb-outline' // Icono por defecto para proyectos del futuro
        }));
    }

    /**
     * Navegación con retraso para animación de botón (UX Tótem)
     */
    private navigateWithDelay(route: string) {
        setTimeout(() => {
            this.router.navigate([route]);
        }, 300);
    }

    volverHome() {
        this.navigateWithDelay('/home');
    }
}
