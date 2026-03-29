import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = true; // Default theme we have been using

  constructor() {
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('visiacap_theme');
    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      // Si no hay preferencia temporal, detecta el de sistema (opcional) o asume Oscuro.
      // Por diseño (Totem) asumo oscuro por defecto.
      this.isDark = true;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('visiacap_theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDark) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }

  isDarkMode(): boolean {
    return this.isDark;
  }
}
