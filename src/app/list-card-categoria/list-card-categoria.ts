import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../categoria-service';
import { Categoria } from '../categoria';

@Component({
  selector: 'app-list-card-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-card-categoria.html',
  styleUrls: ['./list-card-categoria.css']
})
export class ListCardCategoria {
  categorias = signal<Categoria[]>([]);
  private categoriaService = inject(CategoriaService);

  constructor() {
    this.categorias.set(this.categoriaService.listar());
  }

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
