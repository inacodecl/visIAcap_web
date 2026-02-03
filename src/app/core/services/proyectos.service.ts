import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Proyecto } from '../models/proyecto.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProyectosService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    // Signal para mantener el estado de la lista
    private _proyectos = signal<Proyecto[]>([]);
    public proyectos = this._proyectos.asReadonly();

    constructor() { }

    /**
     * Obtiene todos los proyectos de tipo 'presente'.
     * @param locale Idioma (es, en)
     */
    getProyectos(locale: string = 'es'): Observable<Proyecto[]> {
        return this.http.get<Proyecto[]>(`${this.API_URL}/proyectos`, { params: { lang: locale } }).pipe(
            tap(data => this._proyectos.set(data))
        );
    }

    /**
     * Obtiene un proyecto por ID.
     * @param id ID del proyecto
     * @param locale Idioma
     */
    getProyecto(id: number, locale: string = 'es'): Observable<Proyecto> {
        return this.http.get<Proyecto>(`${this.API_URL}/proyectos/${id}`, { params: { lang: locale } });
    }

    /**
     * Crea un nuevo proyecto.
     * @param proyecto Datos del proyecto
     */
    createProyecto(proyecto: Partial<Proyecto>): Observable<{ message: string; id: number }> {
        return this.http.post<{ message: string; id: number }>(`${this.API_URL}/proyectos`, proyecto).pipe(
            tap(() => this.getProyectos().subscribe())
        );
    }

    /**
     * Actualiza un proyecto existente.
     * @param id ID del proyecto
     * @param changes Cambios a aplicar
     */
    updateProyecto(id: number, changes: Partial<Proyecto>): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.API_URL}/proyectos/${id}`, changes).pipe(
            tap(() => this.getProyectos().subscribe())
        );
    }

    /**
     * Elimina un proyecto.
     * @param id ID del proyecto
     */
    deleteProyecto(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/proyectos/${id}`).pipe(
            tap(() => {
                this._proyectos.update(current => current.filter(p => p.id !== id));
            })
        );
    }
}
