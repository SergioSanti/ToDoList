# ⚡ Quick Start - Configuração Rápida do Supabase

## 📋 Checklist Rápido

### 1️⃣ Criar Projeto
- [ ] Acesse [supabase.com](https://supabase.com)
- [ ] Crie novo projeto
- [ ] Anote a senha do banco de dados

### 2️⃣ Obter Credenciais
- [ ] Vá em **Settings** → **API**
- [ ] Copie **Project URL** e **anon public key**
- [ ] Cole no arquivo `src/app/supabase-client.ts`

### 3️⃣ Criar Tabelas
- [ ] Vá em **SQL Editor**
- [ ] Abra o arquivo `supabase-setup.sql` deste projeto
- [ ] Cole e execute o script completo
- [ ] Verifique se as tabelas foram criadas

### 4️⃣ Configurar Authentication
- [ ] Vá em **Authentication** → **Providers**
- [ ] Certifique-se que **Email** está habilitado
- [ ] Vá em **Users** → **Add user**
- [ ] Crie usuário de teste (marque "Auto Confirm User")
- [ ] Anote email e senha para login

### 5️⃣ Configurar Storage
- [ ] Vá em **Storage**
- [ ] Crie bucket: `tarefas-arquivos` (público)
- [ ] Execute o script `storage-policies.sql` no SQL Editor

### 6️⃣ Testar Aplicação
- [ ] Execute `npm start`
- [ ] Faça login com o usuário criado
- [ ] Teste criar categoria e tarefa

---

## 🔑 Onde Colar as Credenciais?

**Arquivo:** `src/app/supabase-client.ts`

```typescript
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co'; // ← Cole aqui
const SUPABASE_ANON_KEY = 'eyJ...';                    // ← Cole aqui
```

---

## 📝 Scripts SQL Prontos

1. **`supabase-setup.sql`** - Cria todas as tabelas e políticas
2. **`storage-policies.sql`** - Configura políticas de Storage

---

## ⚠️ Problemas?

Consulte o arquivo **`CONFIGURACAO_SUPABASE.md`** para instruções detalhadas e solução de problemas.

---

**Tempo estimado:** 10-15 minutos ⏱️

