import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError, map } from 'rxjs';
import { Usuario, UsuarioRol } from '../models/usuario.model';
import { environment } from '../../environments/environment';

// Interface para la respuesta del login (Mock)
interface LoginResponse {
    token: string;
    user: Usuario;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    // URL base de la API (Simulada o desde environment)
    // En producción esto vendría de environment.apiUrl
    private readonly API_URL = environment.apiUrl;

    // --- State Management con Signals (Angular 17+) ---

    // Signal privado para el estado del usuario actual
    private _currentUser = signal<Usuario | null>(null);

    // Signal de solo lectura para consumo externo
    public currentUser = this._currentUser.asReadonly();

    // Computed signal para saber si está autenticado
    public isAuthenticated = computed(() => !!this._currentUser());

    constructor() {
        this.loadUserFromStorage();
    }

    /**
     * Inicia sesión en el sistema.
     * Realiza una petición POST al backend y actualiza el estado local.
     * @param email Correo electrónico del usuario
     * @param password Contraseña plana (se envía por HTTPS)
     */
    login(email: string, password: string): Observable<boolean> {
        return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, { email, password }).pipe(
            tap(response => {
                if (response.token && response.user) {
                    this.setSession(response.user, response.token);
                }
            }),
            map(response => !!response.token),
            catchError(error => {
                console.error('Error en login:', error);
                return of(false);
            })
        );
    }

    /**
     * Cierra la sesión actual, limpiando estado y almacenamiento local.
     */
    logout(): void {
        this._currentUser.set(null);
        localStorage.removeItem('visiacap_user');
        localStorage.removeItem('visiacap_token');
        // Opcional: Llamar al backend para invalidar token
    }

    /**
     * Verifica si el usuario actual tiene uno de los roles especificados.
     * Útil para AuthGuards.
     * @param roles Array de roles permitidos
     */
    hasRole(roles: UsuarioRol[]): boolean {
        const user = this._currentUser();
        if (!user) return false;
        return roles.includes(user.rol);
    }

    /**
     * Helper rápido para verificar si es administrador o superior.
     */
    get isAdmin(): boolean {
        return this.hasRole([UsuarioRol.SuperAdmin, UsuarioRol.Admin]);
    }

    // --- Métodos Internos ---

    private setSession(user: Usuario, token: string): void {
        this._currentUser.set(user);
        localStorage.setItem('visiacap_user', JSON.stringify(user));
        localStorage.setItem('visiacap_token', token);
    }

    private loadUserFromStorage(): void {
        const storedUser = localStorage.getItem('visiacap_user');
        if (storedUser) {
            try {
                const user: Usuario = JSON.parse(storedUser);
                this._currentUser.set(user);
            } catch (e) {
                console.warn('Error al recuperar sesión:', e);
                this.logout();
            }
        }
    }
}
