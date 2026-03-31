import { Injectable } from '@angular/core';

/**
 * ============================================================
 * ExternalTabService
 * ============================================================
 * Centraliza y controla la apertura de pestañas externas.
 *
 * Características:
 *  - Cooldown de 15s por URL (cada botón tiene su propio timer)
 *  - Si la pestaña ya está abierta, la enfoca en vez de abrir una nueva
 *  - Cierra automáticamente la pestaña después de AUTO_CLOSE_MS
 * ============================================================
 */
@Injectable({
  providedIn: 'root'
})
export class ExternalTabService {

  // ─────────────────────────────────────────────
  // ⚙️  PARÁMETROS CONFIGURABLES
  // Modifica estos valores si necesitas ajustar el comportamiento.
  // ─────────────────────────────────────────────

  /** Tiempo mínimo entre aperturas de la MISMA URL (en milisegundos). */
  private readonly COOLDOWN_MS = 15_000; // 15 segundos

  /**
   * ⏱️ CIERRE AUTOMÁTICO
   * Tiempo en milisegundos antes de cerrar la pestaña automáticamente.
   * Actualmente configurado en 10 minutos.
   * Para cambiarlo: modifica solo el número (ej. 5 * 60_000 = 5 minutos).
   */
  private readonly AUTO_CLOSE_MS = 10 * 60_000; // 10 minutos

  // ─────────────────────────────────────────────
  // Estado interno (no editar)
  // ─────────────────────────────────────────────

  /** Guarda el timestamp del último clic exitoso por URL. */
  private lastClickTimestamp = new Map<string, number>();

  /** Guarda la referencia a cada pestaña abierta por URL. */
  private openedTabRefs = new Map<string, Window>();

  /** Guarda el ID del timer de cierre automático por URL. */
  private autoCloseTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Intenta abrir una URL en una nueva pestaña respetando el cooldown.
   *
   * @param url URL a abrir
   * @returns `{ opened: true }` si se abrió o enfocó la pestaña,
   *          `{ opened: false, remainingMs: number }` si está en cooldown.
   */
  openTab(url: string): { opened: boolean; remainingMs: number } {
    const now = Date.now();
    const lastClick = this.lastClickTimestamp.get(url) ?? 0;
    const elapsed = now - lastClick;
    const remaining = this.COOLDOWN_MS - elapsed;

    // ── Caso 1: Pestaña ya abierta → enfocarla ──────────────────────────
    const existingTab = this.openedTabRefs.get(url);
    if (existingTab && !existingTab.closed) {
      existingTab.focus();
      return { opened: true, remainingMs: 0 };
    }

    // ── Caso 2: Cooldown activo → bloquear ──────────────────────────────
    if (remaining > 0) {
      return { opened: false, remainingMs: remaining };
    }

    // ── Caso 3: Abrir nueva pestaña ─────────────────────────────────────
    const newTab = window.open(url, '_blank');

    if (!newTab) {
      // El navegador bloqueó el popup (bloqueador de popups activo)
      console.warn('[ExternalTabService] El navegador bloqueó la apertura de la pestaña para:', url);
      return { opened: false, remainingMs: 0 };
    }

    // Guardar referencia y registrar timestamp
    this.openedTabRefs.set(url, newTab);
    this.lastClickTimestamp.set(url, now);

    // Limpiar timer anterior si existe (por si se abrió antes)
    const prevTimer = this.autoCloseTimers.get(url);
    if (prevTimer) {
      clearTimeout(prevTimer);
    }

    // Programar cierre automático
    const timer = setTimeout(() => {
      const tab = this.openedTabRefs.get(url);
      if (tab && !tab.closed) {
        tab.close();
      }
      this.openedTabRefs.delete(url);
      this.autoCloseTimers.delete(url);
    }, this.AUTO_CLOSE_MS);

    this.autoCloseTimers.set(url, timer);

    return { opened: true, remainingMs: 0 };
  }

  /**
   * Retorna el tiempo restante de cooldown en milisegundos para una URL.
   * Retorna 0 si no está en cooldown.
   */
  getRemainingCooldown(url: string): number {
    if (!url) return 0;
    const lastClick = this.lastClickTimestamp.get(url) ?? 0;
    const elapsed = Date.now() - lastClick;
    const remaining = this.COOLDOWN_MS - elapsed;
    return remaining > 0 ? remaining : 0;
  }

  /** Retorna true si la URL está actualmente en cooldown. */
  isOnCooldown(url: string): boolean {
    return this.getRemainingCooldown(url) > 0;
  }

  /** Retorna el cooldown configurado en ms (para uso del componente). */
  getCooldownMs(): number {
    return this.COOLDOWN_MS;
  }
}
