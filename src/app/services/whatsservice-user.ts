import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhatsserviceUser {

  private javaApiUrl = 'http://localhost:8080/Usuario';

  constructor(private http: HttpClient) {}

  // Envia mensagem com fromNumber dinâmico e token opcional
  // Envia mensagem com fromNumber dinâmico
  sendMessage(
instance: string, to: string, message: string, fromNumber: string, headers: { headers?: undefined; } | { headers: { Authorization: string; }; }  ): Observable<any> {
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

  getStatus(instance: string): Observable<any> {
    return this.http.get(`${this.javaApiUrl}/status/${instance}`);
  }

  getQrCode(instance: string): Observable<any> {
    return this.http.get(`${this.javaApiUrl}/qrcode/${instance}`);
  }

  disconnect(instance: string): Observable<any> {
    return this.http.post(`${this.javaApiUrl}/disconnect/${instance}`, {});
  }

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