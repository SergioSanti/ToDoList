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
  erro = signal<boolean>(false);
  authService = inject(AuthService);
  router = inject(Router);

  realizarLogin() {
    this.authService.login(this.usuario, this.senha).subscribe(logado => {
      if (logado) {
        alert("Usuário logado com sucesso");
        this.erro.set(false);
        this.router.navigate(['/tabela']);
      } else {
        this.erro.set(true);
      }
    });
  }
}
