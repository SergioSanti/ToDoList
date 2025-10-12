import { Component, Input } from '@angular/core';
import { Tarefas } from '../tarefas';

@Component({
  selector: 'app-card-tarefas',
  templateUrl: 'card-tarefas.html',
  styleUrls: ['card-tarefas.css']
})
export class CardTarefas {
  @Input() tarefas: Tarefas = { id:1, titulo:"Tarefa 1", descricao:"", prioridade:1, concluida:false };
}
