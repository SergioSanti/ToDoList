import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Categoria } from './categoria';

/**
 * SERVIÇO DE CATEGORIAS - CRUD COMPLETO
 * 
 * Este serviço implementa todas as operações CRUD para a entidade Categoria:
 * - CREATE: inserir() - Cria nova categoria
 * - READ: listar() e buscarPorId() - Lista todas ou busca por ID
 * - UPDATE: editar() - Atualiza categoria existente
 * - DELETE: deletar() - Remove categoria
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ CRUD completo com localStorage
 * ✅ Persistência de dados entre sessões
 * ✅ Geração automática de IDs únicos
 * ✅ Relacionamento com entidade Tarefas (usado por categoriaId)
 */
@Injectable({ providedIn: 'root' })
export class CategoriaApiService {
  // Array estático compartilhado entre todas as instâncias do serviço
  private static categorias: Categoria[] = [];

  constructor() {
    CategoriaApiService.carregarDados();
  }

  /**
   * Carrega dados do localStorage ou cria dados padrão
   * FUNCIONALIDADE: Persistência de dados
   */
  private static carregarDados() {
    const dados = localStorage.getItem('categorias');
    if (dados) {
      CategoriaApiService.categorias = JSON.parse(dados);
    } else {
      // Dados padrão que serão referenciados pelas tarefas
      CategoriaApiService.categorias = [
        { id:1, nome:'Trabalho', descricao:'Tarefas relacionadas ao trabalho', cor:'#007bff' },
        { id:2, nome:'Pessoal', descricao:'Tarefas pessoais', cor:'#28a745' }
      ];
      localStorage.setItem('categorias', JSON.stringify(CategoriaApiService.categorias));
    }
  }

  /**
   * Salva dados no localStorage
   * FUNCIONALIDADE: Persistência automática
   */
  private static salvarDados() {
    localStorage.setItem('categorias', JSON.stringify(CategoriaApiService.categorias));
  }

  /**
   * READ - Lista todas as categorias
   * CRUD: Operação de Leitura
   */
  listar(): Observable<Categoria[]> {
    return of([...CategoriaApiService.categorias]);
  }

  /**
   * READ - Busca categoria por ID
   * CRUD: Operação de Leitura específica
   * RELACIONAMENTO: Usado para buscar categoria de uma tarefa
   */
  buscarPorId(id?: number): Observable<Categoria> {
    const categoria = CategoriaApiService.categorias.find(c => c.id === id);
    if (categoria) {
      return of({...categoria});
    }
    return of({ id: 0, nome: '', descricao: '', cor: '#007bff' });
  }

  /**
   * CREATE - Insere nova categoria
   * CRUD: Operação de Criação
   * FUNCIONALIDADE: Geração automática de ID único
   */
  inserir(categoria: Categoria): Observable<Categoria> {
    const maxId = CategoriaApiService.categorias.length > 0 ? Math.max(...CategoriaApiService.categorias.map(c => c.id)) : 0;
    categoria.id = maxId + 1;
    CategoriaApiService.categorias.push(categoria);
    CategoriaApiService.salvarDados();
    return of(categoria);
  }

  /**
   * UPDATE - Edita categoria existente
   * CRUD: Operação de Atualização
   * RELACIONAMENTO: Afeta todas as tarefas que usam esta categoria
   */
  editar(id: number, categoria: Categoria): Observable<Categoria> {
    const index = CategoriaApiService.categorias.findIndex(c => c.id === id);
    if (index >= 0) {
      categoria.id = id;
      CategoriaApiService.categorias[index] = categoria;
      CategoriaApiService.salvarDados();
      return of(categoria);
    }
    return of(categoria);
  }

  /**
   * DELETE - Remove categoria
   * CRUD: Operação de Exclusão
   * RELACIONAMENTO: Pode afetar tarefas que referenciam esta categoria
   */
  deletar(id?: number): Observable<Categoria> {
    const index = CategoriaApiService.categorias.findIndex(c => c.id === id);
    const categoria = CategoriaApiService.categorias[index];
    CategoriaApiService.categorias.splice(index, 1);
    CategoriaApiService.salvarDados();
    return of(categoria);
  }
}
