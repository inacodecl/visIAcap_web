import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular/standalone';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-menu',
  templateUrl: './language-menu.component.html',
  styleUrls: ['./language-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class LanguageMenuComponent {
  private popoverCtrl = inject(PopoverController);
  public languageService = inject(LanguageService);

  get languages() {
    return this.languageService.getAvailableLanguages();
  }

  getCurrentLang() {
    return this.languageService.getCurrentLang();
  }

  selectLanguage(code: string) {
    this.languageService.changeLanguage(code);
    this.popoverCtrl.dismiss(code);
    setTimeout(() => window.location.reload(), 150);
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }
}
