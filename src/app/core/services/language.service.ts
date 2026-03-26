/**
 * Archivo: core/services/language.service.ts
 * Descripción: Servicio central de idioma. Wrappea TranslateService de @ngx-translate.
 *              Persiste la selección del usuario en localStorage.
 *              Idiomas soportados: Español (es), English (en), Kreyòl Ayisyen (ht).
 */

import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface LanguageOption {
    code: string;
    label: string;
    icon: string;
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private translate = inject(TranslateService);

    private readonly STORAGE_KEY = 'app_lang';
    private readonly DEFAULT_LANG = 'es';

    private readonly languages: LanguageOption[] = [
        { code: 'es', label: 'Español', icon: '🇨🇱' },
        { code: 'en', label: 'English', icon: '🇺🇸' },
        { code: 'ht', label: 'Kreyòl', icon: '🇭🇹' }
    ];

    constructor() {
        const savedLang = localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_LANG;
        this.translate.setDefaultLang(this.DEFAULT_LANG);
        this.translate.addLangs(['es', 'en', 'ht']);
        this.translate.use(savedLang);
    }

    /**
     * Cambia el idioma activo en toda la aplicación.
     * @param lang Código de idioma ('es' | 'en' | 'ht')
     */
    changeLanguage(lang: string): void {
        this.translate.use(lang);
        localStorage.setItem(this.STORAGE_KEY, lang);
    }

    /**
     * Retorna el código del idioma actualmente seleccionado.
     */
    getCurrentLang(): string {
        return this.translate.currentLang || this.DEFAULT_LANG;
    }

    /**
     * Retorna la lista de idiomas disponibles.
     */
    getAvailableLanguages(): LanguageOption[] {
        return this.languages;
    }
}
