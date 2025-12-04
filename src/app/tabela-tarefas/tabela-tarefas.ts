import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TasksApiService } from '../tasks-api-service';
import { CategoriesApiService } from '../categories-api-service';
import { StorageService } from '../storage-service';
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
  private storageService = inject(StorageService);
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
    // Ensure URL is properly formatted
    let url = fileUrl;
    if (!url.startsWith('http')) {
      // If it's a relative path, make it absolute
      url = url.startsWith('/') ? url : '/' + url;
    }
    
    this.currentFileUrl.set(url);
    this.currentFileName.set(fileName || 'Arquivo');
    
    // Detectar tipo de arquivo pela extensão
    const extension = url.split('.').pop()?.toLowerCase() || '';
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
   * Download file - Forces real download instead of opening in browser
   */
  downloadFile(fileUrl: string, fileName: string) {
    // Extract file path from URL
    // URL format: https://...supabase.co/storage/v1/object/public/tarefas-arquivos/2/2-1764811978789.PNG
    const urlParts = fileUrl.split('/tarefas-arquivos/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      
      // Use StorageService to download as blob
      this.storageService.downloadFile(filePath).subscribe({
        next: (blob) => {
          // Create blob URL and trigger download
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up blob URL
          window.URL.revokeObjectURL(blobUrl);
        },
        error: (err) => {
          console.error('Error downloading file:', err);
          // Fallback: try direct download
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileName;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    } else {
      // Fallback if URL format is unexpected
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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

  /**
   * Handle image loading error
   */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-danger';
      errorDiv.innerHTML = `
        <p class="mb-1"><strong>Erro ao carregar imagem</strong></p>
        <p class="mb-0 small text-muted">URL: ${this.currentFileUrl()}</p>
        <p class="mb-0 small">Verifique se o arquivo existe e se as permissões estão corretas.</p>
      `;
      img.parentElement?.appendChild(errorDiv);
    }
  }
}
