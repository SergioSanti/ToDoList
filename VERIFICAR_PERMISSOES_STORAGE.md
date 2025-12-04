# 🔐 Verificar Permissões do Storage - URGENTE

## ⚠️ Problema

Se a visualização e download não funcionam, **é problema de permissões no Supabase**.

## ✅ Verificação Rápida

### 1. Bucket Público (OBRIGATÓRIO)

1. Acesse: **Supabase Dashboard** → **Storage** → **Buckets**
2. Clique no bucket **`tarefas-arquivos`**
3. Verifique se **"Public bucket"** está **ATIVADO** ✅
   - Se não estiver, **ATIVE AGORA**

### 2. Políticas RLS (OBRIGATÓRIO)

Execute no **SQL Editor** do Supabase:

```sql
-- 1. Verificar políticas existentes
SELECT 
  name,
  roles,
  cmd,
  qual,
  with_check
FROM storage.policies 
WHERE bucket_id = 'tarefas-arquivos';

-- 2. Se não houver política de leitura pública, CRIE:
-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Qualquer um pode ler arquivos" ON storage.objects;

-- Criar política de leitura PÚBLICA (obrigatório!)
CREATE POLICY "Qualquer um pode ler arquivos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tarefas-arquivos');
```

### 3. Teste Direto da URL

Abra no navegador a URL do arquivo:
```
https://ouewdngpvwiaqxlouckj.supabase.co/storage/v1/object/public/tarefas-arquivos/2/2-1764811978789.PNG
```

**Se a URL abrir no navegador:**
- ✅ Permissões estão corretas
- ✅ O problema pode ser CORS (mas deve funcionar)

**Se a URL NÃO abrir (erro 403 ou 404):**
- ❌ Permissões estão erradas
- ❌ Execute os passos acima

## 🔧 Solução Completa

Execute este script completo no **SQL Editor**:

```sql
-- ============================================
-- CONFIGURAÇÃO COMPLETA DE STORAGE
-- ============================================

-- 1. Remover TODAS as políticas antigas do bucket
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer um pode ler arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar" ON storage.objects;

-- 2. Criar políticas corretas

-- Upload (apenas autenticados)
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tarefas-arquivos');

-- LEITURA PÚBLICA (OBRIGATÓRIO PARA VISUALIZAÇÃO/DOWNLOAD)
CREATE POLICY "Qualquer um pode ler arquivos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tarefas-arquivos');

-- Atualização (apenas autenticados)
CREATE POLICY "Usuários autenticados podem atualizar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');

-- Exclusão (apenas autenticados)
CREATE POLICY "Usuários autenticados podem deletar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');

-- 3. Verificar se foi criado corretamente
SELECT 
  name,
  roles,
  cmd
FROM storage.policies 
WHERE bucket_id = 'tarefas-arquivos';
```

## ✅ Após Configurar

1. **Teste a URL diretamente no navegador**
2. **Se abrir, teste na aplicação**
3. **Deve funcionar agora!**

## ⚠️ Se Ainda Não Funcionar

1. Verifique se o bucket está realmente **público** no Dashboard
2. Verifique se as políticas foram criadas (execute a query de verificação)
3. Teste a URL diretamente no navegador
4. Verifique o console do navegador (F12) para erros

