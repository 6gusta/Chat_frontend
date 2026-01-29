import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDTO, LoginService } from '../services/login-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [
    FormsModule,   // para ngModel e ngForm
    CommonModule   // para *ngIf, *ngFor, etc
  ],
  styleUrls: ['./login.css']
})
export class Login {

  nome: string = '';
  senha: string = '';
  erro: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router // <-- para redirecionamento
  ) {}

  onLogin() {
    const loginDTO: LoginDTO = {
      nome: this.nome,
      senha: this.senha
    };

    this.loginService.login(loginDTO).subscribe({
      next: (token: string) => {
        console.log("Login bem-sucedido", token);
        this.erro = '';

        // Salva o token localmente se quiser
        localStorage.setItem('token', token);

        // Redireciona para a rota protegida
        this.router.navigate(['/homeAdmin']); // aqui você coloca sua rota protegida
      },
      error: (err: any) => {
        console.error(err);
        this.erro = err.error || 'Erro ao logar';
      }
    });
  }
}
