import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { inject } from '@angular/core';
import { getSupabaseClient } from '../supabase-client';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const supabase = getSupabaseClient();
  
  // Verifica a sessão de forma assíncrona
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (session && !error) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
