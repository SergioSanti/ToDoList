import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TasksApiService } from '../tasks-api-service';
import { CategoriesApiService } from '../categories-api-service';
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
  activeTasks = signal<Task[]>([]);
  deletedTasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);
  
  // Statistics
  totalTasks = signal<number>(0);
  totalActive = signal<number>(0);
  totalDeleted = signal<number>(0);
  totalCompleted = signal<number>(0);
  totalPending = signal<number>(0);

  // Dependency injection
  private tasksApiService = inject(TasksApiService);
  private categoriesApiService = inject(CategoriesApiService);

  ngOnInit() {
    this.loadData();
  }

  /**
   * Load all dashboard data
   */
  loadData() {
    // Load all tasks (including deleted)
    this.tasksApiService.listAll().subscribe((tasks) => {
      this.allTasks.set(tasks);
      
      // Separate active and deleted tasks
      const active = tasks.filter(t => !t.deleted);
      const deleted = tasks.filter(t => t.deleted);
      
      this.activeTasks.set(active);
      this.deletedTasks.set(deleted);
      
      // Calculate statistics
      this.totalTasks.set(tasks.length);
      this.totalActive.set(active.length);
      this.totalDeleted.set(deleted.length);
      this.totalCompleted.set(active.filter(t => t.completed).length);
      this.totalPending.set(active.filter(t => !t.completed).length);
    });

    // Load categories for relationship
    this.categoriesApiService.list().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  /**
   * Get category name by ID
   * RELATIONSHIP: Tasks → Categories
   */
  getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.name : 'No category';
  }

  /**
   * Restore deleted task
   */
  restoreTask(id: number) {
    if (confirm('Do you want to restore this task?')) {
      this.tasksApiService.restore(id).subscribe(() => {
        this.loadData();
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
