import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Contato {
   private baseUrl = 'http://localhost:8080/contatos';
     constructor(private http: HttpClient) {}

      adicionarContato(nome: string, numero: string) {
    const contato = { nome, numero };
    return this.http.post(this.baseUrl, contato);
  }
   listarContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.baseUrl);
  }

}
