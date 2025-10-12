import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario, LoginRequest, LoginResponse, RegisterRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getCurrentUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Dados em memória para simular banco de dados
  private usuarios: Usuario[] = [
    {
      id: 1,
      nome: 'Admin',
      email: 'admin@taskmaster.com',
      senha: '123456'
    }
  ];

  private nextUserId = 2;

  constructor() {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      const usuario = this.usuarios.find(u => 
        u.email === loginRequest.email && u.senha === loginRequest.senha
      );

      if (usuario) {
        const token = this.generateToken(usuario);
        const response: LoginResponse = {
          token,
          usuario: { ...usuario, senha: '' } // Remove senha da resposta
        };

        this.setAuthData(token, usuario);
        observer.next(response);
        observer.complete();
      } else {
        observer.error('Credenciais inválidas');
      }
    });
  }

  register(registerRequest: RegisterRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      const existingUser = this.usuarios.find(u => u.email === registerRequest.email);
      
      if (existingUser) {
        observer.error('Email já cadastrado');
        return;
      }

      const novoUsuario: Usuario = {
        id: this.nextUserId++,
        nome: registerRequest.nome,
        email: registerRequest.email,
        senha: registerRequest.senha
      };

      this.usuarios.push(novoUsuario);
      
      const token = this.generateToken(novoUsuario);
      const response: LoginResponse = {
        token,
        usuario: { ...novoUsuario, senha: '' }
      };

      this.setAuthData(token, novoUsuario);
      observer.next(response);
      observer.complete();
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  private getCurrentUserFromStorage(): Usuario | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private setAuthData(token: string, usuario: Usuario): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    this.currentUserSubject.next(usuario);
  }

  private generateToken(usuario: Usuario): string {
    // Simulação simples de JWT
    const payload = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      iat: Date.now()
    };
    
    return btoa(JSON.stringify(payload));
  }
}
