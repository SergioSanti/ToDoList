# 📋 Guia de Configuração do Supabase

Este documento contém todas as instruções necessárias para configurar o Supabase e fazer a aplicação funcionar corretamente.

---

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"** ou faça login
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: Nome do projeto (ex: `todolist-app`)
   - **Database Password**: Escolha uma senha forte (anote ela!)
   - **Region**: Escolha a região mais próxima (ex: `South America (São Paulo)`)
   - **Pricing Plan**: Escolha **Free** para começar
5. Clique em **"Create new project"**
6. Aguarde alguns minutos até o projeto estar pronto

---

## 🔑 Passo 2: Obter Credenciais do Projeto

1. No painel do Supabase, vá em **Settings** (⚙️) → **API**
2. Você encontrará:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Uma chave longa começando com `eyJ...`
3. Copie essas duas informações

### Configurar no Código

Abra o arquivo `src/app/supabase-client.ts` e substitua:

```typescript
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co'; // Cole sua URL aqui
const SUPABASE_ANON_KEY = 'SEU-ANON-KEY-AQUI';          // Cole sua chave anon aqui
```

---

## 🗄️ Passo 3: Criar Tabelas no Database

### 3.1. Acessar o SQL Editor

1. No painel do Supabase, clique em **SQL Editor** no menu lateral
2. Clique em **"New query"**

### 3.2. Criar Tabela `categorias`

Execute o seguinte SQL:

```sql
-- Criar tabela categorias
CREATE TABLE IF NOT EXISTS categorias (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  cor VARCHAR(7) DEFAULT '#007bff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem fazer tudo
CREATE POLICY "Usuários autenticados podem gerenciar categorias"
ON categorias
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_categorias_nome ON categorias(nome);
```

### 3.3. Criar Tabela `tarefas`

Execute o seguinte SQL:

```sql
-- Criar tabela tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  prioridade INTEGER NOT NULL CHECK (prioridade >= 1 AND prioridade <= 5),
  concluida BOOLEAN DEFAULT FALSE NOT NULL,
  excluida BOOLEAN DEFAULT FALSE NOT NULL,
  categoria_id BIGINT NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem fazer tudo
CREATE POLICY "Usuários autenticados podem gerenciar tarefas"
ON tarefas
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tarefas_categoria_id ON tarefas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_excluida ON tarefas(excluida);
CREATE INDEX IF NOT EXISTS idx_tarefas_concluida ON tarefas(concluida);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_tarefas_updated_at
  BEFORE UPDATE ON tarefas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON categorias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3.4. Inserir Dados Iniciais (Opcional)

Para ter dados de exemplo, execute:

```sql
-- Inserir categorias de exemplo
INSERT INTO categorias (nome, descricao, cor) VALUES
  ('Trabalho', 'Tarefas relacionadas ao trabalho', '#007bff'),
  ('Pessoal', 'Tarefas pessoais', '#28a745'),
  ('Estudos', 'Tarefas de estudo', '#ffc107')
ON CONFLICT DO NOTHING;

-- Inserir tarefas de exemplo (ajuste os IDs das categorias conforme necessário)
INSERT INTO tarefas (titulo, descricao, prioridade, concluida, categoria_id) VALUES
  ('Comprar leite', 'Ir ao supermercado comprar leite', 2, false, 1),
  ('Estudar Angular', 'Revisar conceitos de SPA e componentes', 1, false, 3)
ON CONFLICT DO NOTHING;
```

---

## 👤 Passo 4: Configurar Authentication

### 4.1. Habilitar Email/Password Authentication

1. No painel do Supabase, vá em **Authentication** → **Providers**
2. Certifique-se de que **Email** está habilitado
3. Opcionalmente, configure:
   - **Confirm email**: Desmarque se quiser login direto sem confirmação (útil para desenvolvimento)
   - **Secure email change**: Marque se quiser segurança extra

### 4.2. Criar Usuário de Teste

1. Vá em **Authentication** → **Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email**: `admin@teste.com` (ou qualquer email)
   - **Password**: Escolha uma senha (ex: `123456`)
   - **Auto Confirm User**: ✅ Marque esta opção
4. Clique em **"Create user"**

### 4.3. Atualizar o Formulário de Login

O código já está configurado para usar email e senha. Use o email e senha criados acima para fazer login.

---

## 📦 Passo 5: Configurar Storage (Upload de Arquivos)

### 5.1. Criar Bucket de Storage

1. No painel do Supabase, vá em **Storage**
2. Clique em **"New bucket"**
3. Configure:
   - **Name**: `tarefas-arquivos`
   - **Public bucket**: ✅ Marque esta opção (para acesso público aos arquivos)
4. Clique em **"Create bucket"**

### 5.2. Configurar Políticas de Storage

1. No bucket criado, vá em **"Policies"**
2. Clique em **"New Policy"**
3. Selecione **"For full customization"**
4. Nome da política: `Usuários autenticados podem fazer upload`
5. Execute o seguinte SQL:

```sql
-- Política para upload
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tarefas-arquivos');

-- Política para leitura (público)
CREATE POLICY "Qualquer um pode ler arquivos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tarefas-arquivos');

-- Política para atualização
CREATE POLICY "Usuários autenticados podem atualizar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');

-- Política para exclusão
CREATE POLICY "Usuários autenticados podem deletar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tarefas-arquivos');
```

---

## ⚡ Passo 6: Criar Edge Function (Funcionalidade de Negócio)

### 6.1. Instalar Supabase CLI (Opcional - para desenvolvimento local)

Se quiser criar Edge Functions localmente:

```bash
npm install -g supabase
```

### 6.2. Criar Edge Function via Dashboard

1. No painel do Supabase, vá em **Edge Functions**
2. Clique em **"Create a new function"**
3. Nome: `resumo-tarefas`
4. Cole o seguinte código:

```typescript
// Edge Function: Resumo de Tarefas
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Buscar todas as tarefas
    const { data: tarefas, error } = await supabaseClient
      .from('tarefas')
      .select('*')

    if (error) throw error

    // Calcular estatísticas
    const total = tarefas.length
    const ativas = tarefas.filter(t => !t.excluida).length
    const excluidas = tarefas.filter(t => t.excluida).length
    const concluidas = tarefas.filter(t => t.concluida && !t.excluida).length
    const pendentes = tarefas.filter(t => !t.concluida && !t.excluida).length
    
    // Agrupar por categoria
    const porCategoria = tarefas.reduce((acc: any, tarefa: any) => {
      if (!tarefa.excluida) {
        acc[tarefa.categoria_id] = (acc[tarefa.categoria_id] || 0) + 1
      }
      return acc
    }, {})

    // Agrupar por prioridade
    const porPrioridade = tarefas.reduce((acc: any, tarefa: any) => {
      if (!tarefa.excluida) {
        acc[tarefa.prioridade] = (acc[tarefa.prioridade] || 0) + 1
      }
      return acc
    }, {})

    const resumo = {
      total,
      ativas,
      excluidas,
      concluidas,
      pendentes,
      porCategoria,
      porPrioridade,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(resumo),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

5. Clique em **"Deploy function"**

### 6.3. Testar Edge Function

Após criar, você pode testar chamando:
```
POST https://SEU-PROJETO.supabase.co/functions/v1/resumo-tarefas
Headers:
  Authorization: Bearer SEU-ANON-KEY
```

---

## ✅ Passo 7: Verificar Configuração

### Checklist Final:

- [ ] Projeto criado no Supabase
- [ ] Credenciais (URL e ANON KEY) configuradas no código
- [ ] Tabela `categorias` criada com RLS habilitado
- [ ] Tabela `tarefas` criada com RLS habilitado
- [ ] Políticas RLS configuradas para usuários autenticados
- [ ] Authentication habilitado (Email/Password)
- [ ] Usuário de teste criado
- [ ] Storage bucket criado (`tarefas-arquivos`)
- [ ] Políticas de Storage configuradas
- [ ] Edge Function criada (opcional, mas recomendado)

---

## 🧪 Passo 8: Testar a Aplicação

1. Execute a aplicação:
```bash
cd ToDoList
npm start
```

2. Acesse `http://localhost:4200`
3. Faça login com o email e senha criados no passo 4.2
4. Teste criar categorias e tarefas
5. Verifique se os dados aparecem no dashboard

---

## 🔒 Segurança - Row Level Security (RLS)

As políticas RLS criadas permitem que:
- ✅ Usuários autenticados podem criar, ler, atualizar e deletar seus próprios dados
- ❌ Usuários não autenticados não podem acessar nada

**Importante**: Se quiser permitir acesso sem autenticação (apenas para desenvolvimento), você pode criar políticas mais permissivas, mas **NÃO faça isso em produção**.

---

## 📝 Notas Importantes

1. **Senha do Banco**: Anote a senha do banco de dados criada no passo 1. Você precisará dela para conexões diretas.

2. **Chaves de API**: 
   - **anon key**: Pode ser exposta no frontend (é segura devido ao RLS)
   - **service_role key**: NUNCA exponha no frontend (use apenas em backend/server)

3. **Limites do Plano Free**:
   - 500 MB de banco de dados
   - 1 GB de storage
   - 2 GB de transferência
   - 500.000 requisições por mês

4. **Backup**: O Supabase Free faz backup automático, mas considere fazer backups manuais antes de mudanças importantes.

---

## 🆘 Problemas Comuns

### Erro: "relation does not exist"
- **Solução**: Certifique-se de executar os scripts SQL na ordem correta

### Erro: "new row violates row-level security policy"
- **Solução**: Verifique se as políticas RLS estão configuradas corretamente e se o usuário está autenticado

### Erro: "Invalid API key"
- **Solução**: Verifique se copiou corretamente a URL e a ANON KEY no arquivo `supabase-client.ts`

### Erro: "Email not confirmed"
- **Solução**: Crie o usuário com "Auto Confirm User" marcado, ou desabilite a confirmação de email nas configurações de Authentication

---

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Guia de Storage](https://supabase.com/docs/guides/storage)
- [Guia de Edge Functions](https://supabase.com/docs/guides/functions)

---

**Pronto!** Agora sua aplicação está configurada para usar todos os recursos Serverless do Supabase! 🎉

