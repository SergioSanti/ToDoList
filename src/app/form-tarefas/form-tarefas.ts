import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../tasks';
import { TasksApiService } from '../tasks-api-service';
import { CategoriesApiService } from '../categories-api-service';
import { Category } from '../category';
import { StorageService } from '../storage-service';

/**
 * TASK FORM COMPONENT - CRUD AND RELATIONSHIP
 * 
 * This component implements:
 * - Form to create/edit tasks
 * - Relationship with Category entity
 * - CRUD operations (Create/Update)
 * - SPA navigation between screens
 * - Type validation (string/number)
 * - STORAGE: File upload functionality
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
  actionButton = "Cadastrar";
  // Signal for related categories
  categories = signal<Category[]>([]);
  // Validations
  errors = signal<{[key: string]: string}>({});
  // STORAGE: File upload
  selectedFile: File | null = null;
  uploadProgress = signal<number>(0);
  isUploading = signal<boolean>(false);

  // Dependency injection
  tasksApiService = inject(TasksApiService);
  categoriesApiService = inject(CategoriesApiService);
  storageService = inject(StorageService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    // SPA NAVIGATION: Capture route ID for editing
    const idParam = this.route.snapshot.params['id'];
    this.id = idParam ? +idParam : undefined;
    
    if(this.id) {
      this.actionButton = "Editar";
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
   * STORAGE: Handle file selection
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.errors.update(errors => ({ ...errors, file: 'Arquivo muito grande. Máximo 10MB.' }));
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/', 'video/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument'];
      const isValidType = allowedTypes.some(type => file.type.startsWith(type));
      
      if (!isValidType) {
        this.errors.update(errors => ({ ...errors, file: 'Tipo de arquivo não permitido. Use imagem, vídeo ou PDF.' }));
        return;
      }

      this.selectedFile = file;
      this.errors.update(errors => {
        const newErrors = { ...errors };
        delete newErrors['file'];
        return newErrors;
      });
    }
  }

  /**
   * STORAGE: Remove selected file
   */
  removeFile() {
    this.selectedFile = null;
    this.task.update(t => ({ ...t, fileUrl: undefined, fileName: undefined }));
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
      errors['title'] = 'Título é obrigatório';
    }

    // Validation: Description required
    if (!task.description || task.description.trim() === '') {
      errors['description'] = 'Descrição é obrigatória';
    }

    // Validation: Category required
    if (!task.categoryId || task.categoryId <= 0) {
      errors['category'] = 'Categoria é obrigatória';
    }

    // Validation: Priority between 1 and 5
    if (task.priority < 1 || task.priority > 5) {
      errors['priority'] = 'Prioridade deve ser entre 1 e 5';
    }

    this.errors.set(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Save task (Create or Update)
   * CRUD: Create and Update operations
   * RELATIONSHIP: Maintains task categoryId
   * VALIDATION: Validates fields before saving
   * STORAGE: Uploads file if selected
   */
  async save() {
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

    // STORAGE: Upload file if selected
    if (this.selectedFile) {
      this.isUploading.set(true);
      this.uploadProgress.set(0);

      try {
        // For new tasks, we need to create first, then upload
        if (!this.id) {
          // Create task first
          this.tasksApiService.insert(task).subscribe(async (createdTask) => {
            // Upload file
            this.storageService.uploadFile(this.selectedFile!, createdTask.id).subscribe({
              next: (result) => {
                // Update task with file URL
                const updatedTask: Task = {
                  ...createdTask,
                  fileUrl: result.url,
                  fileName: this.selectedFile!.name
                };
                
                this.tasksApiService.update(createdTask.id, updatedTask).subscribe(() => {
                  this.isUploading.set(false);
                  alert('Tarefa cadastrada com sucesso!');
                  this.task.set({ id:0, title:'', description:'', priority:1, completed:false, categoryId: 1 });
                  this.errors.set({});
                  this.selectedFile = null;
                  this.router.navigate(['/tabela']);
                });
              },
              error: (err) => {
                console.error('Upload error:', err);
                this.isUploading.set(false);
                alert('Erro ao fazer upload do arquivo. Tarefa foi criada sem arquivo.');
                this.router.navigate(['/tabela']);
              }
            });
          });
          return;
        } else {
          // For existing tasks, upload and update
          this.storageService.uploadFile(this.selectedFile!, this.id).subscribe({
            next: (result) => {
              task.fileUrl = result.url;
              task.fileName = this.selectedFile!.name;
              
              this.tasksApiService.update(this.id!, task).subscribe(() => {
                this.isUploading.set(false);
                alert('Tarefa editada com sucesso!');
                this.router.navigate(['/tabela']);
              });
            },
            error: (err) => {
              console.error('Upload error:', err);
              this.isUploading.set(false);
              alert('Erro ao fazer upload do arquivo. Tarefa foi atualizada sem arquivo.');
              this.tasksApiService.update(this.id!, task).subscribe(() => {
                this.router.navigate(['/tabela']);
              });
            }
          });
          return;
        }
      } catch (err) {
        console.error('Upload exception:', err);
        this.isUploading.set(false);
      }
    }
    
    // Save without file
    if(this.id) {
      // CRUD: UPDATE - Edit existing task
      this.tasksApiService.update(this.id, task).subscribe(() => {
        alert('Tarefa editada com sucesso!');
        // SPA NAVIGATION: Return to table
        this.router.navigate(['/tabela']);
      });
    } else {
      // CRUD: CREATE - Create new task
      this.tasksApiService.insert(task).subscribe(() => {
        alert('Tarefa cadastrada com sucesso!');
        // Clear form for new entry
        this.task.set({ id:0, title:'', description:'', priority:1, completed:false, categoryId: 1 });
        this.errors.set({});
        this.selectedFile = null;
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
