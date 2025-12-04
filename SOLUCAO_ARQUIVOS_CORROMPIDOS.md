# 🔧 Solução Definitiva: Arquivos Corrompidos no Supabase Storage

## ⚠️ Problema Identificado

Os arquivos estão sendo salvos **com headers multipart form-data incluídos** ao invés do conteúdo binário puro. Quando você acessa a URL diretamente, vê dados como:

```
------WebKitFormBoundary...
Content-Disposition: form-data; name="cacheControl"
3600
------WebKitFormBoundary...
Content-Disposition: form-data; name=""; filename="..."
Content-Type: image/png
[conteúdo binário]
```

Isso significa que o **arquivo inteiro (incluindo headers multipart) foi salvo como conteúdo**, não apenas o binário do arquivo.

## 🔍 Causa Raiz

Os arquivos foram salvos **incorretamente anteriormente**. O código atual está correto, mas os arquivos antigos no Supabase Storage estão corrompidos.

## ✅ Solução: Deletar Arquivos Corrompidos e Re-uploadar

### Passo 1: Deletar Arquivos Corrompidos no Supabase

1. **Acesse o Supabase Dashboard:**
   - Vá em **Storage** → **Buckets** → **tarefas-arquivos**

2. **Identifique arquivos corrompidos:**
   - Arquivos que mostram "application/json" ou tamanho muito maior que o esperado
   - Arquivos que quando acessados diretamente mostram dados multipart

3. **Delete os arquivos corrompidos:**
   - Selecione os arquivos
   - Clique em **Delete**
   - Confirme a exclusão

### Passo 2: Limpar Referências no Banco de Dados

Execute este SQL no Supabase SQL Editor:

```sql
-- Limpar URLs de arquivos corrompidos das tarefas
UPDATE tarefas
SET arquivo_url = NULL,
    arquivo_nome = NULL
WHERE arquivo_url IS NOT NULL;
```

### Passo 3: Re-uploadar Arquivos

1. **Na aplicação:**
   - Edite cada tarefa que tinha arquivo
   - Faça upload do arquivo novamente
   - O código atual **já está correto** e vai salvar corretamente

## 🔍 Verificação do Código Atual

O código de upload em `storage-service.ts` está **correto**:

```typescript
uploadFile(file: File, taskId: number): Observable<{ path: string; url: string }> {
  const supabase = getSupabaseClient();
  
  // Gera nome único
  const fileExt = file.name.split('.').pop();
  const fileName = `${taskId}-${Date.now()}.${fileExt}`;
  const filePath = `${taskId}/${fileName}`;

  // Detecta MIME type correto
  const mimeType = file.type || this.getMimeTypeFromExtension(fileExt || '');

  // Upload direto do File object (correto!)
  return from(
    supabase.storage
      .from(this.BUCKET_NAME)
      .upload(filePath, file, {  // ← File object direto, não FormData!
        cacheControl: '3600',
        upsert: false,
        contentType: mimeType  // ← MIME type correto
      })
  );
}
```

**O código está passando o `File` object diretamente**, não FormData. Isso está correto!

## 🧪 Teste Após Correção

1. **Crie uma nova tarefa** com upload de arquivo
2. **Verifique no Supabase:**
   - Storage → Buckets → tarefas-arquivos
   - O arquivo deve aparecer com o tipo correto (ex: "image/png")
   - O tamanho deve ser o tamanho real do arquivo
3. **Acesse a URL diretamente:**
   - Deve mostrar a imagem/PDF corretamente
   - Não deve mostrar dados multipart
4. **Teste na aplicação:**
   - Visualizar deve abrir em nova aba
   - Download deve funcionar corretamente

## 📝 Nota Importante

**O código atual está correto!** O problema são os arquivos antigos que foram salvos incorretamente. Após deletar e re-uploadar, tudo deve funcionar perfeitamente.

## 🔄 Se o Problema Persistir

Se mesmo após deletar e re-uploadar o problema continuar:

1. **Verifique as permissões do bucket:**
   - Storage → Buckets → tarefas-arquivos → Policies
   - Deve ter políticas públicas para leitura

2. **Verifique o CORS:**
   - O Supabase Storage já tem CORS configurado por padrão
   - Se necessário, adicione sua origem nas configurações

3. **Limpe o cache do navegador:**
   - Pressione `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
   - Ou abra em aba anônima

