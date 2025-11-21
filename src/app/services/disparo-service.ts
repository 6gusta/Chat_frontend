import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Campanha {
  texto: string;
  horario?: string; // null ou string no formato "yyyy-MM-ddTHH:mm:ss"
}

@Injectable({
  providedIn: 'root'
})
export class DisparoService {

  private baseUrl = 'http://localhost:8080/mensagem';

  constructor(private http: HttpClient) {}

  // Método para disparar a campanha
  dispararCampanha(campanha: Campanha): Observable<any> {
    // responseType: 'text' evita erro falso se backend não retornar JSON
    return this.http.post(`${this.baseUrl}/agendar`, campanha, { responseType: 'text' });
  }
}
