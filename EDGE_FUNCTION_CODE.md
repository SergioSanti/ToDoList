# ⚡ Código da Edge Function - Resumo de Tarefas

## 📍 Onde Criar

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Edge Functions**
4. Clique em **"Create a new function"**
5. Nome da função: `resumo-tarefas`
6. Cole o código abaixo
7. Clique em **"Deploy function"**

## 📝 Código da Edge Function

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

## ✅ Após Criar

A Edge Function estará disponível em:
```
https://ouewdngpvwiaqxlouckj.supabase.co/functions/v1/resumo-tarefas
```

## 🧪 Testar

Você pode testar a função diretamente do código Angular ou usando o dashboard do Supabase.

