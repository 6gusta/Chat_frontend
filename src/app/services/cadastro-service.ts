import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Cadastro {
  nome: string;
  email: string;
  senha: string;
  role: string;        
  empresa?: string;     
}
@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private apiUrl = 'http://localhost:8080/Cadastro/Registro';

   constructor(private http: HttpClient) { }

   cadastrarUsuario(cadastro: Cadastro): Observable<Cadastro>{
    return this.http.post<Cadastro>(this.apiUrl, cadastro)
   }
  
}
