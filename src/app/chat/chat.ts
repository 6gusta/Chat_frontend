import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WhatsService } from '../services/whats-service';
import { ProntasServices } from '../services/prontas-services';
import { Contato } from '../services/contato';
import { DisparoService } from '../services/disparo-service';
import { MsgeProntafilhosComponent } from '../msgeprontafilhos/MsgeProntafilhosComponent';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, RouterModule, MsgeProntafilhosComponent],
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

  // CAMPOS DO FORMULÁRIO DE CONTATO
  novoNome: string = '';
  novoNumero: string = '';
  mostraFormularioContato: boolean = false;

  // LISTAS
  mensagens: any[] = [];
  contatosAtuais: any[] = [];   // 🔥 agora usamos só esta para o HTML
  mensagensProntas: any[] = [];
  mostrarProntas: boolean = false;

  modalAberto = false;

  // INSTÂNCIAS
  instancias: any[] = [];
  instanciaSelecionada: string = '';

  limiteInstancia: number = 2;

  // CAMPANHA
  mensagemcampanha: string = '';
  horario: string = '';
  imagemSelecionada: File | null = null;
  novoNumeroCampanha: string = '';
  numerosCampanha: string[] = [];

  constructor(
    private whatsService: WhatsService,
    private prontasService: ProntasServices,
    private contato: Contato,
    private disparoService: DisparoService,
    private router: Router
  ) {}

  // -------------------------------------------
  // INICIALIZAÇÃO
  // -------------------------------------------

  async ngOnInit() {
    try {
      await this.carregarInstancias();
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

  // -------------------------------------------
  // CARREGAR MENSAGENS
  // -------------------------------------------

  loadMessages() {
    if (!this.instanciaSelecionada) return;

    this.whatsService.listarMensagensPorInstancia(this.instanciaSelecionada).subscribe({
      next: msgs => {
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

  // -------------------------------------------
  // CONTATOS — AGORA POR INSTÂNCIA
  // -------------------------------------------

  loadContatos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.contato.listarContatos().subscribe({
        next: res => {
          const instancia = this.instancias.find(i => i.name === this.instanciaSelecionada);
          if (!instancia) return resolve();

          instancia.contatos = res.map((contato: any) => ({
            nome: contato.numero,    // invertidos — você pediu isso
            numero: contato.nome
          }));

          this.contatosAtuais = instancia.contatos;

          console.log(`Contatos carregados (${instancia.name}):`, instancia.contatos);
          resolve();
        },
        error: err => {
          console.error('Erro ao carregar contatos:', err);
          reject(err);
        }
      });
    });
  }

  prepararContato() {
    if (this.selectedConversation) {
      this.novoNumero = this.selectedConversation.fromNumber;
    }
    this.novoNome = '';
    this.mostraFormularioContato = true;
  }

  adicionarContato() {
    if (!this.novoNome.trim() || !this.novoNumero.trim()) {
      alert('Nome e número são obrigatórios!');
      return;
    }

    const instancia = this.instancias.find(i => i.name === this.instanciaSelecionada);
    if (!instancia) return;

    this.contato.adicionarContato(this.novoNome, this.novoNumero).subscribe({
      next: () => {
        instancia.contatos.push({
          nome: this.novoNome,
          numero: this.novoNumero
        });

        this.contatosAtuais = instancia.contatos;

        this.novoNome = '';
        this.novoNumero = '';
        this.mostraFormularioContato = false;

        this.loadMessages();
      },
      error: err => {
        console.error('Erro ao adicionar contato:', err);
      }
    });
  }

  // -------------------------------------------
  // INSTÂNCIAS
  // -------------------------------------------

  carregarInstancias() {
    return new Promise<void>((resolve, reject) => {
      this.whatsService.listarInstancias().subscribe({
        next: (res: string[]) => {
          this.instancias = res.map(i => ({
            name: i,
            number: 'Desconhecido',
            contatos: []             // 🔥 cada instância tem sua agenda
          }));

          if (this.instancias.length > 0) {
            this.instanciaSelecionada = this.instancias[0].name;
          }

          resolve();
        },
        error: err => {
          console.error('Erro ao carregar instâncias:', err);
          reject(err);
        }
      });
    });
  }

  trocaInstancia() {
    console.log('Trocou para:', this.instanciaSelecionada);

    const instancia = this.instancias.find(i => i.name === this.instanciaSelecionada);

    if (instancia) {
      this.meNumber = instancia.number;
      this.contatosAtuais = instancia.contatos;
    }

    this.loadMessages();
  }

  adicionarInstancia() {
    if (this.instancias.length >= this.limiteInstancia) {
      alert('O máximo de instâncias é 2!');
      this.router.navigate(['/planoMensal']);
      return;
    }
  }

  // -------------------------------------------
  // RESTO DO CÓDIGO (MENSAGENS PRONTAS, CAMPANHA ETC.)
  // -------------------------------------------

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
    if (!this.newMessage.trim()) return;
    if (!this.recipient) return;

    const msgObj = {
      fromNumber: this.meNumber,
      body: this.newMessage,
      isMe: true
    };

    if (this.selectedConversation) {
      this.selectedConversation.messages.push(msgObj);
    }

    this.whatsService.sendMessage('T2', this.recipient, this.newMessage, this.meNumber).subscribe();

    this.newMessage = '';
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    } catch {}
  }

  normalizeNumber(num: string): string {
    return num.replace(/\D/g, '');
  }

  getNomeContato(numero: string): string {
    const normalizedNum = this.normalizeNumber(numero);
    const contato = this.contatosAtuais.find(
      c => this.normalizeNumber(c.numero) === normalizedNum
    );
    return contato ? contato.nome : numero;
  }

  // CAMPANHA — deixei igual ao seu
  prepararCampanhateste() {
    this.mensagemcampanha = '';
    this.horario = '';
    this.abrirModal();
  }

  abrirModal() { this.modalAberto = true; }
  fecharModal() { this.modalAberto = false; }

  // ... (restante da campanha igual ao seu código anterior)

}
