import { Component, Input, inject, signal } from '@angular/core';
import { Tarefas } from '../tarefas';
import { CategoriaApiService } from '../categoria-api-service';
import { Categoria } from '../categoria';

@Component({
  selector: 'card-tarefas',
  templateUrl: 'card-tarefas.html',
  styleUrls: ['card-tarefas.css'],
  standalone: true
})
export class CardTarefas {
  @Input() tarefa!: Tarefas;
  categorias = signal<Categoria[]>([]);
  private categoriaApiService = inject(CategoriaApiService);

  constructor() {
    this.categoriaApiService.listar().subscribe(categorias => {
      this.categorias.set(categorias);
    });
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }
}
