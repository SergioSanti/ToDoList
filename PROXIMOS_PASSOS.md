# ✅ Próximos Passos - Configuração Final

## 🎉 Edge Function Criada com Sucesso!

Agora vamos configurar o Storage para upload de arquivos.

---

## 📦 PASSO 1: Criar Bucket de Storage

### 1.1 Acessar Storage no Supabase
1. No Supabase Dashboard, vá em **"Storage"** (menu lateral)
2. Você verá a lista de buckets (provavelmente vazia)

### 1.2 Criar Novo Bucket
1. Clique no botão **"New bucket"** ou **"Create bucket"**
2. Preencha:
   - **Name**: `tarefas-arquivos` (exatamente assim, sem espaços)
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (importante para download público)
3. Clique em **"Create bucket"**

### 1.3 Verificar
- O bucket `tarefas-arquivos` deve aparecer na lista
- Deve estar marcado como "Public"

---

## 🔒 PASSO 2: Configurar Políticas de Storage

### 2.1 Acessar SQL Editor
1. No Supabase Dashboard, vá em **"SQL Editor"** (menu lateral)
2. Clique em **"New query"**

### 2.2 Executar Script de Políticas
1. Abra o arquivo `storage-policies.sql` deste projeto
2. Copie TODO o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** ou pressione Ctrl+Enter

### 2.3 Verificar Políticas
1. Após executar, você deve ver uma mensagem de sucesso
2. Para verificar, execute esta query no SQL Editor:
   ```sql
   SELECT * FROM storage.policies WHERE bucket_id = 'tarefas-arquivos';
   ```
3. Deve retornar 4 políticas (INSERT, SELECT, UPDATE, DELETE)

---

## 🗄️ PASSO 3: Verificar/Atualizar Banco de Dados

### 3.1 Verificar se os Campos de Arquivo Existem
1. No SQL Editor, execute:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'tarefas' 
   AND column_name IN ('arquivo_url', 'arquivo_nome');
   ```

### 3.2 Se os Campos NÃO Existem
1. Execute este SQL no SQL Editor:
   ```sql
   -- Adicionar campos de arquivo na tabela tarefas
   ALTER TABLE tarefas 
   ADD COLUMN IF NOT EXISTS arquivo_url TEXT,
   ADD COLUMN IF NOT EXISTS arquivo_nome VARCHAR(255);
   ```

### 3.3 Se os Campos JÁ Existem
✅ Nada a fazer! Pule para o próximo passo.

---

## ✅ PASSO 4: Testar a Aplicação

### 4.1 Testar Upload de Arquivo
1. Execute a aplicação: `npm start`
2. Faça login
3. Vá em **"Nova Tarefa"**
4. Preencha os campos obrigatórios
5. **Selecione um arquivo** (imagem, PDF, etc.)
6. Clique em **"Cadastrar"**
7. Verifique se o upload funcionou

### 4.2 Testar Edge Function
1. Acesse o **Dashboard**
2. No topo da página, deve aparecer um card azul com:
   - "📊 Estatísticas Processadas (Edge Function)"
   - Taxa de conclusão
   - Estatísticas por categoria
3. Se aparecer, a Edge Function está funcionando! ✅

### 4.3 Testar Download de Arquivo
1. Na **Tabela de Tarefas**, procure uma tarefa com arquivo
2. Deve aparecer um botão/link para download
3. Clique e verifique se o arquivo baixa corretamente

---

## 📋 Checklist Final

Marque conforme completa:

- [ ] Bucket `tarefas-arquivos` criado (público)
- [ ] Políticas de Storage configuradas (4 políticas)
- [ ] Campos `arquivo_url` e `arquivo_nome` existem na tabela `tarefas`
- [ ] Upload de arquivo funcionando
- [ ] Edge Function aparecendo no Dashboard
- [ ] Download de arquivo funcionando

---

## 🎯 Status Atual

| Item | Status |
|------|--------|
| Edge Function | ✅ Criada |
| Storage Bucket | ⏳ Próximo passo |
| Políticas Storage | ⏳ Próximo passo |
| Campos no Banco | ⏳ Verificar |

---

## 🆘 Se Algo Der Errado

### Erro ao criar bucket
- Verifique se o nome está exatamente `tarefas-arquivos`
- Certifique-se de marcar como "Public"

### Erro ao executar políticas
- Verifique se o bucket foi criado primeiro
- Certifique-se de copiar TODO o conteúdo do `storage-policies.sql`

### Erro ao fazer upload
- Verifique se as políticas foram criadas corretamente
- Verifique se o bucket está marcado como público
- Veja o console do navegador (F12) para erros

### Edge Function não aparece no Dashboard
- Verifique o console do navegador (F12)
- Verifique se a função foi deployada corretamente
- A função pode falhar silenciosamente se não houver tarefas no banco

---

**Próximo passo**: Criar o bucket de Storage! 🚀

