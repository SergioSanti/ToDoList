import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Tarefas } from '../tarefas';
import { TarefasApiService } from '../tarefas-api-service';
import { CategoriaApiService } from '../categoria-api-service';
import { Categoria } from '../categoria';

/**
 * COMPONENTE FORMULÁRIO DE TAREFAS - CRUD E RELACIONAMENTO
 * 
 * Este componente implementa:
 * - Formulário para criar/editar tarefas
 * - Relacionamento com entidade Categorias
 * - Operações CRUD (Create/Update)
 * - Navegação SPA entre telas
 * - Validação de tipos (string/number)
 * 
 */
@Component({
  selector: 'app-form-tarefas',
  imports: [FormsModule],
  templateUrl: 'form-tarefas.html',
  styleUrls: ['form-tarefas.css']
})
export class FormTarefas {
  id?: number;
  // Signal para dados reativos da tarefa
  tarefas = signal<Tarefas>({ id:0, titulo:'', descricao:'', prioridade:1, concluida:false, categoriaId: 1 });
  botaoAcao = "Cadastrar";
  // Signal para categorias relacionadas
  categorias = signal<Categoria[]>([]);
  // Validações
  erros = signal<{[key: string]: string}>({});

  // Injeção de dependências
  tarefasApiService = inject(TarefasApiService);
  categoriaApiService = inject(CategoriaApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    // NAVEGAÇÃO SPA: Captura ID da rota para edição
    const idParam = this.route.snapshot.params['id'];
    this.id = idParam ? +idParam : undefined;
    
    if(this.id) {
      this.botaoAcao = "Editar";
      // CRUD: Operação de Leitura para edição
      this.tarefasApiService.buscarPorId(this.id).subscribe(t => {
        this.tarefas.set(t);
      });
    }
    
    // RELACIONAMENTO: Carrega categorias para o select
    // FUNCIONALIDADE: Manipulação de duas entidades simultaneamente
    this.categoriaApiService.listar().subscribe(categorias => {
      this.categorias.set(categorias);
      // Se não há ID (criação) e há categorias, define a primeira como padrão
      if (!this.id && categorias.length > 0 && this.tarefas().categoriaId <= 0) {
        this.tarefas.update(t => ({ ...t, categoriaId: categorias[0].id }));
      }
    });
  }

  /**
   * Valida os campos do formulário
   * VALIDAÇÃO: Campos obrigatórios e regras de negócio
   */
  validar(): boolean {
    const erros: {[key: string]: string} = {};
    const tarefa = this.tarefas();

    // Validação: Título obrigatório
    if (!tarefa.titulo || tarefa.titulo.trim() === '') {
      erros['titulo'] = 'Título é obrigatório';
    }

    // Validação: Descrição obrigatória
    if (!tarefa.descricao || tarefa.descricao.trim() === '') {
      erros['descricao'] = 'Descrição é obrigatória';
    }

    // Validação: Categoria obrigatória
    if (!tarefa.categoriaId || tarefa.categoriaId <= 0) {
      erros['categoria'] = 'Categoria é obrigatória';
    }

    // Validação: Prioridade entre 1 e 5
    if (tarefa.prioridade < 1 || tarefa.prioridade > 5) {
      erros['prioridade'] = 'Prioridade deve ser entre 1 e 5';
    }

    this.erros.set(erros);
    return Object.keys(erros).length === 0;
  }

  /**
   * Salva tarefa (Create ou Update)
   * CRUD: Operações de Criação e Atualização
   * RELACIONAMENTO: Mantém categoriaId da tarefa
   * VALIDAÇÃO: Valida campos antes de salvar
   */
  salvar() {
    // Validação antes de salvar
    if (!this.validar()) {
      return;
    }

    // Validação de tipos para relacionamento
    // Converte categoriaId de string para number se necessário
    const tarefa = this.tarefas();
    if (typeof tarefa.categoriaId === 'string') {
      tarefa.categoriaId = +tarefa.categoriaId;
    }
    
    if(this.id) {
      // CRUD: UPDATE - Edita tarefa existente
      this.tarefasApiService.editar(this.id, tarefa).subscribe(() => {
        alert('Tarefa editada com sucesso!');
        // NAVEGAÇÃO SPA: Retorna para tabela
        this.router.navigate(['/tabela']);
      });
    } else {
      // CRUD: CREATE - Cria nova tarefa
      this.tarefasApiService.inserir(tarefa).subscribe(() => {
        alert('Tarefa cadastrada com sucesso!');
        // Limpa formulário para nova entrada
        this.tarefas.set({ id:0, titulo:'', descricao:'', prioridade:1, concluida:false, categoriaId: 1 });
        this.erros.set({});
      });
    }
  }

  /**
   * NAVEGAÇÃO SPA: Retorna para tabela de tarefas
   */
  voltar() {
    this.router.navigate(['/tabela']);
  }
}
