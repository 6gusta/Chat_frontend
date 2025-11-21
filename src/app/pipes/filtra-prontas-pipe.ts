import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarProntas', 
  standalone: true,   
  pure: false
})
export class FiltraProntasPipe implements PipeTransform {

  transform(mensagens: any[], termo: string): any[] {
    if (!mensagens) return [];
    if (!termo) return mensagens;
    const termoLower = termo.toLowerCase();
    return mensagens.filter(msg =>
      msg.texto.toLowerCase().includes(termoLower)
    );
  }
}
