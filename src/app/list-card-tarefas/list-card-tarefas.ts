import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefasService } from '../tarefas-service';
import { CategoriaService } from '../categoria-service';
import { Tarefas } from '../tarefas';
import { Categoria } from '../categoria';

@Component({
  selector: 'app-list-card-tarefas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-card-tarefas.html',
  styleUrls: ['./list-card-tarefas.css']
})
export class ListCardTarefas {
  tarefas = signal<Tarefas[]>([]);
  categorias = signal<Categoria[]>([]);
  private tarefasService = inject(TarefasService);
  private categoriaService = inject(CategoriaService);

  constructor() {
    this.tarefas.set(this.tarefasService.listar());
    this.categorias.set(this.categoriaService.listar());
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }
}
