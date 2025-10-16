import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Tarefas } from './tarefas';

/**
 * SERVIÇO DE TAREFAS - CRUD COMPLETO
 * 
 * Este serviço implementa todas as operações CRUD para a entidade Tarefas:
 * - CREATE: inserir() - Cria nova tarefa
 * - READ: listar() e buscarPorId() - Lista todas ou busca por ID
 * - UPDATE: editar() - Atualiza tarefa existente
 * - DELETE: deletar() - Remove tarefa
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ CRUD completo com localStorage
 * ✅ Persistência de dados entre sessões
 * ✅ Geração automática de IDs únicos
 * ✅ Relacionamento com entidade Categoria (categoriaId)
 */
@Injectable({ providedIn: 'root' })
export class TarefasApiService {
  // Array estático compartilhado entre todas as instâncias do serviço
  private static tarefas: Tarefas[] = [];

  constructor() {
    TarefasApiService.carregarDados();
  }

  /**
   * Carrega dados do localStorage ou cria dados padrão
   * FUNCIONALIDADE: Persistência de dados
   */
  private static carregarDados() {
    const dados = localStorage.getItem('tarefas');
    if (dados) {
      TarefasApiService.tarefas = JSON.parse(dados);
    } else {
      // Dados padrão com relacionamento para Categoria (ID 1 e 2)
      TarefasApiService.tarefas = [
        { id:1, titulo:'Comprar leite', descricao:'Ir ao supermercado', prioridade:2, concluida:false, categoriaId: 1 },
        { id:2, titulo:'Estudar Angular', descricao:'Revisar SPA', prioridade:1, concluida:false, categoriaId: 2 }
      ];
      localStorage.setItem('tarefas', JSON.stringify(TarefasApiService.tarefas));
    }
  }

  /**
   * Salva dados no localStorage
   * FUNCIONALIDADE: Persistência automática
   */
  private static salvarDados() {
    localStorage.setItem('tarefas', JSON.stringify(TarefasApiService.tarefas));
  }

  /**
   * READ - Lista todas as tarefas
   * CRUD: Operação de Leitura
   */
  listar(): Observable<Tarefas[]> {
    return of([...TarefasApiService.tarefas]);
  }

  /**
   * READ - Busca tarefa por ID
   * CRUD: Operação de Leitura específica
   */
  buscarPorId(id?: number): Observable<Tarefas> {
    const tarefa = TarefasApiService.tarefas.find(t => t.id === id);
    if (tarefa) {
      return of({...tarefa});
    }
    return of({ id: 0, titulo: '', descricao: '', prioridade: 1, concluida: false, categoriaId: 1 });
  }

  /**
   * CREATE - Insere nova tarefa
   * CRUD: Operação de Criação
   * FUNCIONALIDADE: Geração automática de ID único
   */
  inserir(tarefa: Tarefas): Observable<Tarefas> {
    const maxId = TarefasApiService.tarefas.length > 0 ? Math.max(...TarefasApiService.tarefas.map(t => t.id)) : 0;
    tarefa.id = maxId + 1;
    TarefasApiService.tarefas.push(tarefa);
    TarefasApiService.salvarDados();
    return of(tarefa);
  }

  /**
   * UPDATE - Edita tarefa existente
   * CRUD: Operação de Atualização
   * RELACIONAMENTO: Mantém categoriaId da tarefa
   */
  editar(id: number, tarefa: Tarefas): Observable<Tarefas> {
    const index = TarefasApiService.tarefas.findIndex(t => t.id === id);
    if (index >= 0) {
      tarefa.id = id;
      TarefasApiService.tarefas[index] = tarefa;
      TarefasApiService.salvarDados();
      return of(tarefa);
    }
    return of(tarefa);
  }

  /**
   * DELETE - Remove tarefa
   * CRUD: Operação de Exclusão
   */
  deletar(id?: number): Observable<Tarefas> {
    const index = TarefasApiService.tarefas.findIndex(t => t.id === id);
    const tarefa = TarefasApiService.tarefas[index];
    TarefasApiService.tarefas.splice(index, 1);
    TarefasApiService.salvarDados();
    return of(tarefa);
  }
}
