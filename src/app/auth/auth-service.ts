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
      sessionStorage.setItem('token', 'fake-jwt-token');
      return of(true);
    } else {
      return of(false);
    }
  }

  estaLogado(): boolean {
    const token = sessionStorage.getItem('token');
    return token !== undefined && token !== null;
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }
}
