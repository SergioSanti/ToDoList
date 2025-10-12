import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TarefaService } from '../../../services/tarefa';
import { CategoriaService } from '../../../services/categoria';
import { Tarefa } from '../../../models/tarefa.model';
import { Categoria } from '../../../models/categoria.model';
import { FiltroTarefaPipe } from '../../../pipes/filtro-tarefa-pipe';

@Component({
  selector: 'app-tarefa-list',
  imports: [CommonModule, RouterModule, FormsModule, FiltroTarefaPipe],
  templateUrl: './tarefa-list.html',
  styleUrl: './tarefa-list.css'
})
export class TarefaList implements OnInit {
  tarefas = signal<Tarefa[]>([]);
  categorias = signal<Categoria[]>([]);
  isLoading = signal(true);
  
  // Filtros
  filtros = signal({
    status: 'todas' as 'pendente' | 'concluida' | 'todas',
    prioridade: 'todas' as 'baixa' | 'media' | 'alta' | 'todas',
    categoriaId: 0,
    termo: ''
  });

  constructor(
    private tarefaService: TarefaService,
    private categoriaService: CategoriaService
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
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  toggleStatus(tarefa: Tarefa) {
    this.tarefaService.toggleStatus(tarefa.id).subscribe({
      next: (tarefaAtualizada) => {
        this.loadData(); // Recarregar lista
      },
      error: (error) => {
        console.error('Erro ao alterar status:', error);
      }
    });
  }

  deleteTarefa(tarefa: Tarefa) {
    if (confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"?`)) {
      this.tarefaService.delete(tarefa.id).subscribe({
        next: () => {
          this.loadData(); // Recarregar lista
        },
        error: (error) => {
          console.error('Erro ao excluir tarefa:', error);
        }
      });
    }
  }

  updateFiltro(filtro: string, valor: any) {
    this.filtros.update(filtros => ({
      ...filtros,
      [filtro]: valor
    }));
  }

  limparFiltros() {
    this.filtros.set({
      status: 'todas',
      prioridade: 'todas',
      categoriaId: 0,
      termo: ''
    });
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

  getPrioridadeLabel(prioridade: string): string {
    const labels: { [key: string]: string } = {
      'alta': 'Alta',
      'media': 'Média',
      'baixa': 'Baixa'
    };
    return labels[prioridade] || prioridade;
  }

  getPrioridadeClass(prioridade: string): string {
    return `prioridade-${prioridade}`;
  }

  getStatusLabel(status: string): string {
    return status === 'pendente' ? 'Pendente' : 'Concluída';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}
