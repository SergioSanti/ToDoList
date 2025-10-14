import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Tarefas } from '../tarefas';
import { TarefasApiService } from '../tarefas-api-service';
import { CategoriaApiService } from '../categoria-api-service';
import { Categoria } from '../categoria';

@Component({
  selector: 'app-form-tarefas',
  imports: [FormsModule],
  templateUrl: 'form-tarefas.html',
  styleUrls: ['form-tarefas.css']
})
export class FormTarefas {
  id?: number;
  tarefas = signal<Tarefas>({ id:0, titulo:'', descricao:'', prioridade:1, concluida:false, categoriaId: 1 });
  botaoAcao = "Cadastrar";
  categorias = signal<Categoria[]>([]);

  tarefasApiService = inject(TarefasApiService);
  categoriaApiService = inject(CategoriaApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    const idParam = this.route.snapshot.params['id'];
    this.id = idParam ? +idParam : undefined; // Converte string para number
    
    console.log('ID da URL:', idParam, 'ID convertido:', this.id);
    
    if(this.id) {
      this.botaoAcao = "Editar";
      this.tarefasApiService.buscarPorId(this.id).subscribe(t => {
        console.log('Tarefa carregada para edição:', t);
        this.tarefas.set(t);
      });
    }
    
    // Carrega as categorias para o select
    this.categoriaApiService.listar().subscribe(categorias => {
      this.categorias.set(categorias);
    });
  }

  salvar() {
    if(this.id) {
      this.tarefasApiService.editar(this.id, this.tarefas()).subscribe(() => {
        alert('Tarefa editada com sucesso!');
        this.router.navigate(['/tabela']);
      });
    } else {
      this.tarefasApiService.inserir(this.tarefas()).subscribe(() => {
        alert('Tarefa cadastrada com sucesso!');
        this.tarefas.set({ id:0, titulo:'', descricao:'', prioridade:1, concluida:false, categoriaId: 1 });
      });
    }
  }

  voltar() {
    this.router.navigate(['/tabela']);
  }
}
