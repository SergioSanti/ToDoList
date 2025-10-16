/**
 * INTERFACE TAREFAS - ENTIDADE PRINCIPAL
 * 
 * Esta interface define a estrutura da entidade Tarefas:
 * - Campos básicos da tarefa
 * - Relacionamento com entidade Categoria
 * - Campos de controle e prioridade
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ Entidade principal do sistema
 * ✅ Relacionamento com entidade Categoria (categoriaId)
 * ✅ Campos para funcionalidades de negócio
 */
export interface Tarefas {
  id: number;                    // Identificador único
  titulo: string;                // Título da tarefa
  descricao: string;             // Descrição detalhada
  prioridade: number;            // Prioridade (1-5)
  concluida: boolean;           // Status de conclusão
  categoriaId: number;          // RELACIONAMENTO: ID da categoria
}
