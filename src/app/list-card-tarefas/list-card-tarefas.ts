import { Component, Input } from '@angular/core';
import { Tarefas } from '../tarefas';

@Component({
  selector: 'app-card-tarefas',
  standalone: true,
  imports: [],
  templateUrl: 'list-card-tarefas.html',
  styleUrls: ['list-card-tarefas.css']
})
export class ListCardTarefas {
  @Input() tarefa!: Tarefas; // 👈 o nome deve ser exatamente "tarefa"
}
