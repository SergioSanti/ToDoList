// @ts-nocheck
// Este arquivo contém código Deno para Edge Functions do Supabase
// Os erros do TypeScript podem ser ignorados - este código não é usado no build do Angular
// É apenas uma referência para copiar o código para o Supabase Dashboard

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    supabase.auth.setSession({ access_token: token, refresh_token: '' } as any)

    const { categoryId } = await req.json().catch(() => ({})) || {}

    let query = supabase
      .from('tarefas')
      .select('*')

    if (categoryId) {
      query = query.eq('categoria_id', categoryId)
    }

    const { data: tasks, error } = await query

    if (error) {
      throw error
    }

    // Filtrar tarefas não deletadas
    const activeTasks = tasks?.filter(t => !t.excluida) || []
    const completedTasks = activeTasks.filter(t => t.concluida === true)
    const pendingTasks = activeTasks.filter(t => t.concluida === false || !t.concluida)
    const deletedTasks = tasks?.filter(t => t.excluida) || []

    const totalTasks = tasks?.length || 0

    const priorityDistribution = {
      1: activeTasks.filter(t => t.prioridade === 1).length,
      2: activeTasks.filter(t => t.prioridade === 2).length,
      3: activeTasks.filter(t => t.prioridade === 3).length,
      4: activeTasks.filter(t => t.prioridade === 4).length,
      5: activeTasks.filter(t => t.prioridade === 5).length,
    }

    // Calcular taxa de conclusão corretamente
    // Taxa = (Completas / Total de Ativas) * 100
    let completionRate = 0
    if (activeTasks.length > 0) {
      completionRate = (completedTasks.length / activeTasks.length) * 100
    }

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
          completedCount: activeTasks.filter(t => t.categoria_id === cat.id && t.concluida === true).length
        }))
      }
    }

    const summary = {
      totalTasks,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      deletedTasks: deletedTasks.length,
      completionRate: Math.round(completionRate * 100) / 100, // Arredonda para 2 casas decimais
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
