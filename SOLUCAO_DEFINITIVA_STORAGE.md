# 🔧 Solução Definitiva - Storage Não Funciona

## ⚠️ Problema Identificado

A URL está correta, mas o arquivo não está sendo acessado. Isso indica problema de **PERMISSÕES** no Supabase.

## ✅ SOLUÇÃO COMPLETA - Execute no Supabase

### Passo 1: Verificar Bucket Público

1. Acesse: **Supabase Dashboard** → **Storage** → **Buckets**
2. Clique no bucket **`tarefas-arquivos`**
3. **VERIFIQUE**: "Public bucket" deve estar **ATIVADO** ✅
4. Se não estiver, **ATIVE AGORA**

### Passo 2: Verificar e Criar Políticas RLS

Execute **TODO este script** no **SQL Editor** do Supabase:

```sql
-- ============================================
-- SOLUÇÃO DEFINITIVA - POLÍTICAS DE STORAGE
-- ============================================

-- 1. REMOVER TODAS AS POLÍTICAS ANTIGAS
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer um pode ler arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar" ON storage.objects;
DROP POLICY IF EXISTS "Public can read files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload" ON storage.objects;

-- 2. CRIAR POLÍTICA DE LEITURA PÚBLICA (OBRIGATÓRIO!)
CREATE POLICY "Public can read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tarefas-arquivos');

-- 3. CRIAR POLÍTICA DE UPLOAD (AUTENTICADOS)
CREATE POLICY "Authenticated can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tarefas-arquivos');

-- 4. CRIAR POLÍTICA DE ATUALIZAÇÃO (AUTENTICADOS)
CREATE POLICY "Authenticated can update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');

-- 5. CRIAR POLÍTICA DE EXCLUSÃO (AUTENTICADOS)
CREATE POLICY "Authenticated can delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');

-- 6. VERIFICAR SE FOI CRIADO CORRETAMENTE
SELECT 
  name as policy_name,
  roles,
  cmd as operation,
  bucket_id
FROM storage.policies 
WHERE bucket_id = 'tarefas-arquivos'
ORDER BY cmd;
```

### Passo 3: Verificar Arquivo Existe

Execute no **SQL Editor**:

```sql
-- Verificar se o arquivo existe no storage
SELECT 
  name,
  id,
  bucket_id,
  created_at,
  updated_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'tarefas-arquivos'
ORDER BY created_at DESC
LIMIT 10;
```

### Passo 4: Teste Direto da URL

Abra no navegador (sem estar logado):
```
https://ouewdngpvwiaqxlouckj.supabase.co/storage/v1/object/public/tarefas-arquivos/3/3-1764816345082.PNG
```

**Se abrir a imagem:**
- ✅ Permissões estão corretas
- ✅ O problema é no código (já corrigido)

**Se der erro 403 (Forbidden):**
- ❌ Políticas RLS estão bloqueando
- ❌ Execute o Passo 2 novamente

**Se der erro 404 (Not Found):**
- ❌ Arquivo não existe
- ❌ Verifique o Passo 3

## 🔍 Verificações Adicionais

### Verificar CORS (se necessário)

1. Acesse: **Storage** → **Settings** → **CORS**
2. Adicione sua origem: `https://to-do-list-cbf6rc4bl-sertgios-projects.vercel.app`
3. Ou use `*` para desenvolvimento

### Verificar Bucket Existe

```sql
SELECT name, id, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE name = 'tarefas-arquivos';
```

Deve retornar:
- `name`: `tarefas-arquivos`
- `public`: `true` ✅

## ✅ Após Executar

1. **Recarregue a página** da aplicação
2. **Teste visualizar** - deve funcionar
3. **Teste baixar** - deve funcionar
4. **Verifique o console** (F12) - não deve ter erros

## ⚠️ Se Ainda Não Funcionar

1. **Verifique o console do navegador** (F12) - veja os erros exatos
2. **Teste a URL diretamente** no navegador
3. **Verifique se o arquivo realmente existe** no Storage do Supabase
4. **Verifique se o bucket está público** no Dashboard

---

## 📝 Resumo do Que Fazer

1. ✅ Bucket público: **ATIVADO**
2. ✅ Execute o script SQL completo acima
3. ✅ Teste a URL diretamente no navegador
4. ✅ Verifique o console para erros

**O código já está correto. O problema é 100% de configuração no Supabase.**

