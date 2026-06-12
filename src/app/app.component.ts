import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, ModalController } from '@ionic/angular/standalone';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FeedbackModalComponent } from './components/modals/feedback-modal/feedback-modal.component';
import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit { 
  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    // Escuchar los query parameters para autodesplegar el modal de feedback
    this.route.queryParams.subscribe(params => {
      if (params['openFeedback'] === 'true') {
        this.openFeedbackModal();
        this.clearQueryParam();
      }
    });

    // Escuchar cambios de ruta para Google Analytics (GTM dataLayer)
    this.router.events.pipe(
      // Filtramos únicamente cuando una navegación haya concluido exitosamente
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Inicializamos el dataLayer de forma segura si no se ha cargado el script de GTM todavía
      const dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer = dataLayer;
      
      // Empujamos el evento de página vista virtual a GTM
      dataLayer.push({
        event: 'page_view',                  // Nombre del evento personalizado
        page_path: event.urlAfterRedirects,  // URL de la ruta (Ej: /contacto)
        page_title: document.title || 'App'  // Título de la pestaña actual
      });
    });
  }

  private async openFeedbackModal() {
    const modal = await this.modalCtrl.create({
      component: FeedbackModalComponent,
      backdropDismiss: true,
      cssClass: 'feedback-modal-popover',
      animated: true,
      mode: 'md'
    });
    await modal.present();
  }

  private clearQueryParam() {
    this.router.navigate([], {
      queryParams: { openFeedback: null },
      queryParamsHandling: 'merge'
    });
  }
}