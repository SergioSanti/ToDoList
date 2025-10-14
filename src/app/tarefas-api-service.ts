import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Tarefas } from './tarefas';

@Injectable({ providedIn: 'root' })
export class TarefasApiService {
  private listaTarefas: Tarefas[] = [
    { id:1, titulo:'Comprar leite', descricao:'Ir ao supermercado', prioridade:2, concluida:false, categoriaId: 1 },
    { id:2, titulo:'Estudar Angular', descricao:'Revisar SPA', prioridade:1, concluida:false, categoriaId: 2 }
  ];

  listar(): Observable<Tarefas[]> {
    return of(this.listaTarefas);
  }

  buscarPorId(id?: number): Observable<Tarefas> {
    const tarefa = this.listaTarefas.find(t => t.id === id);
    if (!tarefa) {
      // Retorna uma tarefa vazia se não encontrar
      return of({ id: 0, titulo: '', descricao: '', prioridade: 1, concluida: false, categoriaId: 1 });
    }
    return of(tarefa);
  }

  inserir(tarefa: Tarefas): Observable<Tarefas> {
    tarefa.id = this.listaTarefas.length + 1;
    this.listaTarefas.push(tarefa);
    return of(tarefa);
  }

  editar(id: number, tarefa: Tarefas): Observable<Tarefas> {
    console.log('Editando tarefa com ID:', id, 'Tipo:', typeof id);
    console.log('Lista atual:', this.listaTarefas);
    
    const index = this.listaTarefas.findIndex(t => t.id === id);
    console.log('Índice encontrado:', index);
    
    if (index >= 0) {
      // Preserva o ID original
      tarefa.id = id;
      this.listaTarefas[index] = tarefa;
      console.log('Tarefa editada:', tarefa);
      console.log('Lista após edição:', this.listaTarefas);
      return of(tarefa);
    }
    
    console.log('Tarefa não encontrada, adicionando nova');
    // Se não encontrar, adiciona como nova tarefa
    tarefa.id = this.listaTarefas.length + 1;
    this.listaTarefas.push(tarefa);
    return of(tarefa);
  }

  deletar(id?: number): Observable<Tarefas> {
    const index = this.listaTarefas.findIndex(t => t.id === id);
    const tarefa = this.listaTarefas[index];
    this.listaTarefas.splice(index, 1);
    return of(tarefa);
  }
}
