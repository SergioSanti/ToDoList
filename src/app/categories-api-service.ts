import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Category } from './category';
import { getSupabaseClient } from './supabase-client';

/**
 * CATEGORIES API SERVICE - COMPLETE CRUD WITH SUPABASE DATABASE
 *
 * Supabase table: "categorias"
 * Fields: id (PK), nome, descricao, cor
 */
@Injectable({ providedIn: 'root' })
export class CategoriesApiService {

  /**
   * READ - List all categories
   */
  list(): Observable<Category[]> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('categorias')
        .select('*')
        .order('id', { ascending: true })
    ).pipe(
      map(result => {
        const data = result.data || [];
        return data.map((item: any) => ({
          id: item.id,
          name: item.nome,
          description: item.descricao,
          color: item.cor
        } as Category));
      })
    );
  }

  /**
   * READ - Find category by ID
   */
  findById(id?: number): Observable<Category> {
    const supabase = getSupabaseClient();
    if (!id) {
      return from(Promise.resolve({
        id: 0,
        name: '',
        description: '',
        color: '#007bff'
      } as Category));
    }

    return from(
      supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          name: data.nome,
          description: data.descricao,
          color: data.cor
        } as Category;
      })
    );
  }

  /**
   * CREATE - Insert new category
   */
  insert(category: Category): Observable<Category> {
    const supabase = getSupabaseClient();
    const payload: any = {
      nome: category.name,
      descricao: category.description,
      cor: category.color
    };

    return from(
      supabase
        .from('categorias')
        .insert(payload)
        .select('*')
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          name: data.nome,
          description: data.descricao,
          color: data.cor
        } as Category;
      })
    );
  }

  /**
   * UPDATE - Edit existing category
   */
  update(id: number, category: Category): Observable<Category> {
    const supabase = getSupabaseClient();
    const payload: any = {
      nome: category.name,
      descricao: category.description,
      cor: category.color
    };

    return from(
      supabase
        .from('categorias')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          name: data.nome,
          description: data.descricao,
          color: data.cor
        } as Category;
      })
    );
  }

  /**
   * DELETE - Remove category
   */
  delete(id?: number): Observable<Category> {
    const supabase = getSupabaseClient();
    return from(
      supabase
        .from('categorias')
        .delete()
        .eq('id', id as number)
        .select('*')
        .single()
    ).pipe(
      map(result => {
        const data = result.data as any;
        return {
          id: data.id,
          name: data.nome,
          description: data.descricao,
          color: data.cor
        } as Category;
      })
    );
  }
}
