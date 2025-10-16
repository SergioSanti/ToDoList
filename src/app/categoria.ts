/**
 * INTERFACE CATEGORIA - ENTIDADE RELACIONADA
 * 
 * Esta interface define a estrutura da entidade Categoria:
 * - Campos básicos da categoria
 * - Cor personalizada para exibição visual
 * - Relacionamento com entidade Tarefas
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * ✅ Entidade relacionada ao sistema
 * ✅ Relacionamento com entidade Tarefas (usado por categoriaId)
 * ✅ Campo de cor para funcionalidades visuais
 */
export interface Categoria {
  id: number;                    // Identificador único
  nome: string;                  // Nome da categoria
  descricao: string;             // Descrição da categoria
  cor: string;                   // Cor em hexadecimal para exibição
}
