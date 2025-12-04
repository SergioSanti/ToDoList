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
    // Ensure default category exists, then load all categories
    this.categoriesApiService.getOrCreateDefaultCategory().subscribe(() => {
      this.categoriesApiService.list().subscribe((categories) => {
        this.categoryList.set(categories);
      });
    });
  }

  delete(id: number) {
    const category = this.categoryList().find(c => c.id === id);
    const categoryName = category?.name || 'esta categoria';
    
    // Prevent deletion of default category "Sem categoria"
    if (categoryName === 'Sem categoria') {
      alert('A categoria "Sem categoria" não pode ser deletada!');
      return;
    }
    
    // First, count how many tasks are related to this category
    this.tasksApiService.countByCategory(id).subscribe(taskCount => {
      let message = '';
      if (taskCount > 0) {
        message = `ATENÇÃO!\n\nAo deletar a categoria "${categoryName}", todas as ${taskCount} tarefa(s) relacionada(s) serão movidas para a categoria "Sem categoria".\n\nDeseja prosseguir?`;
      } else {
        message = `Tem certeza que deseja deletar a categoria "${categoryName}"?`;
      }
      
      if (confirm(message)) {
        if (taskCount > 0) {
          // Get or create default category, then update tasks
          this.categoriesApiService.getOrCreateDefaultCategory().subscribe(defaultCategory => {
            // Update all tasks to use default category
            this.tasksApiService.updateCategoryForTasks(id, defaultCategory.id).subscribe(() => {
              // Then delete the category
              this.categoriesApiService.delete(id).subscribe({
                next: () => {
                  this.categoryList.set(this.categoryList().filter(c => c.id !== id));
                  // Reload categories to include default if it was just created
                  this.categoriesApiService.list().subscribe((categories) => {
                    this.categoryList.set(categories);
                  });
                  alert(`Categoria "${categoryName}" foi deletada com sucesso!\n\n${taskCount} tarefa(s) foram movidas para "Sem categoria".`);
                },
                error: (err) => {
                  console.error('Error deleting category:', err);
                  alert('Erro ao deletar categoria. Verifique se não há outras dependências.');
                }
              });
            });
          });
        } else {
          // No tasks, just delete the category
          this.categoriesApiService.delete(id).subscribe({
            next: () => {
              this.categoryList.set(this.categoryList().filter(c => c.id !== id));
              alert(`Categoria "${categoryName}" foi excluída com sucesso!`);
            },
            error: (err) => {
              console.error('Error deleting category:', err);
              alert('Erro ao deletar categoria.');
            }
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
