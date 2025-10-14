import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TarefasApiService } from '../tarefas-api-service';
import { CategoriaApiService } from '../categoria-api-service';
import { Tarefas } from '../tarefas';
import { Categoria } from '../categoria';
import { FiltroPesquisaPipe } from '../filtro-pesquisa-pipe';

@Component({
  selector: 'app-tabela-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FiltroPesquisaPipe],
  templateUrl: './tabela-tarefas.html',
  styleUrls: ['./tabela-tarefas.css']
})
export class TabelaTarefas {
  nomePesquisa = '';
  listaTarefas = signal<Tarefas[]>([]);
  categorias = signal<Categoria[]>([]);
  private tarefasApiService = inject(TarefasApiService);
  private categoriaApiService = inject(CategoriaApiService);

  constructor() {
    this.tarefasApiService.listar().subscribe((tarefas) => {
      this.listaTarefas.set(tarefas);
    });
    
    this.categoriaApiService.listar().subscribe((categorias) => {
      this.categorias.set(categorias);
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      this.tarefasApiService.deletar(id).subscribe(() => {
        this.listaTarefas.set(this.listaTarefas().filter(t => t.id !== id));
      });
    }
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }
}
