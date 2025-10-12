import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tarefa as TarefaModel, CreateTarefaRequest, UpdateTarefaRequest } from '../models/tarefa.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private tarefasSubject = new BehaviorSubject<TarefaModel[]>(this.getTarefasFromStorage());
  public tarefas$ = this.tarefasSubject.asObservable();

  // Dados em memória para simular banco de dados
  private tarefas: TarefaModel[] = [
    {
      id: 1,
      titulo: 'Revisar código Angular',
      descricao: 'Revisar implementação dos componentes de tarefas',
      prioridade: 'alta',
      status: 'pendente',
      categoriaId: 1,
      dataCriacao: new Date('2024-01-15'),
      usuarioId: 1
    },
    {
      id: 2,
      titulo: 'Fazer exercícios físicos',
      descricao: 'Caminhada de 30 minutos no parque',
      prioridade: 'media',
      status: 'concluida',
      categoriaId: 2,
      dataCriacao: new Date('2024-01-14'),
      dataConclusao: new Date('2024-01-14'),
      usuarioId: 1
    },
    {
      id: 3,
      titulo: 'Estudar TypeScript',
      descricao: 'Capítulos 5 e 6 do livro de TypeScript',
      prioridade: 'alta',
      status: 'pendente',
      categoriaId: 3,
      dataCriacao: new Date('2024-01-13'),
      usuarioId: 1
    }
  ];

  private nextTarefaId = 4;

  constructor(private authService: AuthService) {
    this.saveTarefasToStorage();
  }

  getAll(): Observable<TarefaModel[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const userTarefas = this.tarefas.filter(t => t.usuarioId === currentUser.id);
    this.tarefasSubject.next(userTarefas);
    return this.tarefas$;
  }

  getById(id: number): Observable<TarefaModel | null> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.next(null);
        observer.complete();
        return;
      }

      const tarefa = this.tarefas.find(t => t.id === id && t.usuarioId === currentUser.id);
      observer.next(tarefa || null);
      observer.complete();
    });
  }

  create(createRequest: CreateTarefaRequest): Observable<TarefaModel> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.error('Usuário não autenticado');
        return;
      }

      const novaTarefa: TarefaModel = {
        id: this.nextTarefaId++,
        titulo: createRequest.titulo,
        descricao: createRequest.descricao,
        prioridade: createRequest.prioridade,
        status: 'pendente',
        categoriaId: createRequest.categoriaId,
        dataCriacao: new Date(),
        usuarioId: currentUser.id
      };

      this.tarefas.push(novaTarefa);
      this.saveTarefasToStorage();
      this.getAll().subscribe(); // Atualiza a lista

      observer.next(novaTarefa);
      observer.complete();
    });
  }

  update(id: number, updateRequest: UpdateTarefaRequest): Observable<TarefaModel> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.error('Usuário não autenticado');
        return;
      }

      const index = this.tarefas.findIndex(t => t.id === id && t.usuarioId === currentUser.id);
      if (index === -1) {
        observer.error('Tarefa não encontrada');
        return;
      }

      const tarefaAtualizada = {
        ...this.tarefas[index],
        ...updateRequest
      };

      // Se mudou para concluída e não tinha data de conclusão, adiciona
      if (updateRequest.status === 'concluida' && !this.tarefas[index].dataConclusao) {
        tarefaAtualizada.dataConclusao = new Date();
      }

      // Se mudou para pendente, remove data de conclusão
      if (updateRequest.status === 'pendente') {
        tarefaAtualizada.dataConclusao = undefined;
      }

      this.tarefas[index] = tarefaAtualizada;
      this.saveTarefasToStorage();
      this.getAll().subscribe(); // Atualiza a lista

      observer.next(this.tarefas[index]);
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

      const index = this.tarefas.findIndex(t => t.id === id && t.usuarioId === currentUser.id);
      if (index === -1) {
        observer.error('Tarefa não encontrada');
        return;
      }

      this.tarefas.splice(index, 1);
      this.saveTarefasToStorage();
      this.getAll().subscribe(); // Atualiza a lista

      observer.next(true);
      observer.complete();
    });
  }

  toggleStatus(id: number): Observable<TarefaModel> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.error('Usuário não autenticado');
        return;
      }

      const tarefa = this.tarefas.find(t => t.id === id && t.usuarioId === currentUser.id);
      if (!tarefa) {
        observer.error('Tarefa não encontrada');
        return;
      }

      const novoStatus = tarefa.status === 'pendente' ? 'concluida' : 'pendente';
      this.update(id, { status: novoStatus }).subscribe({
        next: (tarefaAtualizada) => {
          observer.next(tarefaAtualizada);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getByCategoria(categoriaId: number): Observable<TarefaModel[]> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.next([]);
        observer.complete();
        return;
      }

      const tarefasCategoria = this.tarefas.filter(t => 
        t.categoriaId === categoriaId && t.usuarioId === currentUser.id
      );
      observer.next(tarefasCategoria);
      observer.complete();
    });
  }

  getByStatus(status: 'pendente' | 'concluida'): Observable<TarefaModel[]> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.next([]);
        observer.complete();
        return;
      }

      const tarefasStatus = this.tarefas.filter(t => 
        t.status === status && t.usuarioId === currentUser.id
      );
      observer.next(tarefasStatus);
      observer.complete();
    });
  }

  search(termo: string): Observable<TarefaModel[]> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        observer.next([]);
        observer.complete();
        return;
      }

      const termoLower = termo.toLowerCase();
      const tarefasEncontradas = this.tarefas.filter(t => 
        t.usuarioId === currentUser.id &&
        (t.titulo.toLowerCase().includes(termoLower) || 
         t.descricao.toLowerCase().includes(termoLower))
      );
      observer.next(tarefasEncontradas);
      observer.complete();
    });
  }

  private getTarefasFromStorage(): TarefaModel[] {
    const tarefasStr = localStorage.getItem('tarefas');
    if (tarefasStr) {
      this.tarefas = JSON.parse(tarefasStr).map((t: any) => ({
        ...t,
        dataCriacao: new Date(t.dataCriacao),
        dataConclusao: t.dataConclusao ? new Date(t.dataConclusao) : undefined
      }));
      this.nextTarefaId = Math.max(...this.tarefas.map(t => t.id)) + 1;
    }
    return this.tarefas;
  }

  private saveTarefasToStorage(): void {
    localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
  }
}
