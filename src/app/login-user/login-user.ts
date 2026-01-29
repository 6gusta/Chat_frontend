import { Component } from '@angular/core';
import { LoginDTO, LoginService } from '../services/login-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginuserService } from '../services/loginuser-service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.html',
  imports:[ FormsModule,   // para ngModel e ngForm
    CommonModule ],
  styleUrls: ['./login-user.css']
})
export class LoginUserComponent { // <-- sufixo 'Component' recomendado

  nome: string = '';
  senha: string = '';
  erro: string = '';

  constructor(
    private loginService: LoginuserService,
    private router: Router
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
        localStorage.setItem('token', token);
        this.router.navigate(['/chat']); // rota protegida
      },
      error: (err: any) => {
        console.error(err);
        this.erro = err.error || 'Erro ao logar';
      }
    });
  }
}
