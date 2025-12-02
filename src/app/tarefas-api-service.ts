import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Tarefas } from './tarefas';
import { getSupabaseClient } from './supabase-client';

/**
 * SERVIÇO DE TAREFAS - CRUD COMPLETO COM SUPABASE DATABASE
 *
 * Tabela sugerida no Supabase: "tarefas"
 * Campos: id (PK), titulo, descricao, prioridade, concluida, categoria_id, arquivo_url
 */
@Injectable({ providedIn: 'root' })
export class TarefasApiService {

  /**
   * READ - Lista todas as tarefas (não excluídas)
   */
  listar(): Observable<Tarefas[]> {
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
          titulo: item.titulo,
          descricao: item.descricao,
          prioridade: item.prioridade,
          concluida: item.concluida,
          categoriaId: item.categoria_id,
          excluida: item.excluida || false,
          created_at: item.created_at,
          updated_at: item.updated_at
        } as Tarefas));
      })
    );
  }

  /**
   * READ - Lista todas as tarefas incluindo excluídas
   */
  listarTodas(): Observable<Tarefas[]> {
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
          titulo: item.titulo,
          descricao: item.descricao,
          prioridade: item.prioridade,
          concluida: item.concluida,
          categoriaId: item.categoria_id,
          excluida: item.excluida || false,
          created_at: item.created_at,
          updated_at: item.updated_at
        } as Tarefas));
      })
    );
  }

  /**
   * READ - Lista apenas tarefas excluídas
   */
  listarExcluidas(): Observable<Tarefas[]> {
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
          titulo: item.titulo,
          descricao: item.descricao,
          prioridade: item.prioridade,
          concluida: item.concluida,
          categoriaId: item.categoria_id,
          excluida: item.excluida || false,
          created_at: item.created_at,
          updated_at: item.updated_at
        } as Tarefas));
      })
    );
  }

  /**
   * READ - Busca tarefa por ID
   */
  buscarPorId(id?: number): Observable<Tarefas> {
    const supabase = getSupabaseClient();
    if (!id) {
      return from(Promise.resolve({
        id: 0,
        titulo: '',
        descricao: '',
        prioridade: 1,
        concluida: false,
        categoriaId: 1,
        excluida: false
      } as Tarefas));
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
          titulo: data.titulo,
          descricao: data.descricao,
          prioridade: data.prioridade,
          concluida: data.concluida,
          categoriaId: data.categoria_id,
          excluida: data.excluida || false,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Tarefas;
      })
    );
  }

  /**
   * CREATE - Insere nova tarefa
   */
  inserir(tarefa: Tarefas): Observable<Tarefas> {
    const supabase = getSupabaseClient();
    const payload: any = {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      prioridade: tarefa.prioridade,
      concluida: tarefa.concluida || false,
      categoria_id: tarefa.categoriaId,
      excluida: false
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
          titulo: data.titulo,
          descricao: data.descricao,
          prioridade: data.prioridade,
          concluida: data.concluida,
          categoriaId: data.categoria_id,
          excluida: data.excluida || false,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Tarefas;
      })
    );
  }

  /**
   * UPDATE - Edita tarefa existente
   */
  editar(id: number, tarefa: Tarefas): Observable<Tarefas> {
    const supabase = getSupabaseClient();
    const payload: any = {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      prioridade: tarefa.prioridade,
      concluida: tarefa.concluida || false,
      categoria_id: tarefa.categoriaId
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
          titulo: data.titulo,
          descricao: data.descricao,
          prioridade: data.prioridade,
          concluida: data.concluida,
          categoriaId: data.categoria_id,
          excluida: data.excluida || false,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Tarefas;
      })
    );
  }

  /**
   * DELETE - Soft delete: marca tarefa como excluída (não remove fisicamente)
   */
  deletar(id?: number): Observable<Tarefas> {
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
          titulo: data.titulo,
          descricao: data.descricao,
          prioridade: data.prioridade,
          concluida: data.concluida,
          categoriaId: data.categoria_id,
          excluida: data.excluida || false,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Tarefas;
      })
    );
  }

  /**
   * RESTORE - Restaura tarefa excluída
   */
  restaurar(id: number): Observable<Tarefas> {
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
          titulo: data.titulo,
          descricao: data.descricao,
          prioridade: data.prioridade,
          concluida: data.concluida,
          categoriaId: data.categoria_id,
          excluida: data.excluida || false,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Tarefas;
      })
    );
  }
}
