import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css'
})
export class CategoriaForm implements OnInit {
  categoriaForm: FormGroup;
  isLoading = signal(false);
  isEditMode = signal(false);
  categoriaId = signal<number | null>(null);

  // Cores predefinidas
  coresPredefinidas = [
    '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1',
    '#20c997', '#fd7e14', '#e83e8c', '#6c757d', '#17a2b8'
  ];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoriaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      cor: ['#007bff', [Validators.required]]
    });
  }

  ngOnInit() {
    // Verificar se é modo de edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoriaId.set(parseInt(id));
      this.loadCategoria(parseInt(id));
    }
  }

  loadCategoria(id: number) {
    this.categoriaService.getById(id).subscribe({
      next: (categoria) => {
        if (categoria) {
          this.categoriaForm.patchValue({
            nome: categoria.nome,
            descricao: categoria.descricao,
            cor: categoria.cor
          });
        }
      },
      error: (error) => {
        console.error('Erro ao carregar categoria:', error);
        this.router.navigate(['/categorias']);
      }
    });
  }

  onSubmit() {
    if (this.categoriaForm.valid) {
      this.isLoading.set(true);
      
      const formData = this.categoriaForm.value;
      
      if (this.isEditMode()) {
        this.updateCategoria(formData);
      } else {
        this.createCategoria(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createCategoria(formData: any) {
    this.categoriaService.create(formData).subscribe({
      next: (categoria) => {
        this.isLoading.set(false);
        this.router.navigate(['/categorias']);
      },
      error: (error) => {
        console.error('Erro ao criar categoria:', error);
        this.isLoading.set(false);
      }
    });
  }

  updateCategoria(formData: any) {
    const id = this.categoriaId();
    if (id) {
      this.categoriaService.update(id, formData).subscribe({
        next: (categoria) => {
          this.isLoading.set(false);
          this.router.navigate(['/categorias']);
        },
        error: (error) => {
          console.error('Erro ao atualizar categoria:', error);
          this.isLoading.set(false);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/categorias']);
  }

  private markFormGroupTouched() {
    Object.keys(this.categoriaForm.controls).forEach(key => {
      const control = this.categoriaForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.categoriaForm.get(fieldName);
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
      'nome': 'Nome',
      'descricao': 'Descrição',
      'cor': 'Cor'
    };
    return labels[fieldName] || fieldName;
  }

  selectColor(cor: string) {
    this.categoriaForm.patchValue({ cor });
  }
}
