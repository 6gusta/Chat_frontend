import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type InstanceStatus  = 
  "CONNECTED" | "DISCONNECTED" | "QR" | "CONNECTING" | "OFFLINE" | "ERROR";


@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  private baseUrl = 'http://localhost:8080/api/qr';
  private apiUrl = 'http://localhost:8080/whatsapp';

  constructor(private http: HttpClient) {}

  /** Envia QR de uma instância */
  enviaQr(payload: { instancia: string; qr: string }) {
    return this.http.post(`${this.baseUrl}/receber`, payload);
  }

  /** Stream SSE de QR */
  streamQR() {
    return new EventSource(`${this.baseUrl}/stream`);
  }

  /** Lista todas as instâncias com QR */
  listarTodos() {
    return this.http.get(`${this.baseUrl}/listar`);
  }

  /** Busca status da instância */
  getStatus(instance: string): Observable<InstanceStatus> {
    return this.http.get<InstanceStatus>(
      `${this.apiUrl}/status/${instance}`
    );
  }



sincronizarInstancias() {
  return this.http.post<any[]>(
    'http://localhost:8080/api/qr/instancias/salvar',
    {}
  );
}

}
