import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WhatsService } from '../services/whats-service';
import { ProntasServices } from '../services/prontas-services';
import { Contato } from '../services/contato';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chats implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  meNumber: string = '5561991763642';
  recipient: string = '';
  newMessage: string = '';
  conversations: any[] = [];
  selectedConversation: any = null;
  novoNome: string = '';
  novoNumero: string = '';
  mostraFormularioContato: boolean = false;

  contatos: any[] = [];

  mensagensProntas: any[] = [];
  mensagensProntasVisiveis: any[] = [];
  mostrarProntas: boolean = false;

  constructor(
    private whatsService: WhatsService,
    private prontasService: ProntasServices,
    private contato: Contato
  ) {}

  async ngOnInit() {
    try {
      await this.loadContatos();
      this.loadMessages();
      this.carregarMensagensProntas();
      setInterval(() => this.loadMessages(), 5000);
    } catch (err) {
      console.error('Erro na inicialização:', err);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages() {
    this.whatsService.getMessages().subscribe({
      next: msgs => {
        console.log('Contatos no loadMessages:', this.contatos);
        const grouped: any = {};

        msgs.forEach((msg: any) => {
          msg.isMe = msg.fromNumber === this.meNumber;
          const convoNumber = msg.isMe ? msg.toNumber : msg.fromNumber;

          if (!grouped[convoNumber]) grouped[convoNumber] = [];
          grouped[convoNumber].push(msg);
        });

        this.conversations = Object.keys(grouped).map(key => ({
          fromNumber: key,
          messages: grouped[key],
          nome: this.getNomeContato(key)
        }));

        if (this.selectedConversation) {
          const atualizada = this.conversations.find(
            c => c.fromNumber === this.selectedConversation.fromNumber
          );
          if (atualizada) this.selectedConversation = atualizada;
        }
      },
      error: err => console.error('Erro ao carregar mensagens:', err)
    });
  }

  carregarMensagensProntas() {
    this.prontasService.listartodas().subscribe({
      next: res => (this.mensagensProntas = res),
      error: err => console.error('Erro ao carregar mensagens prontas:', err)
    });
  }

  loadContatos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.contato.listarContatos().subscribe({
        next: res => {
          // Aqui corrigimos invertendo nome e número
          this.contatos = res.map((contato: any) => ({
            nome: contato.numero,   // passa o que estava no numero para nome
            numero: contato.nome    // passa o que estava no nome para numero
          }));
          console.log('Contatos carregados (corrigidos):', this.contatos);
          resolve();
        },
        error: err => {
          console.error('Erro ao carregar contatos:', err);
          reject(err);
        }
      });
    });
  }

  onInputChange() {
    if (this.newMessage.startsWith('/')) {
      const query = this.newMessage.slice(1).toLowerCase();
      this.mensagensProntasVisiveis = this.mensagensProntas.filter(msg =>
        msg.texto.toLowerCase().includes(query)
      );
      this.mostrarProntas = this.mensagensProntasVisiveis.length > 0;
    } else {
      this.mostrarProntas = false;
    }
  }

  usarMensagemPronta(msg: any) {
    this.newMessage = msg.texto;
    this.mostrarProntas = false;
  }

  openConversation(convo: any) {
    this.selectedConversation = convo;
    this.recipient = convo.fromNumber;
    this.scrollToBottom();
  }

  onSendMessage() {
    if (!this.newMessage.trim()) return alert('Digite uma mensagem antes de enviar!');
    if (!this.recipient) return alert('Número do destinatário não está definido!');

    const msgObj = {
      fromNumber: this.meNumber,
      body: this.newMessage,
      isMe: true
    };

    if (this.selectedConversation) {
      this.selectedConversation.messages.push(msgObj);
    }

    const instance = 'T2';

    this.whatsService
      .sendMessage(instance, this.recipient, this.newMessage, this.meNumber)
      .subscribe({
        next: resp => console.log('Mensagem enviada:', resp),
        error: err => console.error('Erro ao enviar:', err)
      });

    this.newMessage = '';
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {}
  }

  prepararContato() {
    if (this.selectedConversation) {
      this.novoNumero = this.selectedConversation.fromNumber;
    } else {
      this.novoNumero = '';
    }
    this.novoNome = '';
    this.mostraFormularioContato = true;
  }

  adicionarContato() {
    if (!this.novoNome.trim() || !this.novoNumero.trim()) {
      alert('Nome e número são obrigatórios!');
      return;
    }

    if (!/^\d{10,13}$/.test(this.novoNumero)) {
      alert('Número inválido! Use apenas números com DDD. Ex: 61999999999');
      return;
    }

    this.contato.adicionarContato(this.novoNome, this.novoNumero).subscribe({
      next: async res => {
        alert('Contato adicionado com sucesso!');
        this.novoNome = '';
        this.novoNumero = '';
        this.mostraFormularioContato = false;

        try {
          await this.loadContatos();
          this.loadMessages();
        } catch (err) {
          console.error('Erro ao atualizar contatos e mensagens:', err);
        }
      },
      error: err => {
        console.error('Erro ao adicionar contato:', err);
        alert('Erro ao adicionar contato.');
      }
    });
  }

  normalizeNumber(num: string): string {
    return num.replace(/\D/g, '');
  }

  getNomeContato(numero: string): string {
    const normalizedNum = this.normalizeNumber(numero);
    const contato = this.contatos.find(c => this.normalizeNumber(c.numero) === normalizedNum);
    return contato ? contato.nome : numero;
  }
}
