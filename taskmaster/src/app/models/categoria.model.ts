export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  cor: string;
  usuarioId: number;
}

export interface CreateCategoriaRequest {
  nome: string;
  descricao: string;
  cor: string;
}

export interface UpdateCategoriaRequest {
  nome?: string;
  descricao?: string;
  cor?: string;
}
