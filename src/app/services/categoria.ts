import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categoria as CategoriaModel, CreateCategoriaRequest, UpdateCategoriaRequest } from '../models/categoria.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private categoriasSubject = new BehaviorSubject<CategoriaModel[]>(this.getCategoriasFromStorage());
  public categorias$ = this.categoriasSubject.asObservable();

  // Dados em memória para simular banco de dados
  private categorias: CategoriaModel[] = [
    {
      id: 1,
      nome: 'Trabalho',
      descricao: 'Tarefas relacionadas ao trabalho',
      cor: '#007bff',
      usuarioId: 1
    },
    {
      id: 2,
      nome: 'Pessoal',
      descricao: 'Tarefas pessoais',
      cor: '#28a745',
      usuarioId: 1
    },
    {
      id: 3,
      nome: 'Estudos',
      descricao: 'Tarefas de estudo',
      cor: '#ffc107',
      usuarioId: 1
    }
  ];

  private nextCategoriaId = 4;

  constructor(private authService: AuthService) {
    this.saveCategoriasToStorage();
  }

  getAll(): Observable<CategoriaModel[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const userCategorias = this.categorias.filter(c => c.usuarioId === currentUser.id);
    this.categoriasSubject.next(userCategorias);
    return this.categorias$;
  }

  getById(id: number): Observable<CategoriaModel | null> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.next(null);
        observer.complete();
        return;
      }

      const categoria = this.categorias.find(c => c.id === id && c.usuarioId === currentUser.id);
      observer.next(categoria || null);
      observer.complete();
    });
  }

  create(createRequest: CreateCategoriaRequest): Observable<CategoriaModel> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.error('Usuário não autenticado');
        return;
      }

      const novaCategoria: CategoriaModel = {
        id: this.nextCategoriaId++,
        nome: createRequest.nome,
        descricao: createRequest.descricao,
        cor: createRequest.cor,
        usuarioId: currentUser.id
      };

      this.categorias.push(novaCategoria);
      this.saveCategoriasToStorage();
      this.getAll().subscribe(); // Atualiza a lista

      observer.next(novaCategoria);
      observer.complete();
    });
  }

  update(id: number, updateRequest: UpdateCategoriaRequest): Observable<CategoriaModel> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.error('Usuário não autenticado');
        return;
      }

      const index = this.categorias.findIndex(c => c.id === id && c.usuarioId === currentUser.id);
      if (index === -1) {
        observer.error('Categoria não encontrada');
        return;
      }

      this.categorias[index] = {
        ...this.categorias[index],
        ...updateRequest
      };

      this.saveCategoriasToStorage();
      this.getAll().subscribe(); // Atualiza a lista

      observer.next(this.categorias[index]);
      observer.complete();
    });
  }

  delete(id: number): Observable<boolean> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.error('Usuário não autenticado');
        return;
      }

      const index = this.categorias.findIndex(c => c.id === id && c.usuarioId === currentUser.id);
      if (index === -1) {
        observer.error('Categoria não encontrada');
        return;
      }

      this.categorias.splice(index, 1);
      this.saveCategoriasToStorage();
      this.getAll().subscribe(); // Atualiza a lista

      observer.next(true);
      observer.complete();
    });
  }

  private getCategoriasFromStorage(): CategoriaModel[] {
    const categoriasStr = localStorage.getItem('categorias');
    if (categoriasStr) {
      this.categorias = JSON.parse(categoriasStr);
      this.nextCategoriaId = Math.max(...this.categorias.map(c => c.id)) + 1;
    }
    return this.categorias;
  }

  private saveCategoriasToStorage(): void {
    localStorage.setItem('categorias', JSON.stringify(this.categorias));
  }
}
