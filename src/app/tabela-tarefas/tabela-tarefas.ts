import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // 👈 importa o RouterModule
import { TarefasApiService } from '../tarefas-api-service';
import { Tarefas } from '../tarefas';
import { FiltroPesquisaPipe } from '../filtro-pesquisa-pipe';

@Component({
  selector: 'app-tabela-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FiltroPesquisaPipe], // 👈 adiciona RouterModule aqui
  templateUrl: './tabela-tarefas.html',
  styleUrls: ['./tabela-tarefas.css']
})
export class TabelaTarefas {
  nomePesquisa = '';
  listaTarefas = signal<Tarefas[]>([]);
  private tarefasApiService = inject(TarefasApiService);

  constructor() {
    this.tarefasApiService.listar().subscribe((tarefas) => {
      this.listaTarefas.set(tarefas);
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      this.tarefasApiService.deletar(id).subscribe(() => {
        this.listaTarefas.set(this.listaTarefas().filter(t => t.id !== id));
      });
    }
  }
}
