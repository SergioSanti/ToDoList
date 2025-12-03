import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../tasks';
import { TasksApiService } from '../tasks-api-service';
import { CategoriesApiService } from '../categories-api-service';
import { Category } from '../category';

/**
 * TASK FORM COMPONENT - CRUD AND RELATIONSHIP
 * 
 * This component implements:
 * - Form to create/edit tasks
 * - Relationship with Category entity
 * - CRUD operations (Create/Update)
 * - SPA navigation between screens
 * - Type validation (string/number)
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
  // Signal for reactive task data
  task = signal<Task>({ id:0, title:'', description:'', priority:1, completed:false, categoryId: 1 });
  actionButton = "Register";
  // Signal for related categories
  categories = signal<Category[]>([]);
  // Validations
  errors = signal<{[key: string]: string}>({});

  // Dependency injection
  tasksApiService = inject(TasksApiService);
  categoriesApiService = inject(CategoriesApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    // SPA NAVIGATION: Capture route ID for editing
    const idParam = this.route.snapshot.params['id'];
    this.id = idParam ? +idParam : undefined;
    
    if(this.id) {
      this.actionButton = "Edit";
      // CRUD: Read operation for editing
      this.tasksApiService.findById(this.id).subscribe(t => {
        this.task.set(t);
      });
    }
    
    // RELATIONSHIP: Load categories for select
    // FUNCTIONALITY: Manipulate two entities simultaneously
    this.categoriesApiService.list().subscribe(categories => {
      this.categories.set(categories);
      // If there's no ID (creation) and there are categories, set the first as default
      if (!this.id && categories.length > 0 && this.task().categoryId <= 0) {
        this.task.update(t => ({ ...t, categoryId: categories[0].id }));
      }
    });
  }

  /**
   * Validate form fields
   * VALIDATION: Required fields and business rules
   */
  validate(): boolean {
    const errors: {[key: string]: string} = {};
    const task = this.task();

    // Validation: Title required
    if (!task.title || task.title.trim() === '') {
      errors['title'] = 'Title is required';
    }

    // Validation: Description required
    if (!task.description || task.description.trim() === '') {
      errors['description'] = 'Description is required';
    }

    // Validation: Category required
    if (!task.categoryId || task.categoryId <= 0) {
      errors['category'] = 'Category is required';
    }

    // Validation: Priority between 1 and 5
    if (task.priority < 1 || task.priority > 5) {
      errors['priority'] = 'Priority must be between 1 and 5';
    }

    this.errors.set(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Save task (Create or Update)
   * CRUD: Create and Update operations
   * RELATIONSHIP: Maintains task categoryId
   * VALIDATION: Validates fields before saving
   */
  save() {
    // Validation before saving
    if (!this.validate()) {
      return;
    }

    // Type validation for relationship
    // Convert categoryId from string to number if necessary
    const task = this.task();
    if (typeof task.categoryId === 'string') {
      task.categoryId = +task.categoryId;
    }
    
    if(this.id) {
      // CRUD: UPDATE - Edit existing task
      this.tasksApiService.update(this.id, task).subscribe(() => {
        alert('Task edited successfully!');
        // SPA NAVIGATION: Return to table
        this.router.navigate(['/tabela']);
      });
    } else {
      // CRUD: CREATE - Create new task
      this.tasksApiService.insert(task).subscribe(() => {
        alert('Task registered successfully!');
        // Clear form for new entry
        this.task.set({ id:0, title:'', description:'', priority:1, completed:false, categoryId: 1 });
        this.errors.set({});
      });
    }
  }

  /**
   * SPA NAVIGATION: Return to task table
   */
  goBack() {
    this.router.navigate(['/tabela']);
  }
}
