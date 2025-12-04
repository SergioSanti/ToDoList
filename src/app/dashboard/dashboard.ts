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
   * Open file in new tab - Simple and reliable
   */
  openFileViewer(fileUrl: string, fileName?: string) {
    console.log('Open viewer requested:', { fileUrl, fileName });
    
    // Extract file path from URL
    const filePath = this.storageService.extractFilePath(fileUrl);
    
    if (!filePath) {
      console.error('Could not extract file path from URL:', fileUrl);
      alert('Erro: URL do arquivo inválida.');
      return;
    }
    
    // Get public URL (always use getFileUrl to ensure correct URL)
    const finalUrl = this.storageService.getFileUrl(filePath);
    console.log('Final URL for viewer:', finalUrl);
    
    // Simply open in new tab - this always works
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  }


  /**
   * Download file - Use StorageService to ensure correct URL and permissions
   */
  downloadFile(fileUrl: string, fileName: string) {
    console.log('Download requested:', { fileUrl, fileName });
    
    // Extract file path from URL using StorageService method
    const filePath = this.storageService.extractFilePath(fileUrl);
    
    if (!filePath) {
      console.error('Could not extract file path from URL:', fileUrl);
      alert('Erro: URL do arquivo inválida.');
      return;
    }
    
    console.log('Using StorageService, filePath:', filePath);
    
    // Use StorageService download method (works with authentication)
    this.storageService.downloadFile(filePath).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) {
          throw new Error('Empty blob received');
        }
        
        // Get MIME type
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        let mimeType = blob.type || 'application/octet-stream';
        
        if (!mimeType || mimeType === 'application/octet-stream') {
          if (extension === 'png') mimeType = 'image/png';
          else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
          else if (extension === 'gif') mimeType = 'image/gif';
          else if (extension === 'pdf') mimeType = 'application/pdf';
          else if (extension === 'webp') mimeType = 'image/webp';
        }
        
        // Create blob with correct MIME type
        const typedBlob = new Blob([blob], { type: mimeType });
        
        // Create download link
        const url = window.URL.createObjectURL(typedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      },
      error: (err) => {
        console.error('StorageService download error:', err);
        // Fallback to fetch
        this.downloadViaFetch(fileUrl, fileName);
      }
    });
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
      this.loadData(); // Recarrega os dados
      this.loadEdgeFunctionStats(); // Reload Edge Function stats
    });
  }

  /**
   * Show delete dialog with options
   */
  private showDeleteDialog(): Promise<'soft' | 'hard' | 'cancel'> {
    return new Promise((resolve) => {
      // Show initial dialog with options
      const message = 'O que deseja fazer com esta tarefa?\n\n' +
        'Digite:\n' +
        '1 - Para Mover para excluídas\n' +
        '2 - Para Excluir Permanentemente\n' +
        '3 - Para Cancelar';
      
      const choice = prompt(message);
      
      if (choice === '1') {
        // Soft delete
        resolve('soft');
      } else if (choice === '2') {
        // Hard delete - ask for confirmation
        if (confirm('⚠️ ATENÇÃO: Esta ação não pode ser desfeita!\n\n' +
                   'A tarefa e seu arquivo anexado (se houver) serão permanentemente removidos.\n\n' +
                   'Deseja realmente excluir permanentemente?')) {
          resolve('hard');
        } else {
          resolve('cancel');
        }
      } else {
        // Cancel or invalid input
        resolve('cancel');
      }
    });
  }

  /**
   * Delete task with options (soft delete or permanent delete)
   */
  deleteTask(id: number) {
    this.showDeleteDialog().then((choice) => {
      if (choice === 'soft') {
        // Soft delete: move to deleted
        this.tasksApiService.delete(id).subscribe(() => {
          this.loadData(); // Recarrega os dados
          this.loadEdgeFunctionStats(); // Reload Edge Function stats
        });
      } else if (choice === 'hard') {
        // Hard delete: delete permanently
        const task = this.allTasks().find(t => t.id === id);
        if (task?.fileUrl) {
          // Delete file from storage first
          const filePath = this.storageService.extractFilePath(task.fileUrl);
          if (filePath) {
            this.storageService.deleteFile(filePath).subscribe({
              next: () => {
                // Then delete task from database
                this.tasksApiService.deletePermanently(id).subscribe(() => {
                  this.loadData();
                  this.loadEdgeFunctionStats();
                });
              },
              error: (err) => {
                console.error('Erro ao deletar arquivo:', err);
                // Delete task anyway
                this.tasksApiService.deletePermanently(id).subscribe(() => {
                  this.loadData();
                  this.loadEdgeFunctionStats();
                });
              }
            });
          } else {
            // No file, just delete task
            this.tasksApiService.deletePermanently(id).subscribe(() => {
              this.loadData();
              this.loadEdgeFunctionStats();
            });
          }
        } else {
          // No file, just delete task
          this.tasksApiService.deletePermanently(id).subscribe(() => {
            this.loadData();
            this.loadEdgeFunctionStats();
          });
        }
      }
      // If choice === 'cancel', do nothing
    });
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
