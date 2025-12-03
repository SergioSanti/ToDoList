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
  // Search field for filter
  searchName = '';
  
  // Signals for reactive data
  taskList = signal<Task[]>([]);
  categories = signal<Category[]>([]);

  // Computed: Filtered tasks with comprehensive search
  filteredTasks = computed(() => {
    const tasks = this.taskList();
    const searchText = this.searchName?.toLowerCase().trim() || '';
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
