import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Entrevista } from '../models/entrevista.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EntrevistaService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    // Signal para mantener el estado local y reactivo
    private _entrevistas = signal<Entrevista[]>([]);
    public entrevistas = this._entrevistas.asReadonly();

    constructor() { }

    /**
     * Obtiene la lista pública de entrevistas (solo visibles)
     */
    getEntrevistas(): Observable<Entrevista[]> {
        return this.http.get<Entrevista[]>(`${this.API_URL}/entrevistas`).pipe(
            tap(data => this._entrevistas.set(data))
        );
    }

    /**
     * Obtiene TODAS las entrevistas (Admin)
     */
    getAllEntrevistas(): Observable<Entrevista[]> {
        return this.http.get<Entrevista[]>(`${this.API_URL}/entrevistas/all`);
    }

    getEntrevistaById(id: number): Observable<Entrevista> {
        return this.http.get<Entrevista>(`${this.API_URL}/entrevistas/${id}`);
    }

    createEntrevista(entrevista: Partial<Entrevista>): Observable<Entrevista> {
        return this.http.post<Entrevista>(`${this.API_URL}/entrevistas`, entrevista);
    }

    updateEntrevista(id: number, entrevista: Partial<Entrevista>): Observable<Entrevista> {
        return this.http.put<Entrevista>(`${this.API_URL}/entrevistas/${id}`, entrevista);
    }

    patchEntrevista(id: number, changes: Partial<Entrevista>): Observable<Entrevista> {
        return this.http.patch<Entrevista>(`${this.API_URL}/entrevistas/${id}`, changes);
    }

    deleteEntrevista(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/entrevistas/${id}`);
    }
}
