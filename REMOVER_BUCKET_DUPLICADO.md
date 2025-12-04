# 🗑️ Remover Bucket Duplicado

## 📋 Situação Atual

Você tem **2 buckets** no Supabase Storage:

1. ✅ **`tarefas-arquivos`** (com 's') - **CORRETO**
   - 4 políticas configuradas
   - Este é o bucket usado pelo código
   - Mantenha este!

2. ❌ **`tarefa-arquivos`** (sem 's') - **INCORRETO**
   - 0 políticas
   - Vazio
   - Não está sendo usado
   - **Pode ser deletado**

## ✅ Verificação

O código está configurado para usar:
- **Bucket:** `tarefas-arquivos` (com 's')
- **Arquivo:** `src/app/storage-service.ts` linha 20

## 🗑️ Como Deletar o Bucket Vazio

### Opção 1: Via Dashboard (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá em **Storage** → **Buckets**
3. Encontre o bucket **`tarefa-arquivos`** (sem 's')
4. Clique nos **3 pontos** (⋮) ao lado do bucket
5. Selecione **"Delete bucket"**
6. Confirme a exclusão

### Opção 2: Via SQL (Se necessário)

Se não conseguir deletar pelo Dashboard, execute no **SQL Editor**:

```sql
-- ATENÇÃO: Isso deleta o bucket e TODOS os arquivos dentro dele
-- Certifique-se de que é o bucket correto antes de executar!

-- Verificar se o bucket existe e está vazio
SELECT 
  name,
  id,
  public,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = id) as file_count
FROM storage.buckets
WHERE name = 'tarefa-arquivos';

-- Se estiver vazio (file_count = 0), pode deletar:
-- DELETE FROM storage.buckets WHERE name = 'tarefa-arquivos';
```

## ⚠️ Importante

- **NÃO delete** o bucket `tarefas-arquivos` (com 's')!
- Apenas delete o bucket `tarefa-arquivos` (sem 's')
- O bucket correto tem **4 políticas** configuradas

## ✅ Após Deletar

Após deletar o bucket vazio, você terá apenas:
- ✅ `tarefas-arquivos` (com 's') - bucket correto e ativo

Isso evitará confusão e manterá sua configuração limpa!

