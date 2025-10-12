export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}
