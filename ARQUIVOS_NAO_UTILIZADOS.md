# 📋 Arquivos Não Utilizados - Análise

## ✅ Arquivos em Uso

### Componentes Principais
- ✅ `dashboard/` - Usado (rota `/dashboard`)
- ✅ `login/` - Usado (rota `/login`)
- ✅ `tabela-tarefas/` - Usado (rota `/tabela`)
- ✅ `form-tarefas/` - Usado (rotas `/novo` e `/edit/:id`)
- ✅ `tabela-categoria/` - Usado (rota `/tabela-categoria`)
- ✅ `form-categoria/` - Usado (rotas `/novo-categoria` e `/edit-categoria/:id`)
- ✅ `page-not-found/` - Usado (rota `**` - 404)

### Serviços
- ✅ `tasks-api-service.ts` - Usado (CRUD de tarefas)
- ✅ `categories-api-service.ts` - Usado (CRUD de categorias)
- ✅ `auth-service.ts` - Usado (autenticação)
- ✅ `auth-guard-guard.ts` - Usado (proteção de rotas)
- ✅ `storage-service.ts` - Usado (upload/download)
- ✅ `edge-functions-service.ts` - Usado (Edge Functions)
- ✅ `supabase-client.ts` - Usado (cliente Supabase)

### Outros
- ✅ `search-filter-pipe.ts` - Usado (pesquisa na tabela)
- ✅ `tasks.ts` - Usado (interface Task)
- ✅ `category.ts` - Usado (interface Category)

---

## ⚠️ Arquivos NÃO Utilizados (mas nas rotas)

### 1. `list-card-tarefas/`
- **Status:** ⚠️ NAS ROTAS mas SEM LINK na navbar
- **Rota:** `/lista` (linha 35 de `app.routes.ts`)
- **Problema:** Não há link na navbar (`app.html`) para acessar
- **Recomendação:** Pode ser removido OU adicionar link na navbar

### 2. `list-card-categoria/`
- **Status:** ⚠️ NAS ROTAS mas SEM LINK na navbar
- **Rota:** `/lista-categoria` (linha 41 de `app.routes.ts`)
- **Problema:** Não há link na navbar (`app.html`) para acessar
- **Recomendação:** Pode ser removido OU adicionar link na navbar

---

## ❌ Arquivos NÃO Utilizados (sem referências)

### 3. `card-categoria/`
- **Status:** ❌ NÃO USADO
- **Problema:** Não há importação ou uso em nenhum lugar
- **Recomendação:** Pode ser removido

### 4. `card-tarefas/`
- **Status:** ❌ NÃO USADO
- **Problema:** Não há importação ou uso em nenhum lugar
- **Recomendação:** Pode ser removido

### 5. `categoria-api-service.ts`
- **Status:** ❌ NÃO USADO (duplicado)
- **Problema:** Existe `categories-api-service.ts` que é o usado
- **Recomendação:** Pode ser removido (parece ser versão antiga)

### 6. `tarefas-api-service.ts`
- **Status:** ❌ NÃO USADO (duplicado)
- **Problema:** Existe `tasks-api-service.ts` que é o usado
- **Recomendação:** Pode ser removido (parece ser versão antiga)

---

## 📝 Arquivos de Teste (.spec.ts)

Todos os arquivos `.spec.ts` são arquivos de teste do Angular:
- ✅ Podem ser mantidos (para testes futuros)
- ⚠️ Não são usados na aplicação em produção
- **Recomendação:** Manter (padrão do Angular)

---

## 📊 Resumo

| Tipo | Quantidade | Ação Recomendada |
|------|------------|------------------|
| Componentes não usados | 2 (`card-categoria`, `card-tarefas`) | Remover |
| Componentes sem link | 2 (`list-card-tarefas`, `list-card-categoria`) | Remover ou adicionar link |
| Serviços duplicados | 2 (`categoria-api-service`, `tarefas-api-service`) | Remover |
| Arquivos de teste | Vários (`.spec.ts`) | Manter (padrão) |

---

## 🗑️ Arquivos que PODEM ser removidos (se quiser limpar)

1. `card-categoria/` (pasta completa)
2. `card-tarefas/` (pasta completa)
3. `list-card-tarefas/` (pasta completa) - OU adicionar link na navbar
4. `list-card-categoria/` (pasta completa) - OU adicionar link na navbar
5. `categoria-api-service.ts` (arquivo)
6. `tarefas-api-service.ts` (arquivo)

**Total:** 6 itens que podem ser removidos para limpar o projeto.

---

## ⚠️ IMPORTANTE

Antes de remover, verifique:
- Se não há referências em outros arquivos
- Se não são usados em rotas que você quer manter
- Se não são necessários para funcionalidades futuras

**NOTA:** Os arquivos `list-card-tarefas` e `list-card-categoria` estão nas rotas, então podem ser acessados diretamente pela URL, mas não há link na interface.

