import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Categoria } from './categoria';
import { getSupabaseClient } from './supabase-client';

/**
 * SERVIÇO DE CATEGORIAS - CRUD COMPLETO COM SUPABASE DATABASE
 *
 * Tabela sugerida no Supabase: "categorias"
 * Campos: id (PK), nome, descricao, cor
 */
@Injectable({ providedIn: 'root' })
export class CategoriaApiService {

  /**
   * READ - Lista todas as categorias
   */
  listar(): Observable<Categoria[]> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('categorias')
        .select('*')
        .order('id', { ascending: true })
    ).pipe(
      map(result => (result.data || []) as Categoria[])
    );
  }

  /**
   * READ - Busca categoria por ID
   */
  buscarPorId(id?: number): Observable<Categoria> {
    const supabase = getSupabaseClient();
    if (!id) {
      return from(Promise.resolve({
        id: 0,
        nome: '',
        descricao: '',
        cor: '#007bff'
      } as Categoria));
    }

    return from(
      supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(result => result.data as Categoria)
    );
  }

  /**
   * CREATE - Insere nova categoria
   */
  inserir(categoria: Categoria): Observable<Categoria> {
    const supabase = getSupabaseClient();
    const payload: any = {
      nome: categoria.nome,
      descricao: categoria.descricao,
      cor: categoria.cor
    };

    return from(
      supabase
        .from('categorias')
        .insert(payload)
        .select('*')
        .single()
    ).pipe(
      map(result => result.data as Categoria)
    );
  }

  /**
   * UPDATE - Edita categoria existente
   */
  editar(id: number, categoria: Categoria): Observable<Categoria> {
    const supabase = getSupabaseClient();
    const payload: any = {
      nome: categoria.nome,
      descricao: categoria.descricao,
      cor: categoria.cor
    };

    return from(
      supabase
        .from('categorias')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()
    ).pipe(
      map(result => result.data as Categoria)
    );
  }

  /**
   * DELETE - Remove categoria
   */
  deletar(id?: number): Observable<Categoria> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('categorias')
        .delete()
        .eq('id', id as number)
        .select('*')
        .single()
    ).pipe(
      map(result => result.data as Categoria)
    );
  }
}
