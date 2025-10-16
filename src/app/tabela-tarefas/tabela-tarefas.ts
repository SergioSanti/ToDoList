import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TarefasApiService } from '../tarefas-api-service';
import { CategoriaApiService } from '../categoria-api-service';
import { Tarefas } from '../tarefas';
import { Categoria } from '../categoria';
import { FiltroPesquisaPipe } from '../filtro-pesquisa-pipe';
import { filter } from 'rxjs/operators';

/**
 * COMPONENTE TABELA DE TAREFAS - CRUD E RELACIONAMENTO
 * 
 * Este componente implementa:
 * - Exibição de tarefas em tabela
 * - Funcionalidade de busca/filtro usando Pipes
 * - Relacionamento entre Tarefas e Categorias
 * - Operações CRUD (Editar/Deletar)
 * - Navegação SPA entre telas
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ CRUD: Visualização, Edição e Exclusão
 * ✅ Funcionalidade de busca com Pipes
 * ✅ Relacionamento entre duas entidades (Tarefas ↔ Categorias)
 * ✅ Navegação SPA com RouterLink
 * ✅ Recarregamento automático de dados
 */
@Component({
  selector: 'app-tabela-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FiltroPesquisaPipe],
  templateUrl: './tabela-tarefas.html',
  styleUrls: ['./tabela-tarefas.css']
})
export class TabelaTarefas implements OnInit {
  // Campo de pesquisa para filtro
  nomePesquisa = '';
  
  // Signals para dados reativos
  listaTarefas = signal<Tarefas[]>([]);
  categorias = signal<Categoria[]>([]);
  
  // Injeção de dependências
  private tarefasApiService = inject(TarefasApiService);
  private categoriaApiService = inject(CategoriaApiService);
  private router = inject(Router);

  constructor() {
    // Escuta mudanças de rota para recarregar dados automaticamente
    // FUNCIONALIDADE: Navegação SPA com atualização de dados
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.carregarDados();
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  /**
   * Carrega dados das duas entidades relacionadas
   * FUNCIONALIDADE: Manipulação de duas entidades simultaneamente
   * RELACIONAMENTO: Tarefas e Categorias
   */
  carregarDados() {
    // Carrega tarefas
    this.tarefasApiService.listar().subscribe((tarefas) => {
      this.listaTarefas.set(tarefas);
    });
    
    // Carrega categorias para relacionamento
    this.categoriaApiService.listar().subscribe((categorias) => {
      this.categorias.set(categorias);
    });
  }

  /**
   * DELETE - Remove tarefa
   * CRUD: Operação de Exclusão
   */
  deletar(id: number) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      this.tarefasApiService.deletar(id).subscribe(() => {
        // Atualiza lista local após exclusão
        this.listaTarefas.set(this.listaTarefas().filter(t => t.id !== id));
      });
    }
  }

  /**
   * Busca nome da categoria pelo ID
   * FUNCIONALIDADE: Relacionamento entre duas entidades
   * RELACIONAMENTO: Tarefas → Categorias (categoriaId)
   */
  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  }
}
