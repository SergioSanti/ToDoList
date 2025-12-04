# ✅ Solução Simples - Upload de Arquivos

## 🎯 O Problema

Os arquivos estão sendo salvos como `application/json` ao invés do tipo correto (`image/png`, `image/jpeg`, `application/pdf`).

## 🔧 Solução em 3 Passos

### 1️⃣ DELETAR TODOS OS ARQUIVOS CORROMPIDOS

**No Supabase Dashboard:**
1. Vá em **Storage** → **Buckets** → **tarefas-arquivos**
2. Selecione **TODOS** os arquivos (Ctrl+A)
3. Clique em **Delete** (ícone de lixeira)
4. Confirme

**No SQL Editor:**
```sql
UPDATE tarefas
SET arquivo_url = NULL,
    arquivo_nome = NULL
WHERE arquivo_url IS NOT NULL;
```

### 2️⃣ VERIFICAR BUCKET ESTÁ PÚBLICO

1. Vá em **Storage** → **Buckets** → **tarefas-arquivos**
2. Verifique que está marcado como **Público**
3. Se não estiver, marque como público

### 3️⃣ FAZER UPLOAD NOVAMENTE

1. Na aplicação, edite uma tarefa
2. Faça upload de uma imagem (PNG, JPG, JPEG) ou PDF
3. **O código agora está corrigido** e vai salvar com o tipo correto

## ✅ Como Verificar que Funcionou

1. **No Supabase Storage:**
   - O arquivo deve aparecer como `image/png` ou `image/jpeg` (NÃO `application/json`)
   - O tamanho deve ser o tamanho real do arquivo

2. **Acessando a URL diretamente:**
   - Deve mostrar a imagem/PDF corretamente
   - Não deve mostrar texto estranho ou dados multipart

3. **Na aplicação:**
   - Visualizar deve abrir a imagem em nova aba
   - Download deve funcionar

## ⚠️ IMPORTANTE

**Você PRECISA deletar os arquivos corrompidos ANTES de fazer novos uploads!**

Se você fizer upload sem deletar os antigos, o problema vai continuar porque os arquivos antigos ainda estão lá.

