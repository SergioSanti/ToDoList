import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TarefaService } from '../../services/tarefa';
import { CategoriaService } from '../../services/categoria';
import { AuthService } from '../../services/auth';
import { Tarefa } from '../../models/tarefa.model';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  tarefas = signal<Tarefa[]>([]);
  categorias = signal<Categoria[]>([]);
  isLoading = signal(true);
  
  // Estatísticas
  totalTarefas = signal(0);
  tarefasPendentes = signal(0);
  tarefasConcluidas = signal(0);
  totalCategorias = signal(0);

  constructor(
    private tarefaService: TarefaService,
    private categoriaService: CategoriaService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    
    // Carregar tarefas
    this.tarefaService.getAll().subscribe({
      next: (tarefas) => {
        this.tarefas.set(tarefas);
        this.calculateStats();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.isLoading.set(false);
      }
    });

    // Carregar categorias
    this.categoriaService.getAll().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.totalCategorias.set(categorias.length);
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  calculateStats() {
    const tarefas = this.tarefas();
    this.totalTarefas.set(tarefas.length);
    this.tarefasPendentes.set(tarefas.filter(t => t.status === 'pendente').length);
    this.tarefasConcluidas.set(tarefas.filter(t => t.status === 'concluida').length);
  }

  getTarefasRecentes(): Tarefa[] {
    return this.tarefas()
      .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
      .slice(0, 5);
  }

  getTarefasPorPrioridade(): { [key: string]: number } {
    const tarefas = this.tarefas();
    return {
      alta: tarefas.filter(t => t.prioridade === 'alta').length,
      media: tarefas.filter(t => t.prioridade === 'media').length,
      baixa: tarefas.filter(t => t.prioridade === 'baixa').length
    };
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }

  getCategoriaCor(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.cor : '#6c757d';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getProgressPercentage(): number {
    const total = this.totalTarefas();
    if (total === 0) return 0;
    return Math.round((this.tarefasConcluidas() / total) * 100);
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.nome : 'Usuário';
  }
}
