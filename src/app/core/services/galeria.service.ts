import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface GaleriaImage {
    id: number;
    url: string;
    anio: string;
    visible: number;
    order_index: number;
    created_at?: string;
    updated_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class GaleriaService {
    private basePath = environment.apiUrl + '/galeria';

    constructor(private http: HttpClient) {}

    getGaleria(includeHidden = false): Observable<GaleriaImage[]> {
        return this.http.get<{success: boolean, data: GaleriaImage[]}>(`${this.basePath}?includeHidden=${includeHidden}`)
            .pipe(map(response => response.data));
    }

    createImagen(data: Partial<GaleriaImage>): Observable<any> {
        return this.http.post(this.basePath, data);
    }

    updateImagen(id: number, data: Partial<GaleriaImage>): Observable<any> {
        return this.http.put(`${this.basePath}/${id}`, data);
    }

    deleteImagen(id: number): Observable<any> {
        return this.http.delete(`${this.basePath}/${id}`);
    }

    deletePhysicalImage(url: string, folder: string = 'galeria'): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/upload/${folder}`, {
            body: { url }
        });
    }
}
