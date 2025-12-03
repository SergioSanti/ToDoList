import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth-service';
import { Router } from '@angular/router';

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
  authService = inject(AuthService);
  router = inject(Router);

  performLogin() {
    // Clear previous error
    this.error.set("");
    
    // Basic validation
    if (!this.user || !this.password) {
      this.error.set("Please fill in all fields");
      return;
    }

    this.authService.login(this.user, this.password).subscribe({
      next: async (loggedIn) => {
        if (loggedIn) {
          // Wait a bit to ensure session was saved in localStorage
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Check again if logged in before redirecting
          const stillLoggedIn = this.authService.isLoggedIn();
          if (stillLoggedIn) {
            this.error.set("");
            // Force navigation to dashboard
            this.router.navigate(['/dashboard']).then(success => {
              if (!success) {
                console.error("Error navigating to dashboard");
                this.error.set("Error redirecting. Try accessing /dashboard manually.");
              }
            });
          } else {
            this.error.set("Error maintaining session. Please try again.");
            console.error("Session was not maintained after login");
          }
        } else {
          this.error.set("Incorrect email or password");
        }
      },
      error: (err) => {
        console.error("Login error:", err);
        this.error.set("Error logging in. Check your Supabase credentials.");
      }
    });
  }
}
