import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoriesApiService } from '../categories-api-service';
import { TasksApiService } from '../tasks-api-service';
import { Category } from '../category';

@Component({
  selector: 'app-tabela-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tabela-categoria.html',
  styleUrls: ['./tabela-categoria.css']
})
export class TabelaCategoria {
  categoryList = signal<Category[]>([]);
  private categoriesApiService = inject(CategoriesApiService);
  private tasksApiService = inject(TasksApiService);

  constructor() {
    this.categoriesApiService.list().subscribe((categories) => {
      this.categoryList.set(categories);
    });
  }

  delete(id: number) {
    // First, count how many tasks are related to this category
    this.tasksApiService.countByCategory(id).subscribe(taskCount => {
      const category = this.categoryList().find(c => c.id === id);
      const categoryName = category?.name || 'esta categoria';
      
      let message = '';
      if (taskCount > 0) {
        message = `ATENÇÃO!\n\nAo deletar a categoria "${categoryName}", todas as ${taskCount} tarefa(s) relacionada(s) serão excluídas permanentemente.\n\nDeseja prosseguir?`;
      } else {
        message = `Tem certeza que deseja deletar a categoria "${categoryName}"?`;
      }
      
      if (confirm(message)) {
        // Delete tasks first, then category
        if (taskCount > 0) {
          // Delete all tasks related to this category
          this.tasksApiService.deleteByCategory(id).subscribe(() => {
            // Then delete the category
            this.categoriesApiService.delete(id).subscribe(() => {
              this.categoryList.set(this.categoryList().filter(c => c.id !== id));
              alert(`Categoria "${categoryName}" e ${taskCount} tarefa(s) relacionada(s) foram excluídas com sucesso!`);
            });
          });
        } else {
          // No tasks, just delete the category
          this.categoriesApiService.delete(id).subscribe(() => {
            this.categoryList.set(this.categoryList().filter(c => c.id !== id));
            alert(`Categoria "${categoryName}" foi excluída com sucesso!`);
          });
        }
      }
    });
  }

  getContrastColor(hexColor: string): string {
    // Remove # if present
    const color = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white for dark colors, black for light colors
    return brightness > 128 ? '#000000' : '#ffffff';
  }
}
