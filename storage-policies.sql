-- ============================================
-- POLÍTICAS DE STORAGE PARA O BUCKET 'tarefas-arquivos'
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- IMPORTANTE: Primeiro crie o bucket 'tarefas-arquivos' no Storage

-- ============================================
-- POLÍTICAS DE STORAGE
-- ============================================

-- Política para upload (INSERT)
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tarefas-arquivos');

-- Política para leitura (SELECT) - Público
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

-- ============================================
-- VERIFICAR POLÍTICAS CRIADAS
-- ============================================
-- SELECT * FROM storage.policies WHERE bucket_id = 'tarefas-arquivos';

