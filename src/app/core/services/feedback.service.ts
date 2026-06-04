import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Feedback {
    id?: number;
    rol: string;
    comentario: string;
    created_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    constructor() { }

    /**
     * Envía una nueva sugerencia de la comunidad (Endpoint Público)
     */
    sendFeedback(rol: string, comentario: string): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/feedbacks`, { rol, comentario });
    }

    /**
     * Obtiene la lista de feedbacks (Endpoint Privado - requiere token admin)
     */
    getFeedbacks(): Observable<{ data: Feedback[] }> {
        return this.http.get<{ data: Feedback[] }>(`${this.API_URL}/feedbacks`);
    }

    /**
     * Elimina una sugerencia por ID (Endpoint Privado - requiere token superadmin/admin)
     */
    deleteFeedback(id: number): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/feedbacks/${id}`);
    }
}
