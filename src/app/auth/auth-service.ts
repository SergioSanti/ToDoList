import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(username: string, senha: string): Observable<boolean> {
    // Aqui simulamos um backend com dois logins válidos:
    if (
      (username === 'admin' && senha === '1234') ||
      (username === 'teste' && senha === 'senha')
    ) {
      localStorage.setItem('token', 'fake-jwt-token');
      return of(true);
    } else {
      return of(false);
    }
  }

  estaLogado(): boolean {
    const token = localStorage.getItem('token');
    return token === 'fake-jwt-token';
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
