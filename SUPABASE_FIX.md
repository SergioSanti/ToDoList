# 🔧 Correção de Problemas no Supabase

Se você está tendo problemas com "Session was not maintained after login", siga estes passos:

## 1. Verificar Configurações de Autenticação no Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** → **Settings**
4. Verifique as seguintes configurações:

### Email Auth
- ✅ **Enable Email Signup**: Deve estar habilitado
- ✅ **Confirm email**: Pode estar desabilitado para testes (mas recomendado habilitar)
- ✅ **Secure email change**: Pode estar desabilitado

### URL Configuration
- ✅ **Site URL**: Deve ser a URL do seu Vercel (ex: `https://seu-app.vercel.app`)
- ✅ **Redirect URLs**: Adicione:
  - `https://seu-app.vercel.app/**`
  - `http://localhost:4200/**` (para desenvolvimento)

## 2. Verificar RLS (Row Level Security)

1. Vá em **Authentication** → **Policies**
2. Verifique se as tabelas `tarefas` e `categorias` têm políticas adequadas
3. Para testes, você pode criar políticas temporárias:

```sql
-- Permitir tudo para usuários autenticados (APENAS PARA TESTES)
CREATE POLICY "Allow all for authenticated users" ON tarefas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON categorias
  FOR ALL USING (auth.role() = 'authenticated');
```

## 3. Verificar se o Usuário Existe e Está Ativo

1. Vá em **Authentication** → **Users**
2. Verifique se o usuário existe
3. Verifique se o email está confirmado (se a confirmação estiver habilitada)
4. Se não estiver confirmado, clique em "Confirm email" ou desabilite a confirmação temporariamente

## 4. Verificar CORS (se aplicável)

1. Vá em **Settings** → **API**
2. Verifique se não há restrições de CORS bloqueando requisições

## 5. Testar no Console do Navegador

Abra o console (F12) e execute:

```javascript
// Verificar se Supabase está funcionando
const supabase = window.supabase || // verifique como está sendo exposto
console.log('Supabase client:', supabase);

// Tentar login manualmente
supabase.auth.signInWithPassword({
  email: 'seu-email@exemplo.com',
  password: 'sua-senha'
}).then(({ data, error }) => {
  console.log('Login result:', { data, error });
  
  // Verificar sessão
  supabase.auth.getSession().then(({ data, error }) => {
    console.log('Session:', { data, error });
  });
});
```

## 6. Verificar LocalStorage

No console do navegador:

```javascript
// Ver todas as chaves do localStorage
Object.keys(localStorage).forEach(key => {
  if (key.includes('supabase') || key.includes('auth')) {
    console.log(key, localStorage.getItem(key));
  }
});
```

## 7. Solução Rápida: Desabilitar Confirmação de Email

Se o problema for confirmação de email:

1. Vá em **Authentication** → **Settings** → **Email Auth**
2. Desabilite temporariamente **"Confirm email"**
3. Teste novamente o login

## 8. Verificar Logs do Supabase

1. Vá em **Logs** → **Auth Logs**
2. Verifique se há erros relacionados ao login
3. Verifique se as requisições estão chegando ao Supabase

## 9. Recriar Usuário (se necessário)

Se nada funcionar:

1. Vá em **Authentication** → **Users**
2. Delete o usuário problemático
3. Crie um novo usuário manualmente ou via signup
4. Teste o login novamente

## 10. Verificar Variáveis de Ambiente no Vercel

Certifique-se de que as variáveis de ambiente estão corretas (se estiver usando):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Mas como estamos usando valores hardcoded, isso não deve ser necessário.

---

## ⚠️ Problema Comum: Email não Confirmado

Se você habilitou confirmação de email mas não confirmou:
- O login pode parecer funcionar mas a sessão não será mantida
- **Solução**: Confirme o email ou desabilite a confirmação temporariamente

## ⚠️ Problema Comum: Site URL Incorreta

Se a Site URL no Supabase não corresponder à URL do Vercel:
- O Supabase pode bloquear requisições
- **Solução**: Atualize a Site URL no Supabase

