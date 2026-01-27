import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Cambiar esta URL 
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  // --- Ejemplo de métodos genéricos ---

  getUsuarios(): Observable<any> {
    console.log('Obteniendo usuarios...');
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  // Obtener todos los proyectos (Presente o Futuro)
  getProyectos(tipo: 'presente' | 'futuro'): Observable<any> {
    return this.http.get(`${this.apiUrl}/proyectos?tipo=${tipo}`);
  }

  // Obtener la línea de tiempo
  getHistoria(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historia`);
  }

  // Autenticación (Login)
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Método auxiliar para headers con token (para el Admin)
  private getAuthHeaders() {
    const token = localStorage.getItem('token'); // Asumiendo que guardas el JWT ahí
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
}