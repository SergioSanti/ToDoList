# CRUD de Categorias - ToDoList

## 📋 Funcionalidades Implementadas

### ✅ CRUD Completo de Categorias
- **Create:** Cadastro de novas categorias
- **Read:** Listagem em tabela e cards
- **Update:** Edição de categorias existentes
- **Delete:** Exclusão de categorias

### 🎨 Campos da Categoria
- **ID:** Identificador único (gerado automaticamente)
- **Nome:** Nome da categoria
- **Descrição:** Descrição detalhada da categoria
- **Cor:** Cor personalizada (seletor de cor)

### 🛠️ Arquivos Criados

#### Interfaces e Serviços
- `src/app/categoria.ts` - Interface da entidade Categoria
- `src/app/categoria-service.ts` - Serviço local para operações CRUD
- `src/app/categoria-api-service.ts` - Serviço simulando API REST

#### Componentes
- `src/app/form-categoria/` - Formulário de cadastro/edição
- `src/app/tabela-categoria/` - Visualização em tabela
- `src/app/list-card-categoria/` - Visualização em cards
- `src/app/card-categoria/` - Componente de card individual

#### Testes
- Arquivos `.spec.ts` para todos os componentes e serviços

### 🚀 Rotas Configuradas
- `/tabela-categoria` - Lista em tabela
- `/lista-categoria` - Lista em cards
- `/novo-categoria` - Cadastro
- `/edit-categoria/:id` - Edição

### 🎯 Funcionalidades Especiais
- **Seletor de Cor:** Campo para escolher cor personalizada
- **Contraste Automático:** Texto com cor contrastante baseada na cor de fundo
- **Validação:** Campos obrigatórios
- **Confirmação:** Confirmação antes de deletar

### 🔐 Segurança
- Todas as rotas protegidas por `authGuard`
- Requer login para acessar funcionalidades

### 📱 Interface
- Design responsivo com Bootstrap
- Navbar com dropdown para navegação
- Formulários com validação visual
- Cards com cores personalizadas

## 🎉 Resultado Final
Agora o projeto possui **2 CRUDs completos**:
1. **CRUD de Tarefas** (já existente)
2. **CRUD de Categorias** (novo)

Ambos seguem exatamente o mesmo padrão de arquitetura e implementação!
