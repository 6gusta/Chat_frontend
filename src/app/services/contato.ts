import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ContatoModel {
  id?: number;
  nome: string;
  numero: string;
  instancia: string;
}

@Injectable({
  providedIn: 'root'
})
export class Contato {

  private baseUrl = 'http://localhost:8080/contatos';

  constructor(private http: HttpClient) {}

  // ✅ Salvar contato COM instância
  adicionarContato(nome: string, numero: string, instancia: string): Observable<ContatoModel> {
    const contato: ContatoModel = { nome, numero, instancia };
    return this.http.post<ContatoModel>(this.baseUrl, contato);
  }

listarContatosPorInstancia(instancia: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/instancia/${instancia}`);
}


  // (opcional) listar todos
  listarContatos(): Observable<ContatoModel[]> {
    return this.http.get<ContatoModel[]>(this.baseUrl);
  }
}
