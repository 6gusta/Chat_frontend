import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MessagemPronta {
  idmsg?: number;
  texto: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProntasServices {
  // Deve bater com o @RequestMapping do seu controller
  private baseUrl = 'http://localhost:8080/mensagens';

  constructor(private http: HttpClient) {}

  // Lista todas as mensagens prontas
  listartodas(): Observable<MessagemPronta[]> {
    return this.http.get<MessagemPronta[]>(`${this.baseUrl}`);
  }

  // Adiciona nova mensagem pronta
  adicionarMensagem(mensagem: MessagemPronta): Observable<MessagemPronta> {
    return this.http.post<MessagemPronta>(`${this.baseUrl}/cadastrar`, mensagem);
  }

  // Remove mensagem pronta pelo ID
  removerMensagem(idmsg: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/msge/${idmsg}`);
  }
}
