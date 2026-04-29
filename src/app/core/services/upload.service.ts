import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Sube una imagen al servidor reportando el progreso.
   * @param file Archivo de imagen a subir
   * @param folder Carpeta de destino ('hitos', 'entrevistas', etc)
   */
  uploadImage(file: File, folder: string = 'hitos'): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<any>(`${this.apiUrl}/upload/${folder}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Elimina una imagen huérfana del servidor.
   * @param url Ruta de la imagen a eliminar
   * @param folder Carpeta (opcional, aunque el endpoint recibe el folder en la ruta, 
   * el backend en deleteImage solo lee el url del body, pero actualizamos a :folder por consistencia)
   */
  deleteImage(url: string, folder: string = 'hitos'): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/upload/${folder}`, { body: { url } });
  }
}
