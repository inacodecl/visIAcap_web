import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProyectoTag, ProyectoCategoria } from '../models/proyecto.model';

@Injectable({
    providedIn: 'root'
})
export class MetadataService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    constructor() { }

    /**
     * Obtiene tags disponibles
     */
    getTags(locale: string = 'es'): Observable<ProyectoTag[]> {
        return this.http.get<ProyectoTag[]>(`${this.API_URL}/metadata/tags`, { params: { lang: locale } });
    }

    /**
     * Obtiene categorías disponibles
     */
    getCategorias(locale: string = 'es'): Observable<ProyectoCategoria[]> {
        return this.http.get<ProyectoCategoria[]>(`${this.API_URL}/metadata/categorias`, { params: { lang: locale } });
    }

    // --- METADATA CREATE / DELETE ---

    createTag(tag: { slug: string, nombre_es: string, nombre_en?: string }): Observable<{ message: string, id: number }> {
        return this.http.post<{ message: string, id: number }>(`${this.API_URL}/metadata/tags`, tag);
    }

    deleteTag(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/metadata/tags/${id}`);
    }

    createCategoria(categoria: { slug: string, nombre_es: string, nombre_en?: string }): Observable<{ message: string, id: number }> {
        return this.http.post<{ message: string, id: number }>(`${this.API_URL}/metadata/categorias`, categoria);
    }

    deleteCategoria(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.API_URL}/metadata/categorias/${id}`);
    }
}
