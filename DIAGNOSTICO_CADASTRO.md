# Diagnóstico: Usuário não está sendo criado

Se você fez o cadastro mas não aparece nenhum usuário em **Authentication > Users**, siga este guia de diagnóstico:

## Passo 1: Verificar Console do Navegador

1. Abra o console do navegador (F12 ou Ctrl+Shift+I)
2. Vá na aba **Console**
3. Tente fazer o cadastro novamente
4. Procure por mensagens que começam com `=== DIAGNÓSTICO DE CADASTRO ===`

## Passo 2: Verificar Variáveis de Ambiente

No console, você verá:
- `Supabase URL: ✓ Configurado` ou `✗ Não configurado`
- `Supabase Key: ✓ Configurado` ou `✗ Não configurado`

**Se aparecer "Não configurado"**:
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se contém:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
   ```
3. **Reinicie o servidor** após criar/editar o `.env`

## Passo 3: Verificar Erros Específicos

### Erro: "already registered" ou "already exists"
**Solução**: O email/telefone já está cadastrado. Use outro número.

### Erro: "needs email confirmation"
**Solução**: 
1. No Supabase Dashboard: **Authentication** → **Providers** → **Email**
2. Desative **Confirm Email**
3. Clique em **Save**

### Erro: "Supabase client não está disponível"
**Solução**: 
1. Verifique as variáveis de ambiente
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache do navegador

### Erro: "Nenhuma resposta do Supabase"
**Solução**: 
1. Verifique sua conexão com a internet
2. Verifique se a URL do Supabase está correta
3. Verifique se o projeto Supabase está ativo

## Passo 4: Verificar Configuração do Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Vá em **Settings** > **API**
3. Verifique se a **Project URL** está correta
4. Verifique se a **anon public key** está correta

## Passo 5: Verificar Logs do Supabase

1. No Supabase Dashboard, vá em **Logs** (menu lateral)
2. Clique em **Auth Logs**
3. Veja se há tentativas de cadastro registradas
4. Se houver erros, eles aparecerão aqui

## Passo 6: Testar Conexão Manualmente

No console do navegador, execute:

```javascript
// Verifica se o Supabase está configurado
console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Key:", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "Configurado" : "Não configurado");

// Tenta fazer uma requisição simples
const { data, error } = await supabase.auth.getSession();
console.log("Teste de conexão:", { data, error });
```

## Problemas Comuns

### 1. Variáveis de ambiente não carregadas
**Sintoma**: Console mostra "✗ Não configurado"
**Solução**: Reinicie o servidor após criar/editar `.env`

### 2. Confirmação de email habilitada
**Sintoma**: Usuário criado mas não aparece (fica pendente)
**Solução**: Desabilite confirmação de email no Dashboard

### 3. Email já existe
**Sintoma**: Erro "already registered"
**Solução**: Use outro número de telefone ou delete o usuário existente

### 4. CORS ou rede
**Sintoma**: Erro de rede no console
**Solução**: Verifique conexão e configurações do Supabase

## Próximos Passos

Após identificar o problema:
1. Corrija conforme as soluções acima
2. Tente fazer o cadastro novamente
3. Verifique o console para novos erros
4. Se persistir, compartilhe os logs do console
