# 🔧 Corrigir Edge Function no Supabase - URGENTE

## ⚠️ Problema Identificado

A Edge Function está retornando `activeTasks: 0` e `completedTasks: 0`, mesmo com tarefas no banco.

**Causa provável:** Autenticação incorreta na Edge Function.

## ✅ Solução: Atualizar Edge Function no Supabase

### Passo 1: Acessar Supabase Dashboard
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Edge Functions**

### Passo 2: Editar a Função
1. Clique na função `resumo-tarefas`
2. Clique em **"Edit"** ou **"Update"**

### Passo 3: Substituir TODO o Código
1. Abra o arquivo `edge-function-clean.ts` deste projeto
2. Copie **TODO o código** (linhas 6-116)
3. Cole no editor do Supabase (substitua o código antigo completamente)
4. Clique em **"Deploy"** ou **"Save"**

### Passo 4: Verificar Políticas RLS
1. No Supabase Dashboard, vá em **SQL Editor**
2. Execute esta query para verificar as políticas:

```sql
SELECT * FROM pg_policies WHERE tablename = 'tarefas';
```

3. Se a política não permitir acesso, execute:

```sql
-- Remover política antiga (se existir)
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar tarefas" ON tarefas;

-- Criar política correta
CREATE POLICY "Usuários autenticados podem gerenciar tarefas"
ON tarefas
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

### Passo 5: Testar
1. Após o deploy, acesse o Dashboard da aplicação
2. Abra o console do navegador (F12)
3. Verifique os logs:
   - `Edge Function Stats:`
   - `Active Tasks:` (deve ser > 0 se houver tarefas)
   - `Completed Tasks:`
   - `Completion Rate:`

---

## 🔍 O que foi corrigido no código?

### Problema anterior:
- Usava `supabase.auth.setSession()` que não funciona bem em Edge Functions
- Não verificava se o usuário estava autenticado

### Correção aplicada:
- ✅ Usa `global.headers.Authorization` na criação do cliente (forma correta)
- ✅ Verifica autenticação com `supabase.auth.getUser()`
- ✅ Melhor tratamento de erros
- ✅ Logs de debug para identificar problemas

---

## 📝 Código Atualizado

O arquivo `edge-function-clean.ts` foi atualizado com:
- ✅ Autenticação correta usando `global.headers`
- ✅ Verificação de usuário autenticado
- ✅ Melhor tratamento de erros
- ✅ Logs de debug (`debug` object no retorno)

**IMPORTANTE:** Você **DEVE** atualizar a Edge Function no Supabase Dashboard com este código atualizado!

---

## ⚠️ Se ainda não funcionar

Verifique no Supabase Dashboard:
1. **Authentication → Policies** - Verifique se RLS está configurado corretamente
2. **Database → Tables → tarefas → Policies** - Verifique se a política permite acesso
3. **Edge Functions → resumo-tarefas → Logs** - Veja se há erros nos logs

