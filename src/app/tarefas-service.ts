import { Injectable } from '@angular/core';
import { Tarefas } from './tarefas';

@Injectable({
  providedIn: 'root'
})
export class TarefasService {
  private proxId = 3;
  listaTarefas: Tarefas[] = [
    { id: 1, titulo:'Comprar leite', descricao:'Ir ao supermercado', prioridade:2, concluida:false, categoriaId: 1 },
    { id: 2, titulo:'Estudar Angular', descricao:'Revisar SPA', prioridade:1, concluida:false, categoriaId: 2 }
  ];

  inserir(tarefa: Tarefas){
    tarefa.id = this.proxId++;
    this.listaTarefas.push(tarefa);
  }  

  listar(): Tarefas[] {
    return this.listaTarefas;
  }

  buscarPorId(id?: number): Tarefas | undefined {
    const tarefa = this.listaTarefas.find(t => t.id === id);
    return tarefa ? {...tarefa} : undefined;
  }

  editar(id: number, tarefa: Tarefas) {
    const indice = this.getIndice(id);
    if(indice >= 0) {
      this.listaTarefas[indice] = tarefa;
    }
  }

  deletar(id?: number) {
    const indice = this.getIndice(id);
    if(indice >=0){
      this.listaTarefas.splice(indice, 1);
    }
  }

  private getIndice(id?: number) {
    return this.listaTarefas.findIndex(t => t.id === id);
  }
}
