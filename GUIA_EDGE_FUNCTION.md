# 🚀 Guia Passo a Passo - Criar Edge Function no Supabase

## 📍 Passo a Passo Detalhado

### 1️⃣ Acessar o Supabase Dashboard
1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione seu projeto (ToDoList)

### 2️⃣ Navegar até Edge Functions
1. No menu lateral esquerdo, procure por **"Edge Functions"**
2. Clique em **"Edge Functions"**
3. Você verá uma tela com a lista de funções (provavelmente vazia)

### 3️⃣ Criar Nova Função
1. Clique no botão **"Create a new function"** ou **"Deploy a new function via editor"**
2. Uma nova tela/editor será aberto

### 4️⃣ Configurar a Função
1. **Nome da função**: Digite `resumo-tarefas` (sem espaços, apenas letras minúsculas e hífens)
2. **Editor de código**: Um editor de código será exibido

### 5️⃣ Colar o Código
1. Abra o arquivo `EDGE_FUNCTION_CODE.md` deste projeto
2. Copie TODO o código que está dentro do bloco ```typescript (linhas 15-134)
3. Cole no editor do Supabase
4. O código deve ficar assim:

```typescript
// Edge Function: Resumo de Tarefas
// BUSINESS FUNCTIONALITY: Processa dados e retorna estatísticas
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
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Set auth for Supabase client
    const token = authHeader.replace('Bearer ', '')
    supabase.auth.setSession({ access_token: token, refresh_token: '' } as any)

    // Get request body
    const { categoryId } = await req.json().catch(() => ({})) || {}

    // BUSINESS FUNCTIONALITY: Query tasks and calculate statistics
    let query = supabase
      .from('tarefas')
      .select('*')

    // Filter by category if provided
    if (categoryId) {
      query = query.eq('categoria_id', categoryId)
    }

    const { data: tasks, error } = await query

    if (error) {
      throw error
    }

    // BUSINESS LOGIC: Calculate statistics
    const totalTasks = tasks?.length || 0
    const activeTasks = tasks?.filter(t => !t.excluida) || []
    const completedTasks = activeTasks.filter(t => t.concluida)
    const pendingTasks = activeTasks.filter(t => !t.concluida)
    const deletedTasks = tasks?.filter(t => t.excluida) || []

    // Calculate priority distribution
    const priorityDistribution = {
      1: activeTasks.filter(t => t.prioridade === 1).length,
      2: activeTasks.filter(t => t.prioridade === 2).length,
      3: activeTasks.filter(t => t.prioridade === 3).length,
      4: activeTasks.filter(t => t.prioridade === 4).length,
      5: activeTasks.filter(t => t.prioridade === 5).length,
    }

    // Calculate completion rate
    const completionRate = activeTasks.length > 0 
      ? (completedTasks.length / activeTasks.length) * 100 
      : 0

    // Get category statistics if no category filter
    let categoryStats = []
    if (!categoryId) {
      const { data: categories } = await supabase
        .from('categorias')
        .select('id, nome')

      if (categories) {
        categoryStats = categories.map(cat => ({
          categoryId: cat.id,
          categoryName: cat.nome,
          taskCount: activeTasks.filter(t => t.categoria_id === cat.id).length,
          completedCount: activeTasks.filter(t => t.categoria_id === cat.id && t.concluida).length
        }))
      }
    }

    // BUSINESS FUNCTIONALITY: Return processed statistics
    const summary = {
      totalTasks,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      deletedTasks: deletedTasks.length,
      completionRate: Math.round(completionRate * 100) / 100,
      priorityDistribution,
      categoryStats,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(summary),
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

### 6️⃣ Deploy da Função
1. Após colar o código, procure pelo botão **"Deploy"** ou **"Deploy function"**
2. Clique no botão
3. Aguarde alguns segundos enquanto o Supabase faz o deploy
4. Você verá uma mensagem de sucesso quando terminar

### 7️⃣ Verificar se Funcionou
1. Após o deploy, a função `resumo-tarefas` aparecerá na lista de Edge Functions
2. Você pode clicar nela para ver detalhes
3. A URL da função será algo como:
   ```
   https://ouewdngpvwiaqxlouckj.supabase.co/functions/v1/resumo-tarefas
   ```

---

## ✅ Resumo Rápido

1. **Supabase Dashboard** → **Edge Functions**
2. **"Create a new function"** ou **"Deploy a new function via editor"**
3. **Nome**: `resumo-tarefas`
4. **Colar código** do arquivo `EDGE_FUNCTION_CODE.md`
5. **Deploy**

---

## ⚠️ Dicas Importantes

- ✅ O nome da função deve ser em minúsculas e sem espaços
- ✅ Certifique-se de copiar TODO o código (não apenas parte dele)
- ✅ Após o deploy, a função estará disponível imediatamente
- ✅ Se der erro, verifique se copiou todo o código corretamente

---

## 🧪 Testar Após Criar

Após criar a Edge Function, quando você acessar o Dashboard da aplicação, você verá um card no topo mostrando "Estatísticas Processadas (Edge Function)" com os dados processados pela função.

Se não aparecer, verifique o console do navegador (F12) para ver se há erros.

