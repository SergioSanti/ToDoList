import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksApiService } from '../tasks-api-service';
import { CategoriesApiService } from '../categories-api-service';
import { Task } from '../tasks';
import { Category } from '../category';

/**
 * TASK LIST COMPONENT - RELATIONSHIP AND BUSINESS FUNCTIONALITY
 * 
 * This component implements:
 * - Display tasks in visual cards
 * - Relationship between Tasks and Categories
 * - Business functionality: integrated display
 * - Manipulate two entities simultaneously
 * - Calculate contrast colors
 */
@Component({
  selector: 'app-list-card-tarefas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-card-tarefas.html',
  styleUrls: ['./list-card-tarefas.css']
})
export class ListCardTarefas {
  // Signals for reactive data
  tasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);
  
  // Dependency injection
  private tasksApiService = inject(TasksApiService);
  private categoriesApiService = inject(CategoriesApiService);

  constructor() {
    this.loadData();
  }

  /**
   * Load data from both related entities
   * FUNCTIONALITY: Manipulate two entities simultaneously
   * RELATIONSHIP: Tasks and Categories
   */
  loadData() {
    // Load tasks
    this.tasksApiService.list().subscribe(tasks => {
      this.tasks.set(tasks);
    });
    
    // Load categories for relationship
    this.categoriesApiService.list().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  /**
   * Get category name by ID
   * FUNCTIONALITY: Relationship between two entities
   * RELATIONSHIP: Tasks → Categories (categoryId)
   */
  getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.name : 'No category';
  }

  /**
   * Get category color by ID
   * FUNCTIONALITY: Relationship between two entities
   * RELATIONSHIP: Tasks → Categories (categoryId)
   */
  getCategoryColor(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.color : '#6c757d';
  }

  /**
   * BUSINESS FUNCTIONALITY: Calculate contrast color
   * Calculates whether to use white or black text based on background color
   */
  getContrastColor(hexColor: string): string {
    const color = hexColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }
}
