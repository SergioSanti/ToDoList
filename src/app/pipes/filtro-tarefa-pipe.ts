import { Pipe, PipeTransform } from '@angular/core';
import { Tarefa } from '../models/tarefa.model';

@Pipe({
  name: 'filtroTarefa'
})
export class FiltroTarefaPipe implements PipeTransform {

  transform(tarefas: Tarefa[], filtros: {
    status?: 'pendente' | 'concluida' | 'todas';
    prioridade?: 'baixa' | 'media' | 'alta' | 'todas';
    categoriaId?: number;
    termo?: string;
  }): Tarefa[] {
    if (!tarefas) return [];

    let resultado = [...tarefas];

    // Filtro por status
    if (filtros.status && filtros.status !== 'todas') {
      resultado = resultado.filter(tarefa => tarefa.status === filtros.status);
    }

    // Filtro por prioridade
    if (filtros.prioridade && filtros.prioridade !== 'todas') {
      resultado = resultado.filter(tarefa => tarefa.prioridade === filtros.prioridade);
    }

    // Filtro por categoria
    if (filtros.categoriaId) {
      resultado = resultado.filter(tarefa => tarefa.categoriaId === filtros.categoriaId);
    }

    // Filtro por termo de busca
    if (filtros.termo && filtros.termo.trim()) {
      const termo = filtros.termo.toLowerCase().trim();
      resultado = resultado.filter(tarefa => 
        tarefa.titulo.toLowerCase().includes(termo) ||
        tarefa.descricao.toLowerCase().includes(termo)
      );
    }

    return resultado;
  }

}
