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
   * Open file viewer - Ensure correct URL
   */
  openFileViewer(fileUrl: string, fileName?: string) {
    console.log('Open viewer requested:', { fileUrl, fileName });
    
    // Extract file path and rebuild URL if needed
    const urlParts = fileUrl.split('/tarefas-arquivos/');
    let finalUrl = fileUrl;
    
    if (urlParts.length > 1) {
      // Full URL already, use as is
      finalUrl = fileUrl;
    } else if (fileUrl.includes('tarefas-arquivos/')) {
      // Partial URL, try to fix
      const altParts = fileUrl.split('tarefas-arquivos/');
      if (altParts.length > 1) {
        const filePath = altParts[1];
        // Rebuild public URL
        finalUrl = this.storageService.getFileUrl(filePath);
      }
    } else if (!fileUrl.startsWith('http')) {
      // Just a path, rebuild URL
      finalUrl = this.storageService.getFileUrl(fileUrl);
    }
    
    // For PDFs, ensure URL is direct and doesn't have query params that might break iframe
    const extension = finalUrl.split('.').pop()?.toLowerCase() || '';
    if (extension === 'pdf') {
      // Remove any existing query params or fragments that might interfere
      const urlObj = new URL(finalUrl);
      urlObj.search = ''; // Clear query params
      urlObj.hash = ''; // Clear hash
      finalUrl = urlObj.toString();
    }
    
    console.log('Final URL for viewer:', finalUrl);
    this.currentFileUrl.set(finalUrl);
    this.currentFileName.set(fileName || 'Arquivo');
    
    // Detectar tipo de arquivo pela extensão
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
   * Download file - Use StorageService to ensure correct URL and permissions
   */
  downloadFile(fileUrl: string, fileName: string) {
    console.log('Download requested:', { fileUrl, fileName });
    
    // Extract file path from URL
    const urlParts = fileUrl.split('/tarefas-arquivos/');
    let filePath = '';
    
    if (urlParts.length > 1) {
      filePath = urlParts[1];
    } else if (fileUrl.includes('tarefas-arquivos/')) {
      const altParts = fileUrl.split('tarefas-arquivos/');
      if (altParts.length > 1) {
        filePath = altParts[1];
      }
    }
    
    if (filePath) {
      // Use StorageService download method
      console.log('Using StorageService, filePath:', filePath);
      this.storageService.downloadFile(filePath).subscribe({
        next: (blob) => {
          if (!blob || blob.size === 0) {
            throw new Error('Empty blob received');
          }
          
          const extension = fileName.split('.').pop()?.toLowerCase() || '';
          let mimeType = blob.type || 'application/octet-stream';
          
          if (!mimeType || mimeType === 'application/octet-stream') {
            if (extension === 'png') mimeType = 'image/png';
            else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
            else if (extension === 'gif') mimeType = 'image/gif';
            else if (extension === 'pdf') mimeType = 'application/pdf';
            else if (extension === 'webp') mimeType = 'image/webp';
          }
          
          const typedBlob = new Blob([blob], { type: mimeType });
          const url = window.URL.createObjectURL(typedBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
        },
        error: (err) => {
          console.error('StorageService download error:', err);
          this.downloadViaFetch(fileUrl, fileName);
        }
      });
    } else {
      this.downloadViaFetch(fileUrl, fileName);
    }
  }

  /**
   * Fallback download via fetch
   */
  downloadViaFetch(fileUrl: string, fileName: string) {
    fetch(fileUrl, {
      method: 'GET',
      mode: 'cors'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.blob();
    })
    .then(blob => {
      if (!blob || blob.size === 0) {
        throw new Error('Empty blob received');
      }
      
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      let mimeType = blob.type || 'application/octet-stream';
      
      if (!mimeType || mimeType === 'application/octet-stream') {
        if (extension === 'png') mimeType = 'image/png';
        else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
        else if (extension === 'gif') mimeType = 'image/gif';
        else if (extension === 'pdf') mimeType = 'application/pdf';
        else if (extension === 'webp') mimeType = 'image/webp';
      }
      
      const typedBlob = new Blob([blob], { type: mimeType });
      const url = window.URL.createObjectURL(typedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    })
    .catch(error => {
      console.error('Fetch download error:', error);
      alert(`Erro ao baixar arquivo: ${error.message}\n\nVerifique se o arquivo existe e se você tem permissão.`);
    });
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
