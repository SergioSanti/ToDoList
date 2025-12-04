# ✅ Verificar e Corrigir Bucket no Supabase

## 🔍 Passo 1: Verificar Configuração do Bucket

1. **Acesse o Supabase Dashboard:**
   - Vá em **Storage** → **Buckets** → **tarefas-arquivos**

2. **Verifique as configurações:**
   - ✅ **Public bucket:** Deve estar marcado como **Público**
   - ✅ **File size limit:** Deve ser pelo menos 10MB
   - ✅ **Allowed MIME types:** Deve estar vazio (permite todos) OU ter: `image/*,application/pdf`

## 🔧 Passo 2: Verificar Políticas (Policies)

1. **Vá em Storage → Buckets → tarefas-arquivos → Policies**

2. **Deve ter estas políticas:**

### Política 1: Leitura Pública
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'tarefas-arquivos');
```

### Política 2: Upload Autenticado
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tarefas-arquivos');
```

### Política 3: Usuários podem atualizar seus próprios arquivos
```sql
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');
```

### Política 4: Usuários podem deletar seus próprios arquivos
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');
```

## 🗑️ Passo 3: DELETAR TODOS OS ARQUIVOS CORROMPIDOS

**IMPORTANTE:** Antes de fazer novos uploads, delete TODOS os arquivos corrompidos:

1. **No Storage:**
   - Selecione TODOS os arquivos
   - Clique em **Delete**
   - Confirme

2. **Execute o SQL:**
   ```sql
   UPDATE tarefas
   SET arquivo_url = NULL,
       arquivo_nome = NULL
   WHERE arquivo_url IS NOT NULL;
   ```

## ✅ Passo 4: Testar Upload

Após deletar os arquivos corrompidos:

1. **Faça upload de uma nova imagem**
2. **Verifique no Storage:**
   - O tipo deve ser `image/png` ou `image/jpeg` (NÃO `application/json`)
   - O tamanho deve ser o tamanho real do arquivo
3. **Acesse a URL diretamente:**
   - Deve mostrar a imagem corretamente

