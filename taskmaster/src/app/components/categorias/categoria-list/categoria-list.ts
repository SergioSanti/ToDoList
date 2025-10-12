import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../../services/categoria';
import { TarefaService } from '../../../services/tarefa';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.css'
})
export class CategoriaList implements OnInit {
  categorias = signal<Categoria[]>([]);
  isLoading = signal(true);
  categoriaStats = signal<{ [key: number]: number }>({});

  constructor(
    private categoriaService: CategoriaService,
    private tarefaService: TarefaService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    
    // Carregar categorias
    this.categoriaService.getAll().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.loadCategoriaStats();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadCategoriaStats() {
    this.tarefaService.getAll().subscribe({
      next: (tarefas) => {
        const stats: { [key: number]: number } = {};
        tarefas.forEach(tarefa => {
          stats[tarefa.categoriaId] = (stats[tarefa.categoriaId] || 0) + 1;
        });
        this.categoriaStats.set(stats);
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  deleteCategoria(categoria: Categoria) {
    const tarefasCount = this.categoriaStats()[categoria.id] || 0;
    
    if (tarefasCount > 0) {
      alert(`Não é possível excluir a categoria "${categoria.nome}" pois ela possui ${tarefasCount} tarefa(s) associada(s).`);
      return;
    }

    if (confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?`)) {
      this.categoriaService.delete(categoria.id).subscribe({
        next: () => {
          this.loadData(); // Recarregar lista
        },
        error: (error) => {
          console.error('Erro ao excluir categoria:', error);
        }
      });
    }
  }

  getTarefasCount(categoriaId: number): number {
    return this.categoriaStats()[categoriaId] || 0;
  }
}
