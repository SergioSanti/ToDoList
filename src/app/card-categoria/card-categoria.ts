import { Component, Input } from '@angular/core';
import { Category } from '../category';

@Component({
  selector: 'card-categoria',
  templateUrl: 'card-categoria.html',
  styleUrls: ['card-categoria.css'],
  standalone: true
})
export class CardCategoria {
  @Input() category!: Category;

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
