import { Component, Input, inject, signal } from '@angular/core';
import { Task } from '../tasks';
import { CategoriesApiService } from '../categories-api-service';
import { Category } from '../category';

@Component({
  selector: 'card-tarefas',
  templateUrl: 'card-tarefas.html',
  styleUrls: ['card-tarefas.css'],
  standalone: true
})
export class CardTarefas {
  @Input() task!: Task;
  categories = signal<Category[]>([]);
  private categoriesApiService = inject(CategoriesApiService);

  constructor() {
    this.categoriesApiService.list().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.name : 'No category';
  }
}
