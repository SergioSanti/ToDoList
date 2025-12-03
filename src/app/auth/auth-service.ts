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
   * Returns the session data if login is successful
   */
  login(email: string, password: string): Observable<{ success: boolean; session: any }> {
    const supabase = getSupabaseClient();

    return from(
      supabase.auth.signInWithPassword({
        email,
        password: password
      })
    ).pipe(
      map(result => {
        if (result.error) {
          console.error('Login error:', result.error);
          return { success: false, session: null };
        }
        // Session is automatically saved by Supabase when persistSession is true
        return { success: !!result.data.session, session: result.data.session };
      })
    );
  }

  /**
   * LOGIN CHECK - Async version
   * Checks the session asynchronously using Supabase API
   * This is the most reliable method to check if user is logged in
   */
  async isLoggedInAsync(): Promise<boolean> {
    const supabase = getSupabaseClient();
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error);
        return false;
      }
      return !!session;
    } catch (err) {
      console.error('Session check exception:', err);
      return false;
    }
  }

  /**
   * LOGIN CHECK - Synchronous version
   * For use in guards and synchronous checks
   * Note: This is a best-effort check. Use isLoggedInAsync() for accurate verification.
   */
  isLoggedIn(): boolean {
    const supabase = getSupabaseClient();
    // Check if there's a session in localStorage
    // Supabase stores session with key pattern: sb-{project-ref}-auth-token
    try {
      const keys = Object.keys(localStorage);
      const projectRef = 'ouewdngpvwiaqxlouckj'; // From SUPABASE_URL
      const sessionKey = `sb-${projectRef}-auth-token`;
      return !!localStorage.getItem(sessionKey);
    } catch (err) {
      return false;
    }
  }

  /**
   * LOGOUT - Ends Supabase session and clears local data
   */
  logout(): void {
    const supabase = getSupabaseClient();
    supabase.auth.signOut().then(() => {
      // Clear any remaining localStorage items
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
    });
  }
}
