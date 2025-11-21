import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plano-canal',
  imports: [],
  templateUrl: './plano-canal.html',
  styleUrl: './plano-canal.css'
})
export class PlanoCanal {

    constructor(private router: Router) {}


    comprarPlano() {
    alert('Plano adquirido com sucesso! Agora você pode adicionar mais uma instância 🚀');
    // Aqui você pode redirecionar de volta para o componente do chat
    this.router.navigate(['/chat']);
  }

  voltar() {
    this.router.navigate(['/chat']);
  }

}
