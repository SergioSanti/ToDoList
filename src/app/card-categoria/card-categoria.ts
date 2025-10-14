import { Component, Input } from '@angular/core';
import { Categoria } from '../categoria';

@Component({
  selector: 'card-categoria',
  templateUrl: 'card-categoria.html',
  styleUrls: ['card-categoria.css'],
  standalone: true
})
export class CardCategoria {
  @Input() categoria!: Categoria;

  getContrastColor(hexColor: string): string {
    // Remove o # se presente
    const color = hexColor.replace('#', '');
    
    // Converte para RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Calcula o brilho
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Retorna branco para cores escuras, preto para cores claras
    return brightness > 128 ? '#000000' : '#ffffff';
  }
}