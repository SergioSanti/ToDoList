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
    const tarefa = this.listaTarefas.find(t => t.id === id)!;
    return of(tarefa);
  }

  inserir(tarefa: Tarefas): Observable<Tarefas> {
    tarefa.id = this.listaTarefas.length + 1;
    this.listaTarefas.push(tarefa);
    return of(tarefa);
  }

  editar(id: number, tarefa: Tarefas): Observable<Tarefas> {
    const index = this.listaTarefas.findIndex(t => t.id === id);
    this.listaTarefas[index] = tarefa;
    return of(tarefa);
  }

  deletar(id?: number): Observable<Tarefas> {
    const index = this.listaTarefas.findIndex(t => t.id === id);
    const tarefa = this.listaTarefas[index];
    this.listaTarefas.splice(index, 1);
    return of(tarefa);
  }
}
