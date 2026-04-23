import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  ViewWillEnter, ViewWillLeave, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, logoNodejs, logoReact, logoPython, logoDocker,
  logoAngular, logoIonic, serverOutline, colorPaletteOutline,
  peopleOutline, documentTextOutline, statsChartOutline, globeOutline
} from 'ionicons/icons';
import { HomeFooterComponent } from '../../../components/footers/home-footer/home-footer.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-desarrolladores',
  templateUrl: './desarrolladores.page.html',
  styleUrls: ['./desarrolladores.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, CommonModule, FormsModule,
    IonButtons, IonButton, IonIcon, TranslateModule, HomeFooterComponent,
    RouterModule
  ],
  animations: [
    trigger('extensionAnim', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.85) translateY(15px)',
          transformOrigin: 'top center'
        }),
        animate('400ms 100ms cubic-bezier(0.16, 1, 0.3, 1)', style({
          opacity: 1,
          transform: 'scale(1) translateY(0)'
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'scale(1) translateY(0)',
          transformOrigin: 'top center'
        }),
        animate('250ms cubic-bezier(0.4, 0, 1, 1)', style({
          opacity: 0,
          transform: 'scale(0.85) translateY(10px)'
        }))
      ])
    ])
  ]
})
export class DesarrolladoresPage implements OnInit, ViewWillEnter, ViewWillLeave {

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  // ──────────────────────────────────────────────────────────
  // CONFIGURACIÓN DE TIEMPOS (en milisegundos)
  // ──────────────────────────────────────────────────────────
  readonly TIEMPO_ROTACION_AUTO = 8000;   // Tiempo entre cambios automáticos
  readonly TIEMPO_GRACIA_MANUAL = 15000;  // Tiempo de espera tras interacción manual
  readonly TIEMPO_ANIM_SALIDA = 280;     // Delay interno para esperar la animación de salida
  // ──────────────────────────────────────────────────────────

  selectedIndex: number = 0;
  visibleIndex: number | null = 0;
  private rotationTimeout: any;
  private visibilityTimeout: any;

  developers = [
    {
      id: 'nicolas',
      name: 'Nicolas García',
      role: 'BACKEND SPECIALIST',
      image: '/assets/img/dev-nicolas.png',
      bio: 'Holaaa, me apasiona el mundo de las páginas web y descubrir de forma ingeniosa cómo funcionan las cosas por detrás. Me gusta mucho desarrollarme en el Backend, asegurándome de que todo el sistema interno y los datos trabajen de manera rápida y sin problemas.',
      badges: [
        { name: 'Python', icon: 'logo-python' },
        { name: 'Redis', icon: 'server-outline' },
        { name: 'Docker', icon: 'logo-docker' }
      ]
    },
    {
      id: 'jarod',
      name: 'Jarod Pinto',
      role: 'FULL-STACK',
      image: '/assets/img/dev-jarod.png',
      bio: 'Soy Jarod Pinto me gusta la creación de páginas web y aplicaciones móviles. Me gusta tener una visión completa de cada proyecto, por lo que disfruto mucho desarrollarme tanto en la parte visual como en la lógica interna.',
      badges: [
        { name: 'Node.js', icon: 'logo-nodejs' },
        { name: 'React Native', icon: 'logo-react' },
        { name: 'PostgreSQL', icon: 'server-outline' }
      ]
    },
    {
      id: 'benjamin',
      name: 'Benjamin Gonzalez',
      role: 'FRONTEND SPECIALIST',
      image: '/assets/img/dev-benjamin.png',
      bio: 'Hola que tal, me apasiona crear páginas web y darle vida a las ideas en la pantalla. Disfruto mucho armando la estructura visual y desarrollándome directamente en el Frontend, siempre buscando que nuestros proyectos se vean geniales y sean fáciles de utilizar o navegar.',
      badges: [
        { name: 'Angular', icon: 'logo-angular' },
        { name: 'Ionic', icon: 'logo-ionic' },
        { name: 'UI/UX', icon: 'color-palette-outline' }
      ]
    },
    {
      id: 'lisbeth',
      name: 'Lisbeth Valenzuela',
      role: 'CEO',
      image: '/assets/img/lisbeth.jpg',
      bio: 'Soy Lisbeth Valenzuela, egresada de tecnico en administracion, estudiando la ingeniería de esta misma; gracias a mi carrera logré aprender sobre la gestión de tiempos y organizaciones. Estoy feliz de formar mi profesión en inacap donde se aprende haciendo.',
      badges: [
        { name: 'Análisis', icon: 'stats-chart-outline' },
        { name: 'Gestión', icon: 'people-outline' },
        { name: 'Contenido', icon: 'document-text-outline' }
      ]
    },
    {
      id: 'cesar',
      name: 'Cesar Vilches',
      role: 'CEO',
      image: '/assets/img/cesar.jpg',
      bio: 'Soy César Vilches, titulado en Administración de Empresas. Me enfoco en estrategia, innovación y desarrollo de proyectos, participando en la coordinación de equipos y la integración de distintas ideas. Me gusta aportar con una mirada analítica y orientada a resultados, me caracterizo por ser resiliente y estar en constante mejora.',
      badges: [
        { name: 'Análisis', icon: 'stats-chart-outline' },
        { name: 'Gestión', icon: 'people-outline' },
        { name: 'Contenido', icon: 'document-text-outline' }
      ]
    },
    {
      id: 'victoria',
      name: 'Victoria Rojas',
      role: 'CEO',
      image: '/assets/img/victoria.jpg',
      bio: 'Mi nombre es Victoria Rojas, soy titulada como Técnico de Nivel Superior en Administración de Empresas y actualmente estudiante de Ingeniería en Administración de Empresas. Me apasiona esta área, ya que permite desarrollarse y aportar en distintos ámbitos, tanto personales como organizacionales.',
      badges: [
        { name: 'Campo', icon: 'people-outline' },
        { name: 'Logística', icon: 'document-text-outline' },
        { name: 'Organización', icon: 'stats-chart-outline' }
      ]
    }
  ];

  constructor() {
    addIcons({
      arrowBackOutline, logoNodejs, logoReact, logoPython,
      logoDocker, logoAngular, logoIonic, serverOutline, colorPaletteOutline,
      peopleOutline, documentTextOutline, statsChartOutline, globeOutline
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.selectedIndex = 0;
    this.visibleIndex = 0;
    this.startRotation(this.TIEMPO_ROTACION_AUTO);
  }

  ionViewWillLeave() {
    this.stopRotation();
    if (this.visibilityTimeout) {
      clearTimeout(this.visibilityTimeout);
    }
  }

  /**
   * Cambia la caja inferior de forma secuencial:
   * 1. Oculta la caja actual (dispara :leave)
   * 2. Espera el tiempo de animación definido en TIEMPO_ANIM_SALIDA
   * 3. Muestra la nueva caja (dispara :enter)
   */
  private swapExtensionBox(newIndex: number) {
    if (this.visibilityTimeout) {
      clearTimeout(this.visibilityTimeout);
    }
    this.visibleIndex = null;
    this.visibilityTimeout = setTimeout(() => {
      this.visibleIndex = newIndex;
      this.scrollToActive(newIndex);
    }, this.TIEMPO_ANIM_SALIDA);
  }

  private scrollToActive(index: number) {
    if (!this.carouselContainer) return;
    const container = this.carouselContainer.nativeElement;
    const cards = container.querySelectorAll('.dev-card');
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      const scrollPos = card.offsetLeft - (container.offsetWidth / 2) + (card.offsetWidth / 2);
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }

  startRotation(delay: number) {
    this.stopRotation();
    this.rotationTimeout = setTimeout(() => {
      const newIndex = (this.selectedIndex + 1) % this.developers.length;
      this.selectedIndex = newIndex;
      this.swapExtensionBox(newIndex);
      this.startRotation(this.TIEMPO_ROTACION_AUTO);
    }, delay);
  }

  stopRotation() {
    if (this.rotationTimeout) {
      clearTimeout(this.rotationTimeout);
    }
  }

  selectCard(index: number) {
    if (this.selectedIndex === index) return;
    this.selectedIndex = index;
    this.swapExtensionBox(index);
    this.scrollToActive(index);
    this.startRotation(this.TIEMPO_GRACIA_MANUAL);
  }

}
