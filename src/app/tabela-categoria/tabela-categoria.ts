import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoriaApiService } from '../categoria-api-service';
import { Categoria } from '../categoria';

@Component({
  selector: 'app-tabela-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tabela-categoria.html',
  styleUrls: ['./tabela-categoria.css']
})
export class TabelaCategoria {
  listaCategorias = signal<Categoria[]>([]);
  private categoriaApiService = inject(CategoriaApiService);

  constructor() {
    this.categoriaApiService.listar().subscribe((categorias) => {
      this.listaCategorias.set(categorias);
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      this.categoriaApiService.deletar(id).subscribe(() => {
        this.listaCategorias.set(this.listaCategorias().filter(c => c.id !== id));
      });
    }
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
