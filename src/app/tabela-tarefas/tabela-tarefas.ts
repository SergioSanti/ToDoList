import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TasksApiService } from '../tasks-api-service';
import { CategoriesApiService } from '../categories-api-service';
import { Task } from '../tasks';
import { Category } from '../category';
import { filter } from 'rxjs/operators';

/**
 * TASKS TABLE COMPONENT - CRUD AND RELATIONSHIP
 * 
 * This component implements:
 * - Display tasks in table
 * - Search/filter functionality using Pipes
 * - Relationship between Tasks and Categories
 * - CRUD operations (Edit/Delete)
 * - SPA navigation between screens
 * 
 */
@Component({
  selector: 'app-tabela-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tabela-tarefas.html',
  styleUrls: ['./tabela-tarefas.css']
})
export class TabelaTarefas implements OnInit {
  // Search field for filter - MUST be signal for computed to work
  searchName = signal<string>('');
  
  // Signals for reactive data
  taskList = signal<Task[]>([]);
  categories = signal<Category[]>([]);

  // File viewer
  showFileViewer = signal<boolean>(false);
  currentFileUrl = signal<string>('');
  currentFileName = signal<string>('');
  currentFileType = signal<string>('');

  // Computed: Filtered tasks with comprehensive search
  filteredTasks = computed(() => {
    const tasks = this.taskList();
    const searchText = this.searchName()?.toLowerCase().trim() || '';
    const cats = this.categories();

    if (!searchText) return tasks;

    return tasks.filter(task => {
      // Search in title
      if (task.title?.toLowerCase().includes(searchText)) return true;
      
      // Search in description
      if (task.description?.toLowerCase().includes(searchText)) return true;
      
      // Search in ID (convert to string)
      if (task.id?.toString().includes(searchText)) return true;
      
      // Search in priority (convert to string)
      if (task.priority?.toString().includes(searchText)) return true;
      
      // Search in category name
      if (cats && cats.length > 0) {
        const category = cats.find(c => c.id === task.categoryId);
        if (category?.name?.toLowerCase().includes(searchText)) return true;
      }
      
      return false;
    });
  });
  
  // Dependency injection
  private tasksApiService = inject(TasksApiService);
  private categoriesApiService = inject(CategoriesApiService);
  private router = inject(Router);

  constructor() {
    // Listen to route changes to reload data automatically
    // FUNCTIONALITY: SPA navigation with data update
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadData();
    });
  }

  ngOnInit() {
    this.loadData();
  }

  /**
   * Load data from both related entities
   * FUNCTIONALITY: Manipulate two entities simultaneously
   * RELATIONSHIP: Tasks and Categories
   */
  loadData() {
    // Load tasks
    this.tasksApiService.list().subscribe((tasks) => {
      this.taskList.set(tasks);
    });
    
    // Load categories for relationship
    this.categoriesApiService.list().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  /**
   * Update search text
   */
  onSearchChange(value: string) {
    this.searchName.set(value);
  }

  /**
   * Open file viewer
   */
  openFileViewer(fileUrl: string, fileName?: string) {
    this.currentFileUrl.set(fileUrl);
    this.currentFileName.set(fileName || 'Arquivo');
    
    // Detectar tipo de arquivo pela extensão
    const extension = fileUrl.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) {
      this.currentFileType.set('image');
    } else if (extension === 'pdf') {
      this.currentFileType.set('pdf');
    } else {
      this.currentFileType.set('other');
    }
    
    this.showFileViewer.set(true);
  }

  /**
   * Close file viewer
   */
  closeFileViewer() {
    this.showFileViewer.set(false);
    this.currentFileUrl.set('');
    this.currentFileName.set('');
    this.currentFileType.set('');
  }

  /**
   * Download file
   */
  downloadFile(fileUrl: string, fileName: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Check if file is viewable (image or PDF)
   */
  isViewableFile(fileUrl: string): boolean {
    const extension = fileUrl.split('.').pop()?.toLowerCase() || '';
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf'].includes(extension);
  }

  /**
   * Toggle task completion status
   * Quick action to mark task as complete/incomplete
   */
  toggleComplete(task: Task) {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed
    };
    
    this.tasksApiService.update(task.id, updatedTask).subscribe(() => {
      // Update local list
      this.taskList.update(tasks => 
        tasks.map(t => t.id === task.id ? updatedTask : t)
      );
    });
  }

  /**
   * DELETE - Remove task
   * CRUD: Delete operation
   */
  delete(id: number) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      this.tasksApiService.delete(id).subscribe(() => {
        // Update local list after deletion
        this.taskList.set(this.taskList().filter(t => t.id !== id));
      });
    }
  }

  /**
   * Get category name by ID
   * FUNCTIONALITY: Relationship between two entities
   * RELATIONSHIP: Tasks → Categories (categoryId)
   */
  getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.name : 'Sem categoria';
  }
}
