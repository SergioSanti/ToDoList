/**
 * INTERFACE TAREFAS - ENTIDADE PRINCIPAL
 * 
 * Esta interface define a estrutura da entidade Tarefas:
 * - Campos básicos da tarefa
 * - Relacionamento com entidade Categoria
 * - Campos de controle e prioridade
 * - Soft delete para rastreamento de exclusões
 * 
 */
export interface Tarefas {
  id: number;                    // Identificador único
  titulo: string;                // Título da tarefa (obrigatório)
  descricao: string;             // Descrição detalhada (obrigatório)
  prioridade: number;            // Prioridade (1-5)
  concluida: boolean;           // Status de conclusão
  categoriaId: number;          // RELACIONAMENTO: ID da categoria (obrigatório)
  excluida?: boolean;           // Soft delete - marca tarefa como excluída
  created_at?: string;          // Data de criação (Supabase)
  updated_at?: string;          // Data de atualização (Supabase)
}
