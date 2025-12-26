import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Historia } from '../models/historia.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TimelineService {
    private http = inject(HttpClient);
    // URL base de la API
    private readonly API_URL = environment.apiUrl;

    // Signal para mantener el estado de la lista
    private _historias = signal<Historia[]>([]);
    public historias = this._historias.asReadonly();

    constructor() { }

    /**
     * Obtiene todas las historias.
     * @param locale Idioma
     * @param includeHidden Si es true, envía parametro para intentar traer ocultas (backend dependent)
     */
    getHistorias(locale: string = 'es', includeHidden: boolean = false): Observable<Historia[]> {
        const params: any = { lang: locale };
        if (includeHidden) {
            params.all = 'true'; // Intento de convención estándar
            params.include_hidden = 'true'; // Intento alternativo
        }

        return this.http.get<Historia[]>(`${this.API_URL}/history`, { params }).pipe(
            tap(data => this._historias.set(data))
        );
    }

    getHistoria(id: number): Observable<Historia> {
        return this.http.get<Historia>(`${this.API_URL}/history/${id}`);
    }

    createHistoria(historia: Partial<Historia>): Observable<Historia> {
        return this.http.post<Historia>(`${this.API_URL}/history`, historia).pipe(
            tap(() => this.getHistorias('es', true).subscribe())
        );
    }

    updateHistoria(id: number, changes: Partial<Historia>): Observable<Historia> {
        return this.http.put<Historia>(`${this.API_URL}/history/${id}`, changes).pipe(
            tap(() => this.getHistorias('es', true).subscribe())
        );
    }

    updatePartialHistoria(id: number, changes: Partial<Historia>): Observable<Historia> {
        return this.http.patch<Historia>(`${this.API_URL}/history/${id}`, changes).pipe(
            // Optimistic UI Update: No recargar toda la lista, solo actualizar el item en el signal local
            // Esto evita que "desaparezca" si el backend filtra por visibilidad
            tap(() => {
                this._historias.update(current =>
                    current.map(h => h.id === id ? { ...h, ...changes } : h)
                );
            })
        );
    }

    deleteHistoria(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/history/${id}`).pipe(
            tap(() => {
                this._historias.update(current => current.filter(h => h.id !== id));
            })
        );
    }
}
