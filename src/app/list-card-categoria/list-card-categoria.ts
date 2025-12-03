import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesApiService } from '../categories-api-service';
import { Category } from '../category';

@Component({
  selector: 'app-list-card-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-card-categoria.html',
  styleUrls: ['./list-card-categoria.css']
})
export class ListCardCategoria {
  categories = signal<Category[]>([]);
  private categoriesApiService = inject(CategoriesApiService);

  constructor() {
    this.categoriesApiService.list().subscribe((categories) => {
      this.categories.set(categories);
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
