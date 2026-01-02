import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceStatus, QrCodeService } from '../services/qr-code-service';

interface Instancia {
  nome: string;
  qr: string | null;
  status: InstanceStatus;
    aberto?: boolean;
}

@Component({
  selector: 'app-canal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canal.html',
  styleUrls: ['./canal.css']
})
export class CanalComponent implements OnInit, OnDestroy {

  instancias: Instancia[] = [];
  instanceName = '';
  status?: InstanceStatus;
  loading = false;
  error = false;

  private statusInterval?: number;

  constructor(private qrService: QrCodeService) {}

  // =====================
  // CICLO DE VIDA
  // =====================
  ngOnInit(): void {
    // 🔥 Fonte principal: banco
    this.sincronizarInstanciasBanco();

    // 🔁 QR em tempo real
    this.ouvirQrEmTempoReal();

    // 🔄 Atualização periódica de status
    this.statusInterval = window.setInterval(() => {
      this.instancias.forEach(inst => this.atualizarStatus(inst));
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }

  // =====================
  // STATUS
  // =====================
  atualizarStatus(inst: Instancia) {
    this.qrService.getStatus(inst.nome).subscribe({
      next: status => inst.status = status,
      error: () => inst.status = 'OFFLINE'
    });
  }

  consultarStatus() {
    if (!this.instanceName) return;

    this.loading = true;
    this.error = false;
    this.status = undefined;

    this.qrService.getStatus(this.instanceName).subscribe({
      next: status => {
        this.status = status;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  // =====================
  // QR EM TEMPO REAL (SSE)
  // =====================
  ouvirQrEmTempoReal() {
    const eventSource = this.qrService.streamQR();

    eventSource.addEventListener('qr-update', (event: any) => {
      const data = JSON.parse(event.data);
      const nome = data.instancia;
      const qr = `data:image/png;base64,${data.qr}`;

      const inst = this.instancias.find(i => i.nome === nome);
      if (inst) {
        inst.qr = qr;
      } else {
        this.instancias.push({
          nome,
          qr,
          status: 'DISCONNECTED'
        });
      }
    });
  }

  // =====================
  // GERAR QR
  // =====================
  gerarQr(nomeInstancia: string) {
    this.qrService.enviaQr({
      instancia: nomeInstancia,
      qr: 'TESTE_QR_BASE64'
    }).subscribe();
  }

  // =====================
  // SINCRONIZAR COM BACKEND
  // =====================
  sincronizarInstanciasBanco() {
    this.qrService.sincronizarInstancias().subscribe({
      next: (resp) => {
        this.instancias = resp.map(inst => ({
          nome: inst.name,
          qr: null,
          status: inst.status ?? 'DISCONNECTED'
        }));

        this.instancias.forEach(inst => this.atualizarStatus(inst));
      },
      error: err => {
        console.error('Erro ao sincronizar instâncias', err);
      }
    });
  }

  // =====================
  // TRADUÇÃO STATUS
  // =====================
  traduzStatus(status: InstanceStatus | 'ERROR'): string {
    switch(status) {
      case 'CONNECTED': return 'Conectado';
      case 'DISCONNECTED': return 'Desconectado';
      case 'OFFLINE': return 'Offline';
      case 'ERROR': return 'Erro';
      default: return 'Desconhecido';
    }
  }
  trackByNome(index: number, inst: Instancia) {
  return inst.nome;
}

}
