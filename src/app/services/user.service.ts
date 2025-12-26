import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

export interface PaginatedUsers {
    total: number;
    data: Usuario[];
    page: number;
    limit: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    constructor() { }

    /**
     * Obtiene lista paginada de usuarios.
     */
    getUsuarios(page: number = 1, limit: number = 10): Observable<PaginatedUsers> {
        let params = new HttpParams()
            .set('page', page)
            .set('limit', limit);

        // El backend podría devolver un array directo o un objeto paginado
        // Ajustaremos según la respuesta real. Asumimos array por ahora si no hay paginación compleja documentada
        // En el README no especifica formato de respuesta paginada exacto, 
        // pero GET /api/usuarios se suele standardizar.
        // Vamos a asumir que devuelve Usuario[] por simplicidad inicial, o ajustar si falla.
        return this.http.get<any>(`${this.API_URL}/usuarios`, { params });
    }

    /**
     * Crea un nuevo usuario (Solo SuperAdmin).
     */
    createUsuario(usuario: Partial<Usuario> & { password?: string }): Observable<Usuario> {
        return this.http.post<Usuario>(`${this.API_URL}/usuarios`, usuario);
    }

    /**
     * Actualización parcial de usuario (Roles, Estado).
     */
    updateUsuario(id: number, changes: Partial<Usuario>): Observable<Usuario> {
        return this.http.patch<Usuario>(`${this.API_URL}/usuarios/${id}`, changes);
    }

    /**
     * Elimina un usuario físicamente.
     */
    deleteUsuario(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/usuarios/${id}`);
    }
}
