import { Component, Input } from '@angular/core';
import { Tarefas } from '../tarefas';

@Component({
  selector: 'app-card-tarefas',
  templateUrl: 'card-tarefas.html',
  styleUrls: ['card-tarefas.css'],
  standalone: true
})
export class CardTarefas {
  @Input() tarefa!: Tarefas;
}
