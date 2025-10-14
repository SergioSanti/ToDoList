import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefasApiService } from '../tarefas-api-service';
import { CategoriaApiService } from '../categoria-api-service';
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
  private tarefasApiService = inject(TarefasApiService);
  private categoriaApiService = inject(CategoriaApiService);

  constructor() {
    this.tarefasApiService.listar().subscribe(tarefas => {
      this.tarefas.set(tarefas);
    });
    
    this.categoriaApiService.listar().subscribe(categorias => {
      this.categorias.set(categorias);
    });
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }
}
