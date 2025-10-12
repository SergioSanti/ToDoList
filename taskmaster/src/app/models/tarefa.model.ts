export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'concluida';
  categoriaId: number;
  dataCriacao: Date;
  dataConclusao?: Date;
  usuarioId: number;
}

export interface CreateTarefaRequest {
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  categoriaId: number;
}

export interface UpdateTarefaRequest {
  titulo?: string;
  descricao?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  status?: 'pendente' | 'concluida';
  categoriaId?: number;
}
