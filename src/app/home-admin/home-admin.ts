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
  selector: 'app-home-admin',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, RouterModule, MsgeProntafilhosComponent],
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.css']
})
export class HomeAdmin implements AfterViewChecked {

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  meNumber: string = '5561991763642';
  recipient: string = '';
  newMessage: string = '';
  conversations: any[] = [];
  selectedConversation: any = null;
  novoNome: string = '';
  novoNumero: string = '';
  mostraFormularioContato: boolean = false;
  limiteInstancia: number = 2;
  mensagens: any[] = [];

  contatos: any[] = [];
  mensagensProntas: any[] = [];
  mensagensProntasVisiveis: any[] = [];
  mostrarProntas: boolean = false;
  modalAberto = false;

  instanciaSelecionada: string = '';
  instancias: { name: string; number: string }[] = [];

  mensagemcampanha: string = '';
  horario: string = '';
  contatoCampanha: string = '';
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

  /** ===================== MENSAGENS ===================== */
  loadMessages() {
      console.log("Instancia selecionada:", this.instanciaSelecionada);
    if (!this.instanciaSelecionada) return;

  this.whatsService.getMessages()
      .subscribe({
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
            const atualizada = this.conversations.find(c => c.fromNumber === this.selectedConversation.fromNumber);
            if (atualizada) this.selectedConversation = atualizada;
          }
        },
        error: err => console.error('Erro ao carregar mensagens:', err)
      });
  }

  scrollToBottom() {
    try {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    } catch {}
  }

  openConversation(convo: any) {
    this.selectedConversation = convo;
    this.recipient = convo.fromNumber;
    this.scrollToBottom();
  }

  nSendMessage() {
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

   const instance = this.instanciaSelecionada;

    // ⚡ Corrigido: removido 'headers' extra
    this.whatsService
      .sendMessage(instance, this.recipient, this.newMessage, this.meNumber)
      .subscribe({
        next: resp => console.log('Mensagem enviada:', resp),
        error: err => console.error('Erro ao enviar:', err)
      });

    this.newMessage = '';
    this.scrollToBottom();
  }

  /** ===================== CONTATOS ===================== */
  loadContatos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.contato.listarContatos().subscribe({
        next: res => {
          this.contatos = res.map((c: any) => ({ nome: c.numero, numero: c.nome }));
          resolve();
        },
        error: err => reject(err)
      });
    });
  }

  prepararContato() {
    this.novoNumero = this.selectedConversation?.fromNumber || '';
    this.novoNome = '';
    this.mostraFormularioContato = true;
  }

  adicionarContato() {
    if (!this.novoNome.trim() || !this.novoNumero.trim()) return alert('Nome e número obrigatórios!');
    if (!this.instanciaSelecionada) return alert('Selecione uma instância!');
    if (!/^\d{10,13}$/.test(this.novoNumero)) return alert('Número inválido!');

    this.contato.adicionarContato(this.novoNome, this.novoNumero, this.instanciaSelecionada).subscribe({
      next: async () => {
        alert('Contato adicionado com sucesso!');
        this.novoNome = '';
        this.novoNumero = '';
        this.mostraFormularioContato = false;
        await this.loadContatos();
        this.loadMessages();
      },
      error: err => alert('Erro ao adicionar contato.')
    });
  }

  getNomeContato(numero: string): string {
    const normalized = numero.replace(/\D/g, '');
    const contato = this.contatos.find(c => c.numero.replace(/\D/g, '') === normalized);
    return contato ? contato.nome : numero;
  }

  /** ===================== MENSAGENS PRONTAS ===================== */
  carregarMensagensProntas() {
    this.prontasService.listartodas().subscribe({
      next: res => this.mensagensProntas = res,
      error: err => console.error('Erro ao carregar mensagens prontas:', err)
    });
  }

  usarMensagemPronta(msg: any) {
    this.newMessage = msg.texto;
    this.mostrarProntas = false;
  }

  onSelecionar(msg: any) {
    this.newMessage = msg.texto;
  }

  /** ===================== CAMPANHAS ===================== */
  prepararCampanhateste() {
    this.mensagemcampanha = '';
    this.horario = '';
    this.abrirModal();
  }

  abrirModal() { this.modalAberto = true; }
  fecharModal() { this.modalAberto = false; }

  dispararCampanha() {
    if (!this.mensagemcampanha.trim()) return alert('Mensagem é obrigatória!');
    if (this.numerosCampanha.length === 0) return alert('Adicione pelo menos um número!');

    const formData = new FormData();
    formData.append('body', this.mensagemcampanha);
    formData.append('instance', this.instanciaSelecionada);
    formData.append('numeros', JSON.stringify(this.numerosCampanha));
    formData.append('fromNumber', this.meNumber);
    formData.append('horario', this.horario || '');
    if (this.imagemSelecionada) formData.append('image', this.imagemSelecionada);

    this.whatsService.dispararCampanha(formData).subscribe({
      next: () => {
        alert('Campanha disparada com sucesso!');
        this.fecharModal();
        this.numerosCampanha = [];
        this.mensagemcampanha = '';
        this.horario = '';
        this.imagemSelecionada = null;
        this.novoNumeroCampanha = '';
      },
      error: err => alert('Campanha disparada com sucesso!')
    });
  }

  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) this.imagemSelecionada = file;
  }

  adicionarNumero() {
    const numero = this.novoNumeroCampanha.trim();
    if (numero && !this.numerosCampanha.includes(numero)) this.numerosCampanha.push(numero);
    this.novoNumeroCampanha = '';
  }

  removerNumero(index: number) {
    this.numerosCampanha.splice(index, 1);
  }

  lerArquivoContatos(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const linhas = (reader.result as string).split(/\r?\n/).map(l => l.trim()).filter(l => l);
      linhas.forEach(num => { if (!this.numerosCampanha.includes(num)) this.numerosCampanha.push(num); });
    };
    reader.readAsText(file);
  }

  /** ===================== INSTÂNCIAS ===================== */
  async carregarInstancias() {
  return new Promise<void>((resolve, reject) => {
    this.whatsService.listarInstancias().subscribe({
      next: (res: any) => {

        console.log("RESPOSTA INSTANCIAS:", res);

        if (!res || res.length === 0) {
          console.warn("Nenhuma instância encontrada");
          return resolve();
        }

        this.instancias = res.map((i: any) => ({
          name: i.name ?? i,
          number: i.number ?? 'Desconhecido'
        }));

        // define automaticamente a primeira
        this.instanciaSelecionada = this.instancias[0].name;

        console.log("Instancia selecionada:", this.instanciaSelecionada);

        resolve();
      },
      error: err => reject(err)
    });
  });
}

  trocaInstancia() {
    const instancia = this.instancias.find(i => i.name === this.instanciaSelecionada);
    if (instancia) this.meNumber = instancia.number;
    this.loadMessages();
  }

  adicionarInstancia() {
    if (this.instancias.length >= this.limiteInstancia) {
      alert('O máximo de instâncias é 2!');
      this.router.navigate(['/planoMensal']);
    }
  }

  isFullscreen = false;

  toggleChatFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
}