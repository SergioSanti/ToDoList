import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { getSupabaseClient } from '../supabase-client';

/**
 * SERVIÇO DE AUTENTICAÇÃO COM SUPABASE AUTH
 *
 * Responsável por:
 * - Login com e-mail e senha (Serverless Authentication)
 * - Manter sessão autenticada (persistSession: true)
 * - Verificar se usuário está logado
 * - Logout
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * LOGIN - Utiliza Supabase Authentication (email/senha)
   */
  login(email: string, senha: string): Observable<boolean> {
    const supabase = getSupabaseClient();

    return from(
      supabase.auth.signInWithPassword({
        email,
        password: senha
      })
    ).pipe(
      map(result => {
        return !result.error && !!result.data.session;
      })
    );
  }

  /**
   * VERIFICAÇÃO DE LOGIN
   * Usa a sessão mantida pelo Supabase.
   */
  estaLogado(): boolean {
    const supabase = getSupabaseClient();
    const session = supabase.auth.getSession();
    // getSession() retorna uma Promise, então aqui fazemos uma verificação simples
    // baseada em storage interno do Supabase (persistSession).
    // Para o RouteGuard (sincrono), usamos a existência do item no localStorage.
    const hasSupabaseAuthStorage = !!localStorage.getItem('sb-' /* prefixo padrão */);
    return hasSupabaseAuthStorage;
  }

  /**
   * LOGOUT - Encerra sessão no Supabase e limpa dados locais
   */
  logout(): void {
    const supabase = getSupabaseClient();
    supabase.auth.signOut();
  }
}

