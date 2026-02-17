import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    rocketOutline, newspaperOutline, calendarOutline, timeOutline,
    arrowForwardOutline, arrowBackOutline, sparklesOutline, trophyOutline,
    peopleOutline, bulbOutline, codeSlashOutline, constructOutline,
    schoolOutline, flaskOutline
} from 'ionicons/icons';
import { GeometricOverlayTopComponent } from '../../home/homev2/components/geometric-overlay-top/geometric-overlay-top.component';

// Interfaces para datos mock
interface ProyectoFuturo {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    categoria: string;
    icono: string;
}

interface Noticia {
    id: number;
    titulo: string;
    resumen: string;
    fecha: string;
    imagen: string;
    etiqueta: string;
}

interface EventoProximamente {
    id: number;
    titulo: string;
    descripcion: string;
    fechaTexto: string;
    icono: string;
}

interface EventoEsteMes {
    id: number;
    titulo: string;
    descripcion: string;
    dia: string;
    mes: string;
    tipo: string;
}

@Component({
    selector: 'app-futurov2',
    templateUrl: './futurov2.page.html',
    styleUrls: ['./futurov2.page.scss'],
    standalone: true,
    imports: [
        IonContent, CommonModule, FormsModule, IonIcon,
        GeometricOverlayTopComponent
    ]
})
export class Futurov2Page implements OnInit {

    // ========================================
    // Datos Mock — Proyectos Destacados
    // ========================================
    proyectos = signal<ProyectoFuturo[]>([
        {
            id: 1,
            titulo: 'Sistema IoT Campus Verde',
            descripcion: 'Monitoreo ambiental inteligente con sensores distribuidos por todo el campus para optimizar el consumo energético.',
            imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop',
            categoria: 'IoT',
            icono: 'bulb-outline'
        },
        {
            id: 2,
            titulo: 'App de Realidad Aumentada',
            descripcion: 'Experiencia inmersiva de recorrido virtual por la sede Renca con información histórica en tiempo real.',
            imagen: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop',
            categoria: 'Software',
            icono: 'code-slash-outline'
        },
        {
            id: 3,
            titulo: 'Robot Asistente Educativo',
            descripcion: 'Prototipo de robot con IA que asiste a estudiantes en laboratorios de electrónica y mecánica.',
            imagen: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
            categoria: 'Robótica',
            icono: 'construct-outline'
        },
        {
            id: 4,
            titulo: 'Plataforma E-Learning IA',
            descripcion: 'Sistema adaptativo de aprendizaje que personaliza el contenido según el progreso individual del estudiante.',
            imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
            categoria: 'Educación',
            icono: 'school-outline'
        }
    ]);

    // ========================================
    // Datos Mock — Noticias
    // ========================================
    noticias = signal<Noticia[]>([
        {
            id: 1,
            titulo: 'INACAP Renca gana premio nacional de innovación',
            resumen: 'El proyecto de energía solar desarrollado por estudiantes de Ingeniería fue reconocido a nivel nacional.',
            fecha: '10 Feb 2026',
            imagen: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?q=80&w=800&auto=format&fit=crop',
            etiqueta: 'Destacado'
        },
        {
            id: 2,
            titulo: 'Nuevo laboratorio de IA inaugurado',
            resumen: 'El laboratorio cuenta con equipamiento de última generación para proyectos de inteligencia artificial.',
            fecha: '05 Feb 2026',
            imagen: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
            etiqueta: 'Tecnología'
        },
        {
            id: 3,
            titulo: 'Convenio con empresas tecnológicas',
            resumen: 'Se firmaron acuerdos de pasantía y práctica profesional con 5 empresas líderes del sector.',
            fecha: '01 Feb 2026',
            imagen: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop',
            etiqueta: 'Alianzas'
        }
    ]);

    // ========================================
    // Datos Mock — Próximamente
    // ========================================
    proximamente = signal<EventoProximamente[]>([
        {
            id: 1,
            titulo: 'Hackathon INACAP 2026',
            descripcion: '48 horas de desarrollo intensivo. Equipos multidisciplinarios compitiendo por el mejor proyecto tecnológico.',
            fechaTexto: 'Marzo 2026',
            icono: 'code-slash-outline'
        },
        {
            id: 2,
            titulo: 'Feria de Innovación',
            descripcion: 'Muestra abierta a la comunidad con los mejores proyectos estudiantiles del semestre.',
            fechaTexto: 'Abril 2026',
            icono: 'trophy-outline'
        },
        {
            id: 3,
            titulo: 'Semana de la Ciencia',
            descripcion: 'Talleres, charlas y experimentos en vivo para explorar el mundo de la ciencia y tecnología.',
            fechaTexto: 'Mayo 2026',
            icono: 'flask-outline'
        }
    ]);

    // ========================================
    // Datos Mock — Este Mes
    // ========================================
    esteMes = signal<EventoEsteMes[]>([
        {
            id: 1,
            titulo: 'Charla: El Futuro de la IA',
            descripcion: 'Expertos del área comparten tendencias y oportunidades en inteligencia artificial.',
            dia: '15',
            mes: 'FEB',
            tipo: 'Charla'
        },
        {
            id: 2,
            titulo: 'Taller de Arduino Avanzado',
            descripcion: 'Sesión práctica con proyectos de automatización y sensores.',
            dia: '20',
            mes: 'FEB',
            tipo: 'Taller'
        },
        {
            id: 3,
            titulo: 'Presentación de Proyectos de Título',
            descripcion: 'Estudiantes de último año presentan sus proyectos finales de carrera.',
            dia: '25',
            mes: 'FEB',
            tipo: 'Evento'
        },
        {
            id: 4,
            titulo: 'Meetup Desarrolladores Chile',
            descripcion: 'Encuentro de la comunidad de desarrolladores con charlas relámpago.',
            dia: '28',
            mes: 'FEB',
            tipo: 'Comunidad'
        }
    ]);

    constructor(private router: Router) {
        addIcons({
            rocketOutline, newspaperOutline, calendarOutline, timeOutline,
            arrowForwardOutline, arrowBackOutline, sparklesOutline, trophyOutline,
            peopleOutline, bulbOutline, codeSlashOutline, constructOutline,
            schoolOutline, flaskOutline
        });
    }

    ngOnInit() { }

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
