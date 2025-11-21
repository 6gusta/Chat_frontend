import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Campanha } from './disparo-service';

@Injectable({
  providedIn: 'root'
})
export class WhatsService {

  private javaApiUrl = 'http://localhost:8080/whatsapp';

  constructor(private http: HttpClient) {}

  // Envia mensagem com fromNumber dinâmico
  sendMessage(
    instance: string,
    to: string,
    message: string,
    fromNumber: string
  ): Observable<any> {
    console.log('Enviando para Java:', { instance, to, message, fromNumber });

    const params = new HttpParams()
      .set('to', to)
      .set('message', message)
      .set('fromNumber', fromNumber);

    return this.http.post(
      `${this.javaApiUrl}/send/${instance}`,
      null, // body vazio
      { params }
    );
  }

  // Obtém status da instância
  getStatus(instance: string): Observable<any> {
    return this.http.get(`${this.javaApiUrl}/status/${instance}`);
  }

  // Obtém o QR code da instância
  getQrCode(instance: string): Observable<any> {
    return this.http.get(`${this.javaApiUrl}/qrcode/${instance}`);
  }

  // Desconecta a instância
  disconnect(instance: string): Observable<any> {
    return this.http.post(`${this.javaApiUrl}/disconnect/${instance}`, {});
  }

  // Obtém histórico de mensagens
  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.javaApiUrl}/messages`);
  }

dispararCampanha(formData: FormData, options?: any) {
  return this.http.post('http://localhost:8080/whatsapp/agendar', formData, options);
}

listarInstancias(): Observable<string[]> {
  return this.http.get<string[]>(`${this.javaApiUrl}/instancias`);
}


listarMensagensPorInstancia(instancia: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.javaApiUrl}/mensagens/${instancia}`);
}



}
