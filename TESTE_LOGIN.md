# 🔧 TESTE SIMPLES DO LOGIN

## 🧪 **COMO TESTAR AGORA:**

### **Passo 1: Limpar tudo**
1. **Feche o navegador completamente**
2. **Abra novamente**
3. **Vá para** `http://localhost:4200`

### **Passo 2: Fazer login**
1. **Usuário:** `admin`
2. **Senha:** `1234`
3. **Clique em "Entrar"**

### **Passo 3: Verificar logs**
1. **Pressione F12** (DevTools)
2. **Vá na aba Console**
3. **Deve aparecer:**
   ```
   Token salvo: fake-jwt-token
   Token verificado: fake-jwt-token
   ```

### **Passo 4: Testar navegação**
1. **Após login** deve ir para `/tabela`
2. **Clique em "Tarefas → Lista"**
3. **Deve funcionar sem pedir login**

## 🚨 **SE AINDA NÃO FUNCIONAR:**

### **Teste manual no console:**
1. **F12** → **Console**
2. **Digite:** `sessionStorage.getItem('token')`
3. **Deve retornar:** `"fake-jwt-token"`

### **Se retornar null:**
- O problema está no salvamento do token
- Limpe o cache e tente novamente

### **Se retornar o token mas ainda pedir login:**
- O problema está na verificação
- Verifique os logs no console

## 🎯 **CREDENCIAIS:**
- **admin** / **1234**
- **teste** / **senha**

**Teste agora e me diga o que aparece no console!** 🔍
