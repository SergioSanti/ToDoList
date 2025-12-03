import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * SHARED SUPABASE CLIENT
 *
 * This file centralizes Supabase configuration for:
 * - Database (Postgres)
 * - Authentication
 * - Storage
 * - Edge Functions
 *
 * IMPORTANT:
 * - Replace the constants below with real values from your Supabase project.
 * - NEVER commit real keys to public repositories.
 */

// Supabase project credentials - ToDoList
const SUPABASE_URL = 'https://ouewdngpvwiaqxlouckj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91ZXdkbmdwdndpYXF4bG91Y2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzAwMTQsImV4cCI6MjA4MDIwNjAxNH0.ZTdzo6ValLbGUwva-DUo9dupyJbZAxwe11pZ8frR2oY';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Supabase client can only be used in browser environment');
    }

    console.log('Initializing Supabase client');

    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: window.localStorage,
        // Use default storage key - Supabase will use: sb-{project-ref}-auth-token
      },
      global: {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      }
    });

    // Monitor auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session ? `User: ${session.user.email}` : 'No session');
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, session persisted');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
    });

    console.log('Supabase client initialized');
  }
  return supabase;
}
