import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router, RouterModule } from '@angular/router';
import { AuthService } from './auth/auth-service';

/**
 * COMPONENTE PRINCIPAL DA APLICAÇÃO - NAVEGAÇÃO SPA E SEGURANÇA
 * 
 * Este componente implementa:
 * - Layout principal da aplicação SPA
 * - Navegação entre telas com RouterLink
 * - Sistema de logout com limpeza de token
 * - Integração com sistema de autenticação
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ Navegação SPA entre múltiplas telas
 * ✅ Login e tratamento de segurança com Token (JWT)
 * ✅ Sistema de logout com limpeza de localStorage
 * ✅ Integração com AuthService
 * ✅ RouterOutlet para renderização de componentes
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Injeção de dependências
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * SEGURANÇA: Sistema de logout
   * FUNCIONALIDADE: Limpeza de token do localStorage
   * NAVEGAÇÃO SPA: Redirecionamento para login
   */
  logout() {
    // Remove token do localStorage
    this.authService.logout();
    // NAVEGAÇÃO SPA: Redireciona para tela de login
    this.router.navigate(['/login']);
  }
}
