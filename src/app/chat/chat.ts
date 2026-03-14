import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WhatsService } from '../services/whats-service';
import { ProntasServices } from '../services/prontas-services';
import { Contato } from '../services/contato';
import { DisparoService  } from '../services/disparo-service';
import { FiltraProntasPipe } from '../pipes/filtra-prontas-pipe';
import { MsgeProntafilhosComponent } from '../msgeprontafilhos/MsgeProntafilhosComponent';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, RouterModule,MsgeProntafilhosComponent],
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
  limiteInstancia: number = 2;
  mensagens: any[] = [];



  contatos: any[] = [];

  mensagensProntas: any[] = [];
  mensagensProntasVisiveis: any[] = [];
  mostrarProntas: boolean = false;
    modalAberto = false;
    instanciass: any[] = [];
instanciaSelecionadass: string = '';
instancias = [
  { name: 'Instância 1', number: '61999999999' },
  { name: 'Instância 2', number: '62988888888' },
  { name: 'Instância 3', number: '11977777777' }
];

instanciaSelecionada = this.instancias[0].name;
  mensagemcampanha: string = '';
  horario: string = '';
  contatoCampanha: string = '';
  imagemSelecionada: File | null = null; 
  novoNumeroCampanha: string = '';

// lista de números para a campanha
numerosCampanha: string[] = [];


  constructor(
    private whatsService: WhatsService,
    private prontasService: ProntasServices,
    private contato: Contato,
    private disparoService: DisparoService ,
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

  loadMessages() {

  if (!this.instanciaSelecionada) return;

  this.whatsService.listarMensagensPorInstancia(this.instanciaSelecionada)
    .subscribe({
      next: msgs => {
        console.log('Mensagens:', msgs);

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
    next: res => {
      this.mensagensProntas = res;
      console.log('Mensagens prontas carregadas:', this.mensagensProntas);
    },
    error: err => console.error('Erro ao carregar mensagens prontas:', err)
  });
}

private getTokenHeader() {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return { headers: { Authorization: `Bearer ${token}` } };
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

   const headers = this.getTokenHeader();

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

  if (!this.instanciaSelecionada) {
    alert('Selecione uma instância!');
    return;
  }

  if (!/^\d{10,13}$/.test(this.novoNumero)) {
    alert('Número inválido! Use apenas números com DDD.');
    return;
  }

  this.contato.adicionarContato(
    this.novoNome,
    this.novoNumero,
    this.instanciaSelecionada   // ✅ AQUI ESTÁ A MÁGICA
  ).subscribe({
    next: async () => {
      alert('Contato adicionado com sucesso!');
      this.novoNome = '';
      this.novoNumero = '';
      this.mostraFormularioContato = false;

      await this.loadContatos();
      this.loadMessages();
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

// Abre modal para definir mensagem e horário
prepararCampanhateste() {
  this.mensagemcampanha = ''; // limpa a mensagem
  this.horario = '';          // limpa o horário
  this.abrirModal();
}

// Fecha modal
abrirModal() {
  this.modalAberto = true;
}

fecharModal() {
  this.modalAberto = false;
}

dispararCampanha() {
  if (!this.mensagemcampanha.trim()) {
    alert('Mensagem é obrigatória!');
    return;
  }

  if (this.numerosCampanha.length === 0) {
    alert('Adicione pelo menos um número para disparar!');
    return;
  }

  // Cria o corpo da requisição como FormData (suporta texto + arquivo)
  const formData = new FormData();
  formData.append('body', this.mensagemcampanha);
  formData.append('numeros', JSON.stringify(this.numerosCampanha)); // lista de números
  formData.append('fromNumber', '5561991763642');
  formData.append('horario', this.horario || '');

  // Se o usuário selecionou uma imagem, adiciona ao FormData
  if (this.imagemSelecionada) {
    formData.append('image', this.imagemSelecionada);
  }

  // Envia para o backend
  this.whatsService.dispararCampanha(formData).subscribe({
    next: res => {
      console.log('Campanha disparada:', res);
      alert('Campanha disparada com sucesso!');
      this.fecharModal();

      // Limpar campos
      this.numerosCampanha = [];
      this.mensagemcampanha = '';
      this.horario = '';
      this.imagemSelecionada = null;
      this.novoNumeroCampanha = '';
    },
    error: err => {
      console.error('Erro ao disparar campanha:', err);
      alert('Erro ao disparar campanha. Veja console.');
    }
  });
}


onImagemSelecionada(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.imagemSelecionada = file;
    console.log('Imagem selecionada:', file.name);
  }
}

adicionarNumero() {
  const numero = this.novoNumeroCampanha.trim();
  if (numero && !this.numerosCampanha.includes(numero)) {
    this.numerosCampanha.push(numero);
    this.novoNumeroCampanha = '';
  }
}

// remove um número da lista
removerNumero(index: number) {
  this.numerosCampanha.splice(index, 1);
}

onSelecionar(msg: any) {
  console.log('Mensagem selecionada:', msg);
  this.newMessage = msg.texto; // opcional: coloca no input
}
// Antes: erArquivoContatos(event: any) { ... }

// Depois:
lerArquivoContatos(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result as string;
    // Separar linhas e limpar espaços
    const linhas = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');

    // Adiciona à lista de contatos da campanha, evitando duplicados
    linhas.forEach(num => {
      if (!this.numerosCampanha.includes(num)) {
        this.numerosCampanha.push(num);
      }
    });
  };
  reader.readAsText(file);
}

carregarInstancias() {
  return new Promise<void>((resolve, reject) => {

    this.whatsService.listarInstancias().subscribe({
      next: (res: string[]) => {
        this.instancias = res.map(i => ({
          name: i,
          number: 'Desconhecido' // Ajusta depois se quiser
        }));

        // se tiver pelo menos uma instância
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
trocaInstancias(){
  const instancia = this.instancias.find(i => i.name === this.instanciaSelecionada)

  if(instancia){
    this.meNumber = instancia.number;
    console.log('Trocou para instância:', instancia);
    this.loadMessages();
    
  }
}

trocaInstancia() {
  console.log('Trocou para:', this.instanciaSelecionada);

  const instancia = this.instancias.find(i => i.name === this.instanciaSelecionada);

  if (instancia) {
    this.meNumber = instancia.number;
  }

  this.loadMessages(); // 🔥 AGORA SIM TROCA A INSTÂNCIA NAS MENSAGENS
}


adicionarInstancia() {
  console.log('Função de adicionar instância chamada');
  if (this.instancias.length >= this.limiteInstancia) {
    alert("O máximo de instâncias é 2!");
      this.router.navigate(['/planoMensal']);
    return;
  }
}
carregarMensagens() {
  if (!this.instanciaSelecionada) return;

  this.whatsService.listarMensagensPorInstancia(this.instanciaSelecionada)
    .subscribe({
      next: (mensagens) => {
        this.mensagens = mensagens;
      },
      error: err => console.error('Erro ao carregar mensagens:', err)
    });
}

}
