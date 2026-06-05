import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MetricaAnalytics {
    ruta: string;
    usuarios_unicos: number;
    vistas_totales: number;
}

export interface ApiResponse<T> {
    ok: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        userMessage: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    constructor() { }

    /**
     * Obtiene las métricas de tráfico (GA4) del panel de administración.
     */
    getMetricas(): Observable<ApiResponse<MetricaAnalytics[]>> {
        return this.http.get<ApiResponse<MetricaAnalytics[]>>(`${this.API_URL}/admin/metricas`);
    }
}
