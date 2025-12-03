import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoriesApiService } from '../categories-api-service';
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

  constructor() {
    this.categoriesApiService.list().subscribe((categories) => {
      this.categoryList.set(categories);
    });
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoriesApiService.delete(id).subscribe(() => {
        this.categoryList.set(this.categoryList().filter(c => c.id !== id));
      });
    }
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
