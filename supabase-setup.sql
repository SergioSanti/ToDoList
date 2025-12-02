-- ============================================
-- SCRIPT DE CONFIGURAÇÃO COMPLETA DO SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Menu: SQL Editor → New query → Cole este código → Run

-- ============================================
-- 1. CRIAR TABELA CATEGORIAS
-- ============================================
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

-- ============================================
-- 2. CRIAR TABELA TAREFAS
-- ============================================
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

-- ============================================
-- 3. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_tarefas_updated_at
  BEFORE UPDATE ON tarefas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON categorias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. DADOS INICIAIS (OPCIONAL)
-- ============================================
-- Descomente as linhas abaixo se quiser dados de exemplo

-- Inserir categorias de exemplo
INSERT INTO categorias (nome, descricao, cor) VALUES
  ('Trabalho', 'Tarefas relacionadas ao trabalho', '#007bff'),
  ('Pessoal', 'Tarefas pessoais', '#28a745'),
  ('Estudos', 'Tarefas de estudo', '#ffc107')
ON CONFLICT DO NOTHING;

-- Inserir tarefas de exemplo (ajuste os IDs das categorias conforme necessário)
-- Nota: Os IDs das categorias podem variar. Verifique os IDs inseridos acima antes de executar.
INSERT INTO tarefas (titulo, descricao, prioridade, concluida, categoria_id) VALUES
  ('Comprar leite', 'Ir ao supermercado comprar leite', 2, false, (SELECT id FROM categorias WHERE nome = 'Pessoal' LIMIT 1)),
  ('Estudar Angular', 'Revisar conceitos de SPA e componentes', 1, false, (SELECT id FROM categorias WHERE nome = 'Estudos' LIMIT 1))
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. VERIFICAR CRIAÇÃO DAS TABELAS
-- ============================================
-- Execute estas queries para verificar se tudo foi criado corretamente:

-- SELECT * FROM categorias;
-- SELECT * FROM tarefas;

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- Próximos passos:
-- 1. Configure Authentication (Settings → Authentication → Providers)
-- 2. Crie um usuário de teste (Authentication → Users → Add user)
-- 3. Configure Storage (Storage → New bucket → nome: tarefas-arquivos)
-- 4. Configure as credenciais no arquivo supabase-client.ts

