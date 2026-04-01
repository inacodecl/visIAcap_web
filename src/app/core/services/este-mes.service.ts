import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { EventoEsteMes } from '../../features/public/futuro/futuro.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EsteMesService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/futuro/este-mes`;

    private _eventos = signal<EventoEsteMes[]>([]);
    public eventos = this._eventos.asReadonly();

    /** Obtiene eventos públicos del mes */
    getAll(locale: string = 'es'): Observable<EventoEsteMes[]> {
        return this.http.get<{ ok: boolean; data: EventoEsteMes[] }>(this.API_URL, { params: { lang: locale } }).pipe(
            map(res => res.data),
            tap(data => this._eventos.set(data))
        );
    }

    /** Obtiene todos (admin) */
    getAllAdmin(locale: string = 'es'): Observable<EventoEsteMes[]> {
        return this.http.get<{ ok: boolean; data: EventoEsteMes[] }>(`${this.API_URL}/admin/list`, { params: { lang: locale } }).pipe(
            map(res => res.data),
            tap(data => this._eventos.set(data))
        );
    }

    /** Obtiene un evento por ID */
    getById(id: number, locale: string = 'es'): Observable<EventoEsteMes> {
        return this.http.get<{ ok: boolean; data: EventoEsteMes }>(`${this.API_URL}/${id}`, { params: { lang: locale } }).pipe(
            map(res => res.data)
        );
    }

    /** Crea un nuevo evento */
    create(evento: Partial<EventoEsteMes>): Observable<{ id: number }> {
        return this.http.post<{ ok: boolean; data: { id: number } }>(this.API_URL, evento).pipe(
            map(res => res.data)
        );
    }

    /** Actualiza un evento */
    update(id: number, changes: Partial<EventoEsteMes>): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, changes);
    }

    /** Elimina un evento */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
            tap(() => this._eventos.update(current => current.filter(e => e.id !== id)))
        );
    }
}
