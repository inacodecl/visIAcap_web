import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, ModalController } from '@ionic/angular/standalone';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FeedbackModalComponent } from './components/modals/feedback-modal/feedback-modal.component';

import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';
import { environment } from '../environments/environment';

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
    private modalCtrl: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Escuchar los query parameters para autodesplegar el modal de feedback
    this.route.queryParams.subscribe(params => {
      if (params['openFeedback'] === 'true') {
        this.openFeedbackModal();
        this.clearQueryParam();
      }
    });

    // Recuperar o generar ID de cliente para Analytics
    let clientId = localStorage.getItem('ga_client_id');
    if (!clientId) {
      clientId = this.generateUUID();
      localStorage.setItem('ga_client_id', clientId);
    }

    // Suscribirse a eventos de navegación para Google Analytics (Proxy Server-Side)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.http.post(`${environment.apiUrl}/admin/track`, {
        ruta: event.urlAfterRedirects,
        client_id: clientId
      }).subscribe({
        next: () => {},
        error: (err) => console.error('[Analytics] Error al enviar tracking:', err)
      });
    });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
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