import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { accessibilityOutline, informationCircleOutline, logInOutline, languageOutline, closeOutline, colorPaletteOutline, codeWorkingOutline } from 'ionicons/icons';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-home-footer',
    templateUrl: './home-footer.component.html',
    styleUrls: ['./home-footer.component.scss'],
    standalone: true,
    imports: [CommonModule, IonIcon, IonButton, TranslateModule]
})
export class HomeFooterComponent implements OnInit {

    private router = inject(Router);
    private actionSheetCtrl = inject(ActionSheetController);
    private languageService = inject(LanguageService);
    private translateService = inject(TranslateService);
    private themeService = inject(ThemeService);

    constructor() {
        addIcons({ accessibilityOutline, informationCircleOutline, logInOutline, languageOutline, closeOutline, colorPaletteOutline, codeWorkingOutline });
    }

    ngOnInit() { }

    async openOptions() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: this.translateService.instant('FOOTER.OPTIONS_HEADER'),
            buttons: [
                {
                    text: this.translateService.instant('FOOTER.ADMIN_ACCESS'),
                    icon: 'log-in-outline',
                    handler: () => {
                        this.router.navigate(['/auth/login']);
                    }
                },
                {
                    text: this.translateService.instant('FOOTER.THEME_TOGGLE'),
                    icon: 'color-palette-outline',
                    handler: () => {
                        this.themeService.toggleTheme();
                    }
                },
                {
                    text: this.translateService.instant('FOOTER.DEVELOPERS'),
                    icon: 'code-working-outline',
                    handler: () => {
                        this.router.navigate(['/desarrolladores']);
                    }
                },
                {
                    text: this.translateService.instant('FOOTER.LANGUAGE'),
                    icon: 'language-outline',
                    handler: () => {
                        setTimeout(() => this.openLanguageSelector(), 300);
                    }
                },
                {
                    text: this.translateService.instant('COMMON.CANCEL'),
                    icon: 'close-outline',
                    role: 'cancel'
                }
            ]
        });

        await actionSheet.present();
    }

    async openLanguageSelector() {
        const languages = this.languageService.getAvailableLanguages();
        const currentLang = this.languageService.getCurrentLang();

        const buttons = languages.map(lang => ({
            text: `${lang.icon} ${lang.label}`,
            cssClass: lang.code === currentLang ? 'action-sheet-selected' : '',
            handler: () => {
                this.languageService.changeLanguage(lang.code);
                window.location.reload();
            }
        }));

        buttons.push({
            text: this.translateService.instant('COMMON.CANCEL'),
            cssClass: 'action-sheet-cancel',
            handler: () => {}
        });

        const actionSheet = await this.actionSheetCtrl.create({
            header: this.translateService.instant('FOOTER.LANGUAGE'),
            buttons
        });

        await actionSheet.present();
    }

}
