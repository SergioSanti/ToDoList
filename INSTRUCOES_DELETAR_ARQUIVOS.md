# 🗑️ Instruções para Deletar Arquivos Corrompidos no Supabase

## ⚠️ IMPORTANTE: Faça isso ANTES de re-uploadar arquivos

Os arquivos antigos foram salvos incorretamente com headers multipart form-data. Você PRECISA deletá-los do Supabase Storage antes de fazer novos uploads.

## 📋 Passo a Passo

### 1. Limpar Referências no Banco de Dados

1. **Acesse o Supabase Dashboard:**
   - Vá em **SQL Editor** (ícone de banco de dados no menu lateral)

2. **Execute o script SQL:**
   - Abra o arquivo `LIMPAR_ARQUIVOS_CORROMPIDOS.sql`
   - Copie e cole o conteúdo no SQL Editor
   - Clique em **Run** (ou pressione `Ctrl+Enter`)

   Isso vai limpar todas as referências de arquivos nas tarefas.

### 2. Deletar Arquivos do Storage

1. **Acesse o Storage:**
   - Vá em **Storage** → **Buckets** → **tarefas-arquivos**

2. **Delete TODOS os arquivos:**
   - Selecione TODOS os arquivos (use `Ctrl+A` ou `Cmd+A`)
   - Clique no botão **Delete** (ícone de lixeira)
   - Confirme a exclusão

   **⚠️ ATENÇÃO:** Isso vai deletar TODOS os arquivos. Você precisará re-uploadar depois.

### 3. Verificar que o Bucket está Vazio

1. **Confirme que não há arquivos:**
   - O bucket `tarefas-arquivos` deve estar vazio
   - Se ainda houver arquivos, delete-os manualmente

### 4. Verificar Permissões do Bucket

1. **Vá em Storage → Buckets → tarefas-arquivos → Policies**

2. **Verifique se há políticas públicas:**
   - Deve ter uma política que permite leitura pública
   - Se não tiver, crie uma:

   ```sql
   -- Política para leitura pública
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'tarefas-arquivos');
   ```

### 5. Re-uploadar Arquivos

1. **Na aplicação:**
   - Edite cada tarefa que tinha arquivo
   - Faça upload do arquivo novamente
   - O código agora está corrigido e vai salvar corretamente

2. **Teste:**
   - Após fazer upload, acesse a URL diretamente
   - Deve mostrar a imagem/PDF corretamente
   - Não deve mostrar dados multipart

## ✅ Verificação Final

Após re-uploadar, verifique:

1. **No Supabase Storage:**
   - O arquivo deve aparecer com o tipo correto (ex: "image/png")
   - O tamanho deve ser o tamanho real do arquivo (não maior)

2. **Acessando a URL diretamente:**
   - Deve mostrar a imagem/PDF corretamente
   - Não deve mostrar dados multipart ou texto estranho

3. **Na aplicação:**
   - Visualizar deve abrir em nova aba e mostrar a imagem
   - Download deve funcionar corretamente

## 🔧 Se Ainda Não Funcionar

Se mesmo após deletar e re-uploadar o problema continuar:

1. **Verifique o console do navegador:**
   - Abra o DevTools (F12)
   - Vá na aba Console
   - Procure por erros durante o upload

2. **Verifique o Network:**
   - Abra o DevTools (F12)
   - Vá na aba Network
   - Faça upload de um arquivo
   - Veja a requisição de upload
   - Verifique se o Content-Type está correto

3. **Limpe o cache do navegador:**
   - Pressione `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
   - Ou abra em aba anônima

