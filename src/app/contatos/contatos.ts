import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Contato } from '../services/contato'; // Ajuste o caminho pro seu serviço

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contatos.html',
  styleUrls: ['./contatos.css']
})
export class Contatos {
  contatos: any[] = [];

  constructor(private contatoService: Contato) {}

  async ngOnInit() {
    await this.loadContatos();
  }

  loadContatos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.contatoService.listarContatos().subscribe({
        next: (res: any[]) => {
          this.contatos = res; // Já assume que 'res' é array com nome e numero
          resolve();
        },
        error: (err: any) => {
          console.error('Erro ao carregar contatos:', err);
          reject(err);
        }
      });
    });
  }
}
