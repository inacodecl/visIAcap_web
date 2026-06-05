import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, ModalController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
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

