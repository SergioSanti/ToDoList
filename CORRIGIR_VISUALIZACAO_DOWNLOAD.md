# 🔧 Correções de Visualização e Download de Arquivos

## ✅ Correções Implementadas

### 1. Visualização de Imagens
- **Problema**: Imagens não carregavam no modal (erro CORS)
- **Solução**: Carregamento via `fetch()` e criação de blob URL
- **Benefício**: Contorna problemas de CORS e garante que a imagem seja carregada corretamente

### 2. Download de Arquivos
- **Problema**: Arquivos baixados estavam corrompidos (formato inválido)
- **Solução**: 
  - Verificação de blob válido
  - Criação de blob com MIME type correto
  - Fallback para download via fetch se StorageService falhar
- **Benefício**: Arquivos baixados mantêm o formato correto e podem ser abertos normalmente

## 🔍 Verificações no Supabase

Se ainda houver problemas, verifique no Supabase Dashboard:

### 1. Bucket Público
1. Acesse: **Storage** → **Buckets**
2. Clique no bucket `tarefas-arquivos`
3. Verifique se **"Public bucket"** está **ATIVADO** ✅

### 2. Políticas de Storage (RLS)
Execute no **SQL Editor** do Supabase:

```sql
-- Verificar políticas existentes
SELECT * FROM storage.policies WHERE bucket_id = 'tarefas-arquivos';

-- Se necessário, recriar políticas
-- Remover políticas antigas
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer um pode ler arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar" ON storage.objects;

-- Criar políticas corretas
-- Política para upload (INSERT)
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tarefas-arquivos');

-- Política para leitura (SELECT) - PÚBLICO (importante!)
CREATE POLICY "Qualquer um pode ler arquivos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tarefas-arquivos');

-- Política para atualização (UPDATE)
CREATE POLICY "Usuários autenticados podem atualizar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');

-- Política para exclusão (DELETE)
CREATE POLICY "Usuários autenticados podem deletar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');
```

### 3. CORS Configuration
1. Acesse: **Storage** → **Settings** → **CORS**
2. Adicione sua origem (ex: `https://seu-dominio.vercel.app`)
3. Ou use `*` para permitir todas as origens (apenas para desenvolvimento)

## 📝 Como Funciona Agora

### Visualização
1. **Imagens**: Carregadas via `fetch()` → criado blob → exibido no modal
2. **PDFs**: Carregados diretamente via iframe
3. **Outros**: Mensagem informando que não podem ser visualizados

### Download
1. **Primeira tentativa**: Usa `StorageService.downloadFile()` (método do Supabase)
2. **Fallback 1**: Se falhar, usa `fetch()` para baixar
3. **Fallback 2**: Se tudo falhar, tenta download direto via link
4. **MIME Type**: Blob criado com MIME type correto baseado na extensão do arquivo

## 🧪 Teste

1. **Visualizar imagem**:
   - Clique em "Visualizar" em uma tarefa com imagem
   - A imagem deve aparecer no modal
   - Se não aparecer, verifique o console do navegador (F12)

2. **Baixar arquivo**:
   - Clique em "Baixar" em uma tarefa com arquivo
   - O arquivo deve ser baixado
   - Abra o arquivo baixado - deve abrir corretamente

## ⚠️ Se Ainda Não Funcionar

1. Verifique o console do navegador (F12) para erros
2. Verifique se o bucket está público no Supabase
3. Verifique se as políticas RLS estão corretas
4. Teste a URL diretamente no navegador:
   - `https://ouewdngpvwiaqxlouckj.supabase.co/storage/v1/object/public/tarefas-arquivos/2/2-1764811978789.PNG`
   - Se abrir, o problema é CORS
   - Se não abrir, o problema é permissão

