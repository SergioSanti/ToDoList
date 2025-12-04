import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Task } from './tasks';
import { getSupabaseClient } from './supabase-client';

/**
 * TASKS API SERVICE - COMPLETE CRUD WITH SUPABASE DATABASE
 *
 * Supabase table: "tarefas"
 * Fields: id (PK), titulo, descricao, prioridade, concluida, categoria_id, excluida, arquivo_url, arquivo_nome
 */
@Injectable({ providedIn: 'root' })
export class TasksApiService {

  /**
   * READ - List all tasks (not deleted)
   */
  list(): Observable<Task[]> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('tarefas')
        .select('*')
        .eq('excluida', false)
        .order('id', { ascending: true })
    ).pipe(
      map(result => {
        const data = result.data || [];
        return data.map((item: any) => ({
          id: item.id,
          title: item.titulo,
          description: item.descricao,
          priority: item.prioridade,
          completed: item.concluida,
          categoryId: item.categoria_id,
          deleted: item.excluida || false,
          fileUrl: item.arquivo_url || undefined,
          fileName: item.arquivo_nome || undefined,
          created_at: item.created_at,
          updated_at: item.updated_at
        } as Task));
      })
    );
  }

  /**
   * READ - List all tasks including deleted
   */
  listAll(): Observable<Task[]> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('tarefas')
        .select('*')
        .order('id', { ascending: true })
    ).pipe(
      map(result => {
        const data = result.data || [];
        return data.map((item: any) => ({
          id: item.id,
          title: item.titulo,
          description: item.descricao,
          priority: item.prioridade,
          completed: item.concluida,
          categoryId: item.categoria_id,
          deleted: item.excluida || false,
          fileUrl: item.arquivo_url || undefined,
          fileName: item.arquivo_nome || undefined,
          created_at: item.created_at,
          updated_at: item.updated_at
        } as Task));
      })
    );
  }

  /**
   * READ - List only deleted tasks
   */
  listDeleted(): Observable<Task[]> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('tarefas')
        .select('*')
        .eq('excluida', true)
        .order('id', { ascending: true })
    ).pipe(
      map(result => {
        const data = result.data || [];
        return data.map((item: any) => ({
          id: item.id,
          title: item.titulo,
          description: item.descricao,
          priority: item.prioridade,
          completed: item.concluida,
          categoryId: item.categoria_id,
          deleted: item.excluida || false,
          fileUrl: item.arquivo_url || undefined,
          fileName: item.arquivo_nome || undefined,
          created_at: item.created_at,
          updated_at: item.updated_at
        } as Task));
      })
    );
  }

  /**
   * READ - Find task by ID
   */
  findById(id?: number): Observable<Task> {
    const supabase = getSupabaseClient();
    if (!id) {
      return from(Promise.resolve({
        id: 0,
        title: '',
        description: '',
        priority: 1,
        completed: false,
        categoryId: 1,
        deleted: false
      } as Task));
    }

    return from(
      supabase
        .from('tarefas')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          title: data.titulo,
          description: data.descricao,
          priority: data.prioridade,
          completed: data.concluida,
          categoryId: data.categoria_id,
          deleted: data.excluida || false,
          fileUrl: data.arquivo_url || undefined,
          fileName: data.arquivo_nome || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Task;
      })
    );
  }

  /**
   * CREATE - Insert new task
   */
  insert(task: Task): Observable<Task> {
    const supabase = getSupabaseClient();
    const payload: any = {
      titulo: task.title,
      descricao: task.description,
      prioridade: task.priority,
      concluida: task.completed || false,
      categoria_id: task.categoryId,
      excluida: false,
      arquivo_url: task.fileUrl || null,
      arquivo_nome: task.fileName || null
    };

    return from(
      supabase
        .from('tarefas')
        .insert(payload)
        .select('*')
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          title: data.titulo,
          description: data.descricao,
          priority: data.prioridade,
          completed: data.concluida,
          categoryId: data.categoria_id,
          deleted: data.excluida || false,
          fileUrl: data.arquivo_url || undefined,
          fileName: data.arquivo_nome || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Task;
      })
    );
  }

  /**
   * UPDATE - Edit existing task
   */
  update(id: number, task: Task): Observable<Task> {
    const supabase = getSupabaseClient();
    const payload: any = {
      titulo: task.title,
      descricao: task.description,
      prioridade: task.priority,
      concluida: task.completed || false,
      categoria_id: task.categoryId,
      arquivo_url: task.fileUrl || null,
      arquivo_nome: task.fileName || null
    };

    return from(
      supabase
        .from('tarefas')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          title: data.titulo,
          description: data.descricao,
          priority: data.prioridade,
          completed: data.concluida,
          categoryId: data.categoria_id,
          deleted: data.excluida || false,
          fileUrl: data.arquivo_url || undefined,
          fileName: data.arquivo_nome || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Task;
      })
    );
  }

  /**
   * DELETE - Soft delete: marks task as deleted (does not physically remove)
   */
  delete(id?: number): Observable<Task> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('tarefas')
        .update({ excluida: true })
        .eq('id', id as number)
        .select('*')
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          title: data.titulo,
          description: data.descricao,
          priority: data.prioridade,
          completed: data.concluida,
          categoryId: data.categoria_id,
          deleted: data.excluida || false,
          fileUrl: data.arquivo_url || undefined,
          fileName: data.arquivo_nome || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Task;
      })
    );
  }

  /**
   * RESTORE - Restore deleted task
   */
  restore(id: number): Observable<Task> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('tarefas')
        .update({ excluida: false })
        .eq('id', id)
        .select('*')
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          title: data.titulo,
          description: data.descricao,
          priority: data.prioridade,
          completed: data.concluida,
          categoryId: data.categoria_id,
          deleted: data.excluida || false,
          fileUrl: data.arquivo_url || undefined,
          fileName: data.arquivo_nome || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Task;
      })
    );
  }

  /**
   * COUNT - Count tasks by category ID
   */
  countByCategory(categoryId: number): Observable<number> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('tarefas')
        .select('*', { count: 'exact', head: true })
        .eq('categoria_id', categoryId)
    ).pipe(
      map(result => result.count || 0)
    );
  }

  /**
   * DELETE BY CATEGORY - Delete all tasks by category ID
   */
  deleteByCategory(categoryId: number): Observable<void> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('tarefas')
        .update({ excluida: true })
        .eq('categoria_id', categoryId)
        .then(() => undefined)
    );
  }
}
