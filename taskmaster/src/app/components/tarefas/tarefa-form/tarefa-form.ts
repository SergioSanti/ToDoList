import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TarefaService } from '../../../services/tarefa';
import { CategoriaService } from '../../../services/categoria';
import { Tarefa } from '../../../models/tarefa.model';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-tarefa-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tarefa-form.html',
  styleUrl: './tarefa-form.css'
})
export class TarefaForm implements OnInit {
  tarefaForm: FormGroup;
  categorias = signal<Categoria[]>([]);
  isLoading = signal(false);
  isEditMode = signal(false);
  tarefaId = signal<number | null>(null);

  constructor(
    private fb: FormBuilder,
    private tarefaService: TarefaService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tarefaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      prioridade: ['media', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      status: ['pendente']
    });
  }

  ngOnInit() {
    this.loadCategorias();
    
    // Verificar se é modo de edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.tarefaId.set(parseInt(id));
      this.loadTarefa(parseInt(id));
    }
  }

  loadCategorias() {
    this.categoriaService.getAll().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  loadTarefa(id: number) {
    this.tarefaService.getById(id).subscribe({
      next: (tarefa) => {
        if (tarefa) {
          this.tarefaForm.patchValue({
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            prioridade: tarefa.prioridade,
            categoriaId: tarefa.categoriaId,
            status: tarefa.status
          });
        }
      },
      error: (error) => {
        console.error('Erro ao carregar tarefa:', error);
        this.router.navigate(['/tarefas']);
      }
    });
  }

  onSubmit() {
    if (this.tarefaForm.valid) {
      this.isLoading.set(true);
      
      const formData = this.tarefaForm.value;
      
      if (this.isEditMode()) {
        this.updateTarefa(formData);
      } else {
        this.createTarefa(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createTarefa(formData: any) {
    this.tarefaService.create(formData).subscribe({
      next: (tarefa) => {
        this.isLoading.set(false);
        this.router.navigate(['/tarefas']);
      },
      error: (error) => {
        console.error('Erro ao criar tarefa:', error);
        this.isLoading.set(false);
      }
    });
  }

  updateTarefa(formData: any) {
    const id = this.tarefaId();
    if (id) {
      this.tarefaService.update(id, formData).subscribe({
        next: (tarefa) => {
          this.isLoading.set(false);
          this.router.navigate(['/tarefas']);
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
          this.isLoading.set(false);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/tarefas']);
  }

  private markFormGroupTouched() {
    Object.keys(this.tarefaForm.controls).forEach(key => {
      const control = this.tarefaForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.tarefaForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'titulo': 'Título',
      'descricao': 'Descrição',
      'prioridade': 'Prioridade',
      'categoriaId': 'Categoria'
    };
    return labels[fieldName] || fieldName;
  }

  getPrioridadeOptions() {
    return [
      { value: 'baixa', label: 'Baixa' },
      { value: 'media', label: 'Média' },
      { value: 'alta', label: 'Alta' }
    ];
  }

  getStatusOptions() {
    return [
      { value: 'pendente', label: 'Pendente' },
      { value: 'concluida', label: 'Concluída' }
    ];
  }
}
