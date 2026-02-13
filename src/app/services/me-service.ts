import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Conta {
  idCadastro: number;
  nome: string;
  email: string;
  role: string;
  empresa: string;
}
@Injectable({
  providedIn: 'root'
})

export class MeService {

    private apiUrl = 'http://localhost:8080/conta';

  constructor(private http: HttpClient) {}

  getMinhaConta(): Observable<Conta> {
    return this.http.get<Conta>(`${this.apiUrl}/me`);
  }

  
}
