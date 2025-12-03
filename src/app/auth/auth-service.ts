import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { getSupabaseClient } from '../supabase-client';

/**
 * AUTHENTICATION SERVICE WITH SUPABASE AUTH
 *
 * Responsible for:
 * - Login with email and password (Serverless Authentication)
 * - Maintain authenticated session (persistSession: true)
 * - Check if user is logged in
 * - Logout
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * LOGIN - Uses Supabase Authentication (email/password)
   */
  login(email: string, password: string): Observable<boolean> {
    const supabase = getSupabaseClient();

    return from(
      supabase.auth.signInWithPassword({
        email,
        password: password
      })
    ).pipe(
      map(result => {
        return !result.error && !!result.data.session;
      })
    );
  }

  /**
   * LOGIN CHECK
   * Uses the session maintained by Supabase.
   */
  isLoggedIn(): boolean {
    const supabase = getSupabaseClient();
    const session = supabase.auth.getSession();
    // getSession() returns a Promise, so here we do a simple check
    // based on Supabase internal storage (persistSession).
    // For RouteGuard (synchronous), we use the existence of the item in localStorage.
    const hasSupabaseAuthStorage = !!localStorage.getItem('sb-' /* default prefix */);
    return hasSupabaseAuthStorage;
  }

  /**
   * LOGOUT - Ends Supabase session and clears local data
   */
  logout(): void {
    const supabase = getSupabaseClient();
    supabase.auth.signOut();
  }
}
