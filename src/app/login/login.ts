import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Import necessário
import { AuthService } from '../auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // se ainda não tiver, adicione isso
  imports: [FormsModule, CommonModule], // ✅ adicionado CommonModule
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  usuario = "";
  senha = "";
  erro = signal<string>("");
  authService = inject(AuthService);
  router = inject(Router);

  realizarLogin() {
    // Limpa erro anterior
    this.erro.set("");
    
    // Validação básica
    if (!this.usuario || !this.senha) {
      this.erro.set("Por favor, preencha todos os campos");
      return;
    }

    this.authService.login(this.usuario, this.senha).subscribe({
      next: async (logado) => {
        if (logado) {
          // Aguarda um pouco para garantir que a sessão foi salva no localStorage
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Verifica novamente se está logado antes de redirecionar
          const aindaLogado = await this.authService.estaLogadoAsync();
          if (aindaLogado) {
            this.erro.set("");
            // Força navegação para o dashboard
            this.router.navigate(['/dashboard']).then(success => {
              if (!success) {
                console.error("Erro ao navegar para dashboard");
                this.erro.set("Erro ao redirecionar. Tente acessar /dashboard manualmente.");
              }
            });
          } else {
            this.erro.set("Erro ao manter sessão. Tente novamente.");
            console.error("Sessão não foi mantida após login");
          }
        } else {
          this.erro.set("Email ou senha incorretos");
        }
      },
      error: (err) => {
        console.error("Erro no login:", err);
        this.erro.set("Erro ao fazer login. Verifique suas credenciais do Supabase.");
      }
    });
  }
}
