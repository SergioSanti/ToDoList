import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getSupabaseClient } from '../supabase-client';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const supabase = getSupabaseClient();
  
  try {
    // Check session asynchronously
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session && !error) {
      return true;
    } else {
      // Log for debugging
      console.log('Auth guard: No session found, redirecting to login');
      if (error) {
        console.error('Auth guard error:', error);
      }
      router.navigate(['/login']);
      return false;
    }
  } catch (err) {
    console.error('Auth guard exception:', err);
    router.navigate(['/login']);
    return false;
  }
};
