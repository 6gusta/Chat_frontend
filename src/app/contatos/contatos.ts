import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contato } from '../services/contato';

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contatos.html',
  styleUrls: ['./contatos.css']
})
export class Contatos {

  contatos: any[] = [];
  instanciaSelecionada: string = 'todos';

  constructor(private contatoService: Contato) {}

  ngOnInit() {
    this.buscarContatos();
  }
buscarContatos() {

  // 👉 Se for TODOS ou vazio = lista geral
  if (!this.instanciaSelecionada || 
      this.instanciaSelecionada.trim() === '' || 
      this.instanciaSelecionada === 'todos') {

    this.contatoService.listarContatos().subscribe({
      next: (dados) => {
        this.contatos = dados;
      },
      error: err => {
        console.error('Erro ao listar todos os contatos:', err);
        this.contatos = [];
      }
    });

    return;
  }

  // 👉 Caso tenha instância específica
  const instancia = this.instanciaSelecionada.trim();

  this.contatoService.listarContatosPorInstancia(instancia)
    .subscribe({
      next: (dados) => {
        this.contatos = dados;
      },
      error: err => {
        console.error('Erro ao buscar contatos:', err);
        this.contatos = [];
      }
    });
}

}
