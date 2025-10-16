import { Pipe, PipeTransform } from '@angular/core';
import { Tarefas } from './tarefas';

/**
 * PIPE DE FILTRO DE PESQUISA - FUNCIONALIDADE DE BUSCA
 * 
 * Este pipe implementa uma funcionalidade de filtro/busca para tarefas:
 * - Filtra tarefas pelo título
 * - Busca case-insensitive (ignora maiúsculas/minúsculas)
 * - Retorna todas as tarefas se não houver texto de busca
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ Funcionalidade de filtro/busca
 * ✅ Uso de Pipes do Angular
 * ✅ Transformação de dados em tempo real
 * ✅ Integração com ngModel para busca dinâmica
 */
@Pipe({name: 'filtroPesquisa'})
export class FiltroPesquisaPipe implements PipeTransform {
  
  /**
   * Transforma a lista de tarefas aplicando filtro de pesquisa
   * FUNCIONALIDADE: Busca por título de tarefa
   * 
   * @param tarefas - Array de tarefas para filtrar
   * @param texto - Texto de busca (opcional)
   * @returns Array filtrado de tarefas
   */
  transform(tarefas: Tarefas[], texto: string): Tarefas[] {
    // Se não há texto de busca, retorna todas as tarefas
    if(!texto) return tarefas;
    
    // Filtra tarefas cujo título contém o texto de busca (case-insensitive)
    return tarefas.filter(t => 
      t.titulo.toLowerCase().includes(texto.toLowerCase())
    );
  }
}
