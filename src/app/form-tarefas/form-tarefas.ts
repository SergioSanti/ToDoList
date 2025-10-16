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
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ CRUD: Criação e Edição de tarefas
 * ✅ Relacionamento entre duas entidades (Tarefas ↔ Categorias)
 * ✅ Navegação SPA com Router
 * ✅ Manipulação de duas entidades simultaneamente
 * ✅ Validação de tipos para relacionamento
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
    });
  }

  /**
   * Salva tarefa (Create ou Update)
   * CRUD: Operações de Criação e Atualização
   * RELACIONAMENTO: Mantém categoriaId da tarefa
   */
  salvar() {
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
