-- Script SQL para limpar referências de arquivos corrompidos
-- Execute este script no Supabase SQL Editor

-- 1. Limpar todas as referências de arquivos nas tarefas
UPDATE tarefas
SET arquivo_url = NULL,
    arquivo_nome = NULL
WHERE arquivo_url IS NOT NULL;

-- 2. Verificar quantas tarefas foram atualizadas
SELECT COUNT(*) as tarefas_atualizadas
FROM tarefas
WHERE arquivo_url IS NULL AND arquivo_nome IS NULL;

