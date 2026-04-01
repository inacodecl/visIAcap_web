import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Noticia } from '../../features/public/futuro/futuro.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NoticiasFuturoService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/futuro/noticias`;

    private _noticias = signal<Noticia[]>([]);
    public noticias = this._noticias.asReadonly();

    /** Obtiene noticias públicas */
    getAll(locale: string = 'es'): Observable<Noticia[]> {
        return this.http.get<{ ok: boolean; data: Noticia[] }>(this.API_URL, { params: { lang: locale } }).pipe(
            map(res => res.data),
            tap(data => this._noticias.set(data))
        );
    }

    /** Obtiene todas (admin, incluye borradores) */
    getAllAdmin(locale: string = 'es'): Observable<Noticia[]> {
        return this.http.get<{ ok: boolean; data: Noticia[] }>(`${this.API_URL}/admin/list`, { params: { lang: locale } }).pipe(
            map(res => res.data),
            tap(data => this._noticias.set(data))
        );
    }

    /** Obtiene una noticia por ID */
    getById(id: number, locale: string = 'es'): Observable<Noticia> {
        return this.http.get<{ ok: boolean; data: Noticia }>(`${this.API_URL}/${id}`, { params: { lang: locale } }).pipe(
            map(res => res.data)
        );
    }

    /** Crea una nueva noticia */
    create(noticia: Partial<Noticia>): Observable<{ id: number }> {
        return this.http.post<{ ok: boolean; data: { id: number } }>(this.API_URL, noticia).pipe(
            map(res => res.data)
        );
    }

    /** Actualiza una noticia */
    update(id: number, changes: Partial<Noticia>): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, changes);
    }

    /** Elimina una noticia */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
            tap(() => this._noticias.update(current => current.filter(n => n.id !== id)))
        );
    }
}
