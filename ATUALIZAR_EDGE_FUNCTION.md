# 🔧 Atualizar Edge Function no Supabase

## ⚠️ Problema Identificado

A Edge Function `resumo-tarefas` pode estar com o cálculo de taxa de conclusão incorreto ou desatualizado.

## ✅ Solução

### Passo 1: Acessar Supabase Dashboard
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Edge Functions**

### Passo 2: Editar a Função
1. Clique na função `resumo-tarefas`
2. Clique em **"Edit"** ou **"Update"**

### Passo 3: Substituir o Código
1. Abra o arquivo `edge-function-clean.ts` deste projeto
2. Copie **TODO o código** (linhas 6-110)
3. Cole no editor do Supabase (substitua o código antigo)
4. Clique em **"Deploy"** ou **"Save"**

### Passo 4: Verificar
1. Após o deploy, acesse o Dashboard da aplicação
2. A taxa de conclusão deve aparecer corretamente

---

## 🔍 O que foi corrigido?

### Problema anterior:
- Verificação de `t.concluida` pode não estar funcionando corretamente
- Cálculo pode estar retornando 0 mesmo com tarefas concluídas

### Correção aplicada:
- Verificação explícita: `t.concluida === true`
- Cálculo mais robusto da taxa de conclusão
- Melhor tratamento de casos onde não há tarefas ativas

---

## 📝 Código Atualizado

O arquivo `edge-function-clean.ts` foi atualizado com:
- ✅ Verificação explícita de `concluida === true`
- ✅ Cálculo correto da taxa de conclusão
- ✅ Melhor tratamento de dados nulos/undefined

**IMPORTANTE:** Você precisa atualizar a Edge Function no Supabase Dashboard com este código atualizado!

