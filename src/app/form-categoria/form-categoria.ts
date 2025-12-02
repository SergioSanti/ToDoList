import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Categoria } from '../categoria';
import { CategoriaApiService } from '../categoria-api-service';

@Component({
  selector: 'app-form-categoria',
  imports: [FormsModule],
  templateUrl: 'form-categoria.html',
  styleUrls: ['form-categoria.css']
})
export class FormCategoria {
  id?: number;
  categoria = signal<Categoria>({ id:0, nome:'', descricao:'', cor:'#007bff' });
  botaoAcao = "Cadastrar";
  // Validações
  erros = signal<{[key: string]: string}>({});

  categoriaApiService = inject(CategoriaApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    const idParam = this.route.snapshot.params['id'];
    this.id = idParam ? +idParam : undefined; // Converte string para number
    
    if(this.id) {
      this.botaoAcao = "Editar";
      this.categoriaApiService.buscarPorId(this.id).subscribe(c => {
        this.categoria.set(c);
      });
    }
  }

  /**
   * Valida os campos do formulário
   * VALIDAÇÃO: Campos obrigatórios
   */
  validar(): boolean {
    const erros: {[key: string]: string} = {};
    const categoria = this.categoria();

    // Validação: Nome obrigatório
    if (!categoria.nome || categoria.nome.trim() === '') {
      erros['nome'] = 'Nome é obrigatório';
    }

    // Validação: Descrição obrigatória
    if (!categoria.descricao || categoria.descricao.trim() === '') {
      erros['descricao'] = 'Descrição é obrigatória';
    }

    this.erros.set(erros);
    return Object.keys(erros).length === 0;
  }

  salvar() {
    // Validação antes de salvar
    if (!this.validar()) {
      return;
    }

    if(this.id) {
      this.categoriaApiService.editar(this.id, this.categoria()).subscribe(() => {
        alert('Categoria editada com sucesso!');
        this.router.navigate(['/tabela-categoria']);
      });
    } else {
      this.categoriaApiService.inserir(this.categoria()).subscribe(() => {
        alert('Categoria cadastrada com sucesso!');
        this.categoria.set({ id:0, nome:'', descricao:'', cor:'#007bff' });
        this.erros.set({});
      });
    }
  }

  voltar() {
    this.router.navigate(['/tabela-categoria']);
  }
}
