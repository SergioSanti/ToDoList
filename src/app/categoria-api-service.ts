import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Categoria } from './categoria';

@Injectable({ providedIn: 'root' })
export class CategoriaApiService {
  private listaCategorias: Categoria[] = [
    { id:1, nome:'Trabalho', descricao:'Tarefas relacionadas ao trabalho', cor:'#007bff' },
    { id:2, nome:'Pessoal', descricao:'Tarefas pessoais', cor:'#28a745' }
  ];

  listar(): Observable<Categoria[]> {
    return of(this.listaCategorias);
  }

  buscarPorId(id?: number): Observable<Categoria> {
    const categoria = this.listaCategorias.find(c => c.id === id);
    if (!categoria) {
      // Retorna uma categoria vazia se não encontrar
      return of({ id: 0, nome: '', descricao: '', cor: '#007bff' });
    }
    return of(categoria);
  }

  inserir(categoria: Categoria): Observable<Categoria> {
    categoria.id = this.listaCategorias.length + 1;
    this.listaCategorias.push(categoria);
    return of(categoria);
  }

  editar(id: number, categoria: Categoria): Observable<Categoria> {
    const index = this.listaCategorias.findIndex(c => c.id === id);
    this.listaCategorias[index] = categoria;
    return of(categoria);
  }

  deletar(id?: number): Observable<Categoria> {
    const index = this.listaCategorias.findIndex(c => c.id === id);
    const categoria = this.listaCategorias[index];
    this.listaCategorias.splice(index, 1);
    return of(categoria);
  }
}
