import { Component, Input, inject, signal } from '@angular/core';
import { Tarefas } from '../tarefas';
import { CategoriaService } from '../categoria-service';
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
  private categoriaService = inject(CategoriaService);

  constructor() {
    this.categorias.set(this.categoriaService.listar());
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }
}
