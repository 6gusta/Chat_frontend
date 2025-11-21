import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltraProntasPipe } from '../pipes/filtra-prontas-pipe';

@Component({
  selector: 'app-msgeprontafilhos',
  standalone: true,
  imports: [CommonModule, FiltraProntasPipe],
  template: `
    <ul *ngIf="mensagens?.length"> <!-- verifica só se há mensagens -->
      <li *ngFor="let msg of mensagens | filtrarProntas:filtro"
          (click)="selecionar.emit(msg)">
        {{ msg.texto }}
      </li>
    </ul>
  `,
  styleUrls: ['./msgeprontafilhos.css']
})
export class MsgeProntafilhosComponent {
  @Input() mensagens: any[] = [];
  @Input() filtro: string = '';
  @Output() selecionar = new EventEmitter<any>();
}

