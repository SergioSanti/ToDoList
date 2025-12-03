import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getSupabaseClient } from '../supabase-client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  user = "";
  password = "";
  error = signal<string>("");
  router = inject(Router);

  async performLogin() {
    // Clear previous error
    this.error.set("");
    
    // Basic validation
    if (!this.user || !this.password) {
      this.error.set("Please fill in all fields");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      
      console.log('Starting login process for:', this.user);
      
      // Clear any existing session first
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Perform login
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: this.user.trim(),
        password: this.password
      });

      if (loginError) {
        console.error('Login error:', loginError);
        this.error.set(loginError.message || "Incorrect email or password");
        return;
      }

      if (!data.session) {
        console.error('No session in response');
        this.error.set("Login failed. No session created.");
        return;
      }

      console.log('Login successful, session ID:', data.session.access_token.substring(0, 20) + '...');

      // Wait and verify session multiple times
      let attempts = 0;
      const maxAttempts = 10;
      let sessionValid = false;

      while (attempts < maxAttempts && !sessionValid) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session && !sessionError) {
          console.log(`Session verified on attempt ${attempts + 1}`);
          sessionValid = true;
        } else {
          attempts++;
          console.log(`Session verification attempt ${attempts} failed:`, sessionError);
          
          if (attempts >= maxAttempts) {
            // Last attempt - try to get session one more time
            const { data: { session: lastSession } } = await supabase.auth.getSession();
            if (lastSession) {
              sessionValid = true;
              console.log('Session found on final attempt');
            }
          }
        }
      }

      if (!sessionValid) {
        // Check localStorage directly as fallback
        const keys = Object.keys(localStorage);
        const hasSupabaseKey = keys.some(key => key.includes('supabase') || key.includes('auth'));
        console.log('LocalStorage keys:', keys.filter(k => k.includes('supabase') || k.includes('auth')));
        
        if (!hasSupabaseKey) {
          this.error.set("Error maintaining session. Please check Supabase configuration.");
          console.error("No Supabase session found in localStorage");
          return;
        }
      }

      // Final check before navigation
      const { data: { session: finalCheck } } = await supabase.auth.getSession();
      if (!finalCheck) {
        this.error.set("Error maintaining session. Please try again.");
        console.error("Session lost before navigation");
        return;
      }

      console.log('All checks passed, navigating to dashboard');
      this.error.set("");
      
      // Navigate
      const navResult = await this.router.navigate(['/dashboard']);
      if (!navResult) {
        console.error("Navigation failed");
        this.error.set("Error redirecting. Try accessing /dashboard manually.");
      } else {
        console.log('Navigation successful');
      }

    } catch (err: any) {
      console.error("Login exception:", err);
      this.error.set(err.message || "Error logging in. Please try again.");
    }
  }
}
