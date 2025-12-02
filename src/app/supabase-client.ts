import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * CLIENTE SUPABASE COMPARTILHADO
 *
 * Este arquivo centraliza a configuração do Supabase para:
 * - Database (Postgres)
 * - Authentication
 * - Storage
 * - Edge Functions
 *
 * IMPORTANTE:
 * - Substitua as constantes abaixo pelos valores reais do seu projeto Supabase.
 * - NUNCA commite as chaves reais em repositórios públicos.
 */

// Credenciais do projeto Supabase - ToDoList
const SUPABASE_URL = 'https://ouewdngpvwiaqxlouckj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91ZXdkbmdwdndpYXF4bG91Y2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzAwMTQsImV4cCI6MjA4MDIwNjAxNH0.ZTdzo6ValLbGUwva-DUo9dupyJbZAxwe11pZ8frR2oY';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
      }
    });
  }
  return supabase;
}


