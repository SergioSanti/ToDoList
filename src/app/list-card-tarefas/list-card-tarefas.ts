import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefasApiService } from '../tarefas-api-service';
import { CategoriaApiService } from '../categoria-api-service';
import { Tarefas } from '../tarefas';
import { Categoria } from '../categoria';

/**
 * COMPONENTE LISTA DE TAREFAS - RELACIONAMENTO E FUNCIONALIDADE DE NEGÓCIO
 * 
 * Este componente implementa:
 * - Exibição de tarefas em cards visuais
 * - Relacionamento entre Tarefas e Categorias
 * - Funcionalidade de negócio: exibição integrada
 * - Manipulação de duas entidades simultaneamente
 * - Cálculo de cores de contraste
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ Relacionamento entre duas entidades (Tarefas ↔ Categorias)
 * ✅ Funcionalidade de negócio: exibição integrada com cores
 * ✅ Manipulação de duas entidades simultaneamente
 * ✅ Cálculo automático de cores de contraste
 * ✅ Exibição visual com badges e cores das categorias
 */
@Component({
  selector: 'app-list-card-tarefas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-card-tarefas.html',
  styleUrls: ['./list-card-tarefas.css']
})
export class ListCardTarefas {
  // Signals para dados reativos
  tarefas = signal<Tarefas[]>([]);
  categorias = signal<Categoria[]>([]);
  
  // Injeção de dependências
  private tarefasApiService = inject(TarefasApiService);
  private categoriaApiService = inject(CategoriaApiService);

  constructor() {
    this.carregarDados();
  }

  /**
   * Carrega dados das duas entidades relacionadas
   * FUNCIONALIDADE: Manipulação de duas entidades simultaneamente
   * RELACIONAMENTO: Tarefas e Categorias
   */
  carregarDados() {
    // Carrega tarefas
    this.tarefasApiService.listar().subscribe(tarefas => {
      this.tarefas.set(tarefas);
    });
    
    // Carrega categorias para relacionamento
    this.categoriaApiService.listar().subscribe(categorias => {
      this.categorias.set(categorias);
    });
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

  /**
   * Busca cor da categoria pelo ID
   * FUNCIONALIDADE: Relacionamento entre duas entidades
   * RELACIONAMENTO: Tarefas → Categorias (categoriaId)
   */
  getCategoriaCor(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria ? categoria.cor : '#6c757d';
  }

  /**
   * FUNCIONALIDADE DE NEGÓCIO: Calcula cor de contraste
   * Calcula se deve usar texto branco ou preto baseado na cor de fundo
   */
  getContrastColor(hexColor: string): string {
    const color = hexColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }
}
