import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface LoginDTO {
  nome: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = 'http://localhost:8080/loginadmin';
 

  constructor(private http: HttpClient) {}

  login(loginDTO: LoginDTO): Observable<string> {
    return this.http.post(`${this.baseUrl}/login`, loginDTO, { responseType: 'text' })
      .pipe(
        map((token: string) => {
          localStorage.setItem('jwtToken', token);
          return token;
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  private handleError(error: HttpErrorResponse) {
    let mensagem = 'Erro desconhecido';

    if (error.status === 401) {
      mensagem = error.error; 
    } else if (error.status === 0) {
      mensagem = 'Servidor não está respondendo';
    }

    return throwError(() => new Error(mensagem));
  }
}
