import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Conta, MeService } from '../services/me-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
    standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  
conta?: Conta;
  loading = true;
  error = false;

  constructor(
    private contaService: MeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarConta();
  }

  carregarConta(): void {
    this.contaService.getMinhaConta().subscribe({
      next: (data) => {
        this.conta = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar conta:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

