import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverController, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonButton, IonIcon]
})
export class ThemeSelectorComponent implements OnInit {
  private themeService = inject(ThemeService);
  private popoverCtrl = inject(PopoverController);
  
  initialTheme: 'light' | 'dark' = 'dark';
  currentTheme: 'light' | 'dark' = 'dark';

  constructor() {
    addIcons({ checkmarkOutline, closeOutline });
  }

  ngOnInit() {
    this.initialTheme = this.themeService.isDarkMode() ? 'dark' : 'light';
    this.currentTheme = this.initialTheme;
  }

  onThemeSelect(event: Event) {
    const value = (event.target as HTMLInputElement).value as 'light' | 'dark';
    this.currentTheme = value;
    const wantsDark = value === 'dark';
    if(this.themeService.isDarkMode() !== wantsDark) {
        this.themeService.toggleTheme();
    }
  }

  confirm() {
    this.popoverCtrl.dismiss(this.currentTheme);
  }

  cancel() {
    if (this.currentTheme !== this.initialTheme) {
        this.themeService.toggleTheme();
    }
    this.popoverCtrl.dismiss();
  }
}
