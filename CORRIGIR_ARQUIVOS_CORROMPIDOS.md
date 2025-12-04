# 🔧 Corrigir Arquivos Corrompidos no Upload

## ⚠️ Problema Identificado

Os arquivos estão sendo salvos como **"application/json"** ao invés do tipo correto (ex: "image/png"). Isso acontece porque o **contentType** não está sendo definido no upload.

## ✅ Correção Implementada

O código foi corrigido para:
1. ✅ Detectar o tipo MIME correto do arquivo
2. ✅ Passar o `contentType` no upload
3. ✅ Usar fallback para extensão se o tipo não estiver disponível

## 🗑️ Arquivos Corrompidos Existentes

### Opção 1: Deletar e Re-upload (Recomendado)

1. **No Supabase Dashboard:**
   - Vá em **Storage** → **Buckets** → **tarefas-arquivos**
   - Delete os arquivos corrompidos (que aparecem como "application/json")

2. **Na aplicação:**
   - Edite a tarefa
   - Faça upload do arquivo novamente
   - Agora será salvo com o tipo correto

### Opção 2: Corrigir via SQL (Avançado)

Se quiser corrigir os arquivos existentes sem deletar:

```sql
-- ATENÇÃO: Isso atualiza o metadata dos arquivos
-- Use apenas se souber o que está fazendo

UPDATE storage.objects
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{mimetype}',
  to_jsonb('image/png'::text)
)
WHERE bucket_id = 'tarefas-arquivos'
AND name LIKE '%.PNG'
AND (metadata->>'mimetype' IS NULL OR metadata->>'mimetype' = 'application/json');
```

## ✅ Teste

Após a correção:

1. **Crie uma nova tarefa** com upload de imagem
2. **Verifique no Supabase:**
   - Storage → Buckets → tarefas-arquivos
   - O arquivo deve aparecer como **"image/png"** (não "application/json")
3. **Teste visualizar** - deve funcionar
4. **Teste baixar** - deve funcionar e abrir corretamente

## 📝 Tipos MIME Suportados

O código agora detecta automaticamente:
- **Imagens:** PNG, JPG, JPEG, GIF, WEBP
- **Documentos:** PDF, DOC, DOCX, XLS, XLSX, TXT
- **Vídeos:** MP4, AVI, MOV
- **Outros:** ZIP

Se o tipo não for detectado, usa `application/octet-stream` como fallback.

---

**O código está corrigido. Novos uploads funcionarão corretamente!**

