import { Pipe, PipeTransform } from '@angular/core';
import { Tarefas } from './tarefas';

@Pipe({name: 'filtroPesquisa'})
export class FiltroPesquisaPipe implements PipeTransform {
  transform(tarefas: Tarefas[], texto: string): Tarefas[] {
    if(!texto) return tarefas;
    return tarefas.filter(t => t.titulo.toLowerCase().includes(texto.toLowerCase()));
  }
}
