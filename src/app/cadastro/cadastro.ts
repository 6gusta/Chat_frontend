import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService, Cadastro as CadastroModel } from '../services/cadastro-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
  standalone: true,  
  styleUrls: ['./cadastro.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class Cadastro {

  cadastroForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  roles = ['USER', 'ADMIN']; // opções do select de role

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      empresa: [''],
      role: ['USER', Validators.required] // <- valor padrão e obrigatório
    });
  }

  cadastrar() {
    if (this.cadastroForm.invalid) {
      this.errorMessage = 'Preencha todos os campos corretamente!';
      return;
    }

    if (this.cadastroForm.value.senha !== this.cadastroForm.value.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    const cadastro: CadastroModel = {
      nome: this.cadastroForm.value.nome,
      email: this.cadastroForm.value.email,
      senha: this.cadastroForm.value.senha,
      empresa: this.cadastroForm.value.empresa,
      role: this.cadastroForm.value.role
    };

    this.cadastroService.cadastrarUsuario(cadastro).subscribe({
      next: (res) => {
        this.successMessage = 'Cadastro realizado com sucesso!';
        this.cadastroForm.reset({ role: 'USER' }); // reseta e mantém role default
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao cadastrar. Tente novamente.';
        this.loading = false;
      }
    });
  }

}
