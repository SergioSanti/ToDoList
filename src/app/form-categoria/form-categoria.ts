import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../category';
import { CategoriesApiService } from '../categories-api-service';

@Component({
  selector: 'app-form-categoria',
  imports: [FormsModule],
  templateUrl: 'form-categoria.html',
  styleUrls: ['form-categoria.css']
})
export class FormCategoria {
  id?: number;
  category = signal<Category>({ id:0, name:'', description:'', color:'#007bff' });
  actionButton = "Register";
  // Validations
  errors = signal<{[key: string]: string}>({});

  categoriesApiService = inject(CategoriesApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    const idParam = this.route.snapshot.params['id'];
    this.id = idParam ? +idParam : undefined; // Convert string to number
    
    if(this.id) {
      this.actionButton = "Edit";
      this.categoriesApiService.findById(this.id).subscribe(c => {
        this.category.set(c);
      });
    }
  }

  /**
   * Validate form fields
   * VALIDATION: Required fields
   */
  validate(): boolean {
    const errors: {[key: string]: string} = {};
    const category = this.category();

    // Validation: Name required
    if (!category.name || category.name.trim() === '') {
      errors['name'] = 'Name is required';
    }

    // Validation: Description required
    if (!category.description || category.description.trim() === '') {
      errors['description'] = 'Description is required';
    }

    this.errors.set(errors);
    return Object.keys(errors).length === 0;
  }

  save() {
    // Validation before saving
    if (!this.validate()) {
      return;
    }

    if(this.id) {
      this.categoriesApiService.update(this.id, this.category()).subscribe(() => {
        alert('Category edited successfully!');
        this.router.navigate(['/tabela-categoria']);
      });
    } else {
      this.categoriesApiService.insert(this.category()).subscribe(() => {
        alert('Category registered successfully!');
        this.category.set({ id:0, name:'', description:'', color:'#007bff' });
        this.errors.set({});
      });
    }
  }

  goBack() {
    this.router.navigate(['/tabela-categoria']);
  }
}
