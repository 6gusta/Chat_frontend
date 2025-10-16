import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProntasServices, MessagemPronta } from '../../app/services/prontas-services';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './config.html',
  styleUrls: ['./config.css']
})
export class Config {

  novaMensagem: string = '';
  mensagensProntas: MessagemPronta[] = [];

  constructor(private prontasService: ProntasServices) {
    this.carregarMensagensProntas();
  }

  carregarMensagensProntas() {
    this.prontasService.listartodas().subscribe({
      next: (res) => this.mensagensProntas = res,
      error: (err) => console.error('Erro ao carregar mensagens:', err)
    });
  }

  adicionarMensagem() {
    const texto = this.novaMensagem.trim();
    if (!texto) return alert("Digite algo antes de adicionar!");

    const nova: MessagemPronta = { texto };
    this.prontasService.adicionarMensagem(nova).subscribe({
      next: (res) => {
        this.mensagensProntas.push(res);
        this.novaMensagem = '';
      },
      error: (err) => console.error('Erro ao adicionar mensagem:', err)
    });
  }

  removerMensagem(msg: MessagemPronta) {
    if (!msg.idmsg) return;

    if (!confirm("Deseja realmente remover esta mensagem?")) return;

    this.prontasService.removerMensagem(msg.idmsg).subscribe({
      next: () => {
        this.mensagensProntas = this.mensagensProntas.filter(m => m.idmsg !== msg.idmsg);
      },
      error: (err) => console.error('Erro ao remover mensagem:', err)
    });
  }
}
