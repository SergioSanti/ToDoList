import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TasksApiService } from '../tasks-api-service';
import { CategoriesApiService } from '../categories-api-service';
import { EdgeFunctionsService } from '../edge-functions-service';
import { StorageService } from '../storage-service';
import { Task } from '../tasks';
import { Category } from '../category';

/**
 * DASHBOARD COMPONENT - MAIN PAGE
 * 
 * This component implements:
 * - View all tasks (active and deleted)
 * - Statistics and task summary
 * - Separation between active and deleted tasks
 * - Relationship with Categories
 * - EDGE FUNCTIONS: Uses cloud function for business logic
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  // Signals for reactive data
  allTasks = signal<Task[]>([]);
  activeTasks = signal<Task[]>([]); // Apenas tarefas ativas e NÃO concluídas
  completedTasks = signal<Task[]>([]);
  deletedTasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);
  
  // Statistics
  totalTasks = signal<number>(0);
  totalActive = signal<number>(0);
  totalCompleted = signal<number>(0);
  totalDeleted = signal<number>(0);
  totalPending = signal<number>(0);

  // EDGE FUNCTIONS: Statistics from cloud function
  edgeFunctionStats = signal<any>(null);
  isLoadingStats = signal<boolean>(false);

  // File viewer
  showFileViewer = signal<boolean>(false);
  currentFileUrl = signal<string>('');
  currentFileName = signal<string>('');
  currentFileType = signal<string>('');

  // Dependency injection
  private tasksApiService = inject(TasksApiService);
  private categoriesApiService = inject(CategoriesApiService);
  private edgeFunctionsService = inject(EdgeFunctionsService);
  private storageService = inject(StorageService);

  ngOnInit() {
    this.loadData();
    this.loadEdgeFunctionStats();
  }

  /**
   * Load all dashboard data
   */
  loadData() {
    // Load all tasks (including deleted)
    this.tasksApiService.listAll().subscribe((tasks) => {
      this.allTasks.set(tasks);
      
      // Separate tasks by status
      const active = tasks.filter(t => !t.deleted && !t.completed); // Apenas não deletadas E não concluídas
      const completed = tasks.filter(t => !t.deleted && t.completed); // Não deletadas E concluídas
      const deleted = tasks.filter(t => t.deleted);
      
      // Ordenar por prioridade (5 = maior, 1 = menor) - ordem decrescente
      active.sort((a, b) => b.priority - a.priority);
      completed.sort((a, b) => b.priority - a.priority);
      deleted.sort((a, b) => b.priority - a.priority);
      
      this.activeTasks.set(active);
      this.completedTasks.set(completed);
      this.deletedTasks.set(deleted);
      
      // Calculate statistics
      this.totalTasks.set(tasks.length);
      this.totalActive.set(active.length);
      this.totalCompleted.set(completed.length);
      this.totalDeleted.set(deleted.length);
      this.totalPending.set(active.length); // Pendentes = ativas (já que ativas = não concluídas)
    });

    // Load categories for relationship
    this.categoriesApiService.list().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  /**
   * Calculate completion rate correctly
   * Taxa = (Completas / (Ativas + Completas)) * 100
   */
  calculateCompletionRate(): number {
    const active = this.totalActive();
    const completed = this.totalCompleted();
    const totalNotDeleted = active + completed;
    
    if (totalNotDeleted === 0) return 0;
    
    return Math.round((completed / totalNotDeleted) * 100);
  }

  /**
   * Calculate completion rate from Edge Function data
   * Calcula taxa de conclusão usando dados da Edge Function
   */
  getEdgeFunctionCompletionRate(): number {
    const stats = this.edgeFunctionStats();
    if (!stats) return 0;
    
    // Se a Edge Function retornar completionRate, usa ele
    if (stats.completionRate !== undefined && stats.completionRate !== null) {
      return Math.round(stats.completionRate * 100) / 100;
    }
    
    // Caso contrário, calcula usando os dados da Edge Function
    const activeTasks = stats.activeTasks || 0;
    const completedTasks = stats.completedTasks || 0;
    const totalNotDeleted = activeTasks + completedTasks;
    
    if (totalNotDeleted === 0) return 0;
    
    const rate = (completedTasks / totalNotDeleted) * 100;
    return Math.round(rate * 100) / 100;
  }

  /**
   * EDGE FUNCTIONS: Load statistics from cloud function
   * BUSINESS FUNCTIONALITY: Uses Edge Function to process data
   */
  loadEdgeFunctionStats() {
    this.isLoadingStats.set(true);
    this.edgeFunctionsService.getTaskSummary().subscribe({
      next: (stats) => {
        this.edgeFunctionStats.set(stats);
        this.isLoadingStats.set(false);
        console.log('Edge Function Stats:', stats);
        console.log('Active Tasks:', stats?.activeTasks);
        console.log('Completed Tasks:', stats?.completedTasks);
        console.log('Completion Rate:', stats?.completionRate);
      },
      error: (err) => {
        console.error('Error loading Edge Function stats:', err);
        this.isLoadingStats.set(false);
        // Continue without Edge Function stats if it fails
      }
    });
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
    // Clean up blob URL if it was created
    const currentUrl = this.currentFileUrl();
    if (currentUrl && currentUrl.startsWith('blob:')) {
      window.URL.revokeObjectURL(currentUrl);
    }
    
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
          // Verify blob is valid
          if (!blob || blob.size === 0) {
            console.error('Invalid blob received');
            this.downloadViaFetch(fileUrl, fileName);
            return;
          }
          
          // Get file extension to determine MIME type
          const extension = fileName.split('.').pop()?.toLowerCase() || '';
          let mimeType = 'application/octet-stream';
          
          if (extension === 'png') mimeType = 'image/png';
          else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
          else if (extension === 'gif') mimeType = 'image/gif';
          else if (extension === 'pdf') mimeType = 'application/pdf';
          else if (extension === 'webp') mimeType = 'image/webp';
          
          // Create new blob with correct MIME type
          const typedBlob = new Blob([blob], { type: mimeType });
          
          // Create blob URL and trigger download
          const blobUrl = window.URL.createObjectURL(typedBlob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up blob URL
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
        },
        error: (err) => {
          console.error('Error downloading file via StorageService:', err);
          // Fallback: download via fetch
          this.downloadViaFetch(fileUrl, fileName);
        }
      });
    } else {
      // Fallback: download via fetch
      this.downloadViaFetch(fileUrl, fileName);
    }
  }

  /**
   * Download file via fetch as fallback
   */
  downloadViaFetch(fileUrl: string, fileName: string) {
    fetch(fileUrl, {
      method: 'GET',
      mode: 'cors'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      // Get file extension to determine MIME type
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      let mimeType = 'application/octet-stream';
      
      if (extension === 'png') mimeType = 'image/png';
      else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
      else if (extension === 'gif') mimeType = 'image/gif';
      else if (extension === 'pdf') mimeType = 'application/pdf';
      else if (extension === 'webp') mimeType = 'image/webp';
      
      // Create new blob with correct MIME type
      const typedBlob = new Blob([blob], { type: mimeType });
      
      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(typedBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    })
    .catch(error => {
      console.error('Error downloading file via fetch:', error);
      // Last resort: direct download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      this.loadData(); // Recarrega os dados
      this.loadEdgeFunctionStats(); // Reload Edge Function stats
    });
  }

  /**
   * Delete task (soft delete)
   */
  deleteTask(id: number) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.tasksApiService.delete(id).subscribe(() => {
        this.loadData(); // Recarrega os dados
        this.loadEdgeFunctionStats(); // Reload Edge Function stats
      });
    }
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp?: string): string {
    if (!timestamp) return '-';
    try {
      return new Date(timestamp).toLocaleString('pt-BR');
    } catch {
      return '-';
    }
  }

  /**
   * Get category name by ID
   * RELATIONSHIP: Tasks → Categories
   */
  getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.name : 'Sem categoria';
  }

  /**
   * Restore deleted task
   */
  restoreTask(id: number) {
    if (confirm('Deseja restaurar esta tarefa?')) {
      this.tasksApiService.restore(id).subscribe(() => {
        this.loadData();
        this.loadEdgeFunctionStats(); // Reload Edge Function stats
      });
    }
  }

  /**
   * Get category color by ID
   * RELATIONSHIP: Tasks → Categories
   */
  getCategoryColor(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.color : '#6c757d';
  }

  /**
   * Calculate contrast color for text
   * BUSINESS FUNCTIONALITY: Calculates whether to use white or black text
   */
  getContrastColor(hexColor: string): string {
    const color = hexColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  /**
   * Get CSS class for priority
   */
  getPriorityClass(priority: number): string {
    if (priority >= 4) return 'badge bg-danger';
    if (priority >= 3) return 'badge bg-warning';
    if (priority === 2) return 'badge bg-info';
    return 'badge bg-success';
  }
}
