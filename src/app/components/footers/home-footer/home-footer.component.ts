import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { ActionSheetController, PopoverController } from '@ionic/angular/standalone';
import { ThemeSelectorComponent } from '../../theme-selector/theme-selector.component';
import { SystemMenuComponent } from '../../menus/system-menu/system-menu.component';
import { LanguageMenuComponent } from '../../menus/language-menu/language-menu.component';
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
    imports: [CommonModule, IonIcon, TranslateModule]
})
export class HomeFooterComponent implements OnInit {

    private router = inject(Router);
    private actionSheetCtrl = inject(ActionSheetController);
    private popoverCtrl = inject(PopoverController);
    private languageService = inject(LanguageService);
    private translateService = inject(TranslateService);
    private themeService = inject(ThemeService);

    constructor() {
        addIcons({ accessibilityOutline, informationCircleOutline, logInOutline, languageOutline, closeOutline, colorPaletteOutline, codeWorkingOutline });
    }

    adminClickCount = 0;
    adminClickTimer: any;

    ngOnInit() { }

    goToDevelopers() {
        this.router.navigate(['/desarrolladores']);
    }

    onSecretClick() {
        this.adminClickCount++;
        clearTimeout(this.adminClickTimer);
        
        if (this.adminClickCount >= 5) {
            this.adminClickCount = 0;
            // Redirige al acceso administrativo de forma secreta
            this.router.navigate(['/auth/login']);
        } else {
            // Reinicia el contador si pausan más de 1 segundo
            this.adminClickTimer = setTimeout(() => {
                this.adminClickCount = 0;
            }, 1000);
        }
    }

    async openOptions(event?: Event) {
        const popover = await this.popoverCtrl.create({
            component: SystemMenuComponent,
            event: event,
            backdropDismiss: true,
            cssClass: 'system-menu-popover',
            translucent: true,
            animated: true,
            alignment: 'start', // Align relative to the click
            side: 'top',
        });
        
        popover.onDidDismiss().then((data) => {
            if (!data.data) return;
            const action = data.data;
            if (action === 'theme') {
                setTimeout(() => this.openThemeSelector(), 250);
            } else if (action === 'language') {
                setTimeout(() => this.openLanguageSelector(), 250);
            } else if (action === 'developers') {
                this.goToDevelopers();
            }
        });

        await popover.present();
    }

    async openLanguageSelector() {
        const popover = await this.popoverCtrl.create({
            component: LanguageMenuComponent,
            backdropDismiss: true,
            cssClass: 'system-menu-popover',
            translucent: true,
            animated: true
        });
        await popover.present();
    }

    async openThemeSelector() {
        const popover = await this.popoverCtrl.create({
            component: ThemeSelectorComponent,
            backdropDismiss: true,
            cssClass: 'system-menu-popover',
            translucent: true,
            animated: true
        });
        await popover.present();
    }
}
