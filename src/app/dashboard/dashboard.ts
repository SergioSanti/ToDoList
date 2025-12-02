import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TarefasApiService } from '../tarefas-api-service';
import { CategoriaApiService } from '../categoria-api-service';
import { Tarefas } from '../tarefas';
import { Categoria } from '../categoria';

/**
 * COMPONENTE DASHBOARD - PÁGINA PRINCIPAL
 * 
 * Este componente implementa:
 * - Visualização de todas as tarefas (ativas e excluídas)
 * - Estatísticas e resumo das tarefas
 * - Separação entre tarefas ativas e excluídas
 * - Relacionamento com Categorias
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  // Signals para dados reativos
  todasTarefas = signal<Tarefas[]>([]);
  tarefasAtivas = signal<Tarefas[]>([]);
  tarefasExcluidas = signal<Tarefas[]>([]);
  categorias = signal<Categoria[]>([]);
  
  // Estatísticas
  totalTarefas = signal<number>(0);
  totalAtivas = signal<number>(0);
  totalExcluidas = signal<number>(0);
  totalConcluidas = signal<number>(0);
  totalPendentes = signal<number>(0);

  // Injeção de dependências
  private tarefasApiService = inject(TarefasApiService);
  private categoriaApiService = inject(CategoriaApiService);

  ngOnInit() {
    this.carregarDados();
  }

  /**
   * Carrega todos os dados do dashboard
   */
  carregarDados() {
    // Carrega todas as tarefas (incluindo excluídas)
    this.tarefasApiService.listarTodas().subscribe((tarefas) => {
      this.todasTarefas.set(tarefas);
      
      // Separa tarefas ativas e excluídas
      const ativas = tarefas.filter(t => !t.excluida);
      const excluidas = tarefas.filter(t => t.excluida);
      
      this.tarefasAtivas.set(ativas);
      this.tarefasExcluidas.set(excluidas);
      
      // Calcula estatísticas
      this.totalTarefas.set(tarefas.length);
      this.totalAtivas.set(ativas.length);
      this.totalExcluidas.set(excluidas.length);
      this.totalConcluidas.set(ativas.filter(t => t.concluida).length);
      this.totalPendentes.set(ativas.filter(t => !t.concluida).length);
    });

    // Carrega categorias para relacionamento
    this.categoriaApiService.listar().subscribe((categorias) => {
      this.categorias.set(categorias);
    });
  }

  /**
   * Busca nome da categoria pelo ID
   * RELACIONAMENTO: Tarefas → Categorias
   */
  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }

  /**
   * Restaura tarefa excluída
   */
  restaurarTarefa(id: number) {
    if (confirm('Deseja restaurar esta tarefa?')) {
      this.tarefasApiService.restaurar(id).subscribe(() => {
        this.carregarDados();
      });
    }
  }

  /**
   * Busca cor da categoria pelo ID
   * RELACIONAMENTO: Tarefas → Categorias
   */
  getCategoriaCor(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.cor : '#6c757d';
  }

  /**
   * Calcula cor de contraste para texto
   * FUNCIONALIDADE DE NEGÓCIO: Calcula se deve usar texto branco ou preto
   */
  getContrastColor(hexColor: string): string {
    const color = hexColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  /**
   * Obtém classe CSS para prioridade
   */
  getPrioridadeClass(prioridade: number): string {
    if (prioridade >= 4) return 'badge bg-danger';
    if (prioridade >= 3) return 'badge bg-warning';
    if (prioridade === 2) return 'badge bg-info';
    return 'badge bg-success';
  }
}

