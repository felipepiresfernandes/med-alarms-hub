# Configuração do Supabase

Este guia explica como configurar o Supabase para o sistema de alarmes médicos.

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
```

⚠️ **Sobre o Token (anon public key)**:
- O token **NÃO expira** - é uma chave permanente que identifica seu projeto
- Não precisa renovar ou gerar novo token
- Se você ver erros sobre token, geralmente significa que:
  - A chave não está configurada no arquivo `.env`
  - A chave está incorreta (copiada errada)
  - O servidor não foi reiniciado após adicionar a chave

### Como obter essas informações:

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`

⚠️ **Sobre o Token (anon public key)**:
- O token **NÃO expira** - é uma chave permanente que identifica seu projeto
- Não precisa renovar ou gerar novo token
- Se você ver erros sobre token, geralmente significa que:
  - A chave não está configurada no arquivo `.env`
  - A chave está incorreta (copiada errada)
  - O servidor não foi reiniciado após adicionar a chave

## Configuração do Supabase Auth

### Desabilitar confirmação de email (para desenvolvimento)

Por padrão, o Supabase requer confirmação de email. Para desenvolvimento local, você pode desabilitar:

1. No Dashboard do Supabase, vá em **Authentication** (no menu lateral esquerdo)
2. Clique em **Providers** (aba dentro de Authentication)
3. Na seção **Email**, localize a opção **Confirm Email**
4. Desative o toggle **Confirm Email** (mude para **off**)
5. Role até o final da página e clique em **Save** para salvar as alterações

⚠️ **Importante**: Em produção, mantenha a confirmação de email habilitada para segurança.

**Caminho completo**: Authentication → Providers → Email → Confirm Email (toggle off) → Save

## Executar Migrações

Após configurar as variáveis de ambiente, execute as migrações do banco de dados.

### Localização dos arquivos de migração

Os arquivos de migração estão na pasta `supabase/migrations/` na raiz do projeto:
- `supabase/migrations/20251210200450_7a163cdf-9ddf-44fe-b58f-3c2394dd26b5.sql` - Tabela products
- `supabase/migrations/20251210201211_c6497486-3ccf-4a80-b98a-f410fcc8d4b2.sql` - Tabela profiles
- `supabase/migrations/20251211000000_create_users_table.sql` - Tabela users (admin) ⚠️ **OBRIGATÓRIA**
- `supabase/migrations/20251211000001_fix_users_trigger.sql` - Correção do trigger de usuários ⚠️ **RECOMENDADA**

### Como executar as migrações

#### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New query**
5. Abra o arquivo `supabase/migrations/20251211000000_create_users_table.sql` no seu editor de código
6. Copie **todo o conteúdo** do arquivo
7. Cole no SQL Editor do Supabase
8. Clique em **Run** (ou pressione `Ctrl+Enter`)
9. Repita o processo para os outros arquivos de migração (se ainda não foram executados)

#### Opção 2: Via Supabase CLI (se tiver instalado)

```bash
# Na raiz do projeto
supabase db push
```

⚠️ **Importante**: 
1. Execute a migração `20251211000000_create_users_table.sql` **antes** de tentar fazer o primeiro cadastro de admin
2. Execute também `20251211000001_fix_users_trigger.sql` para melhorar a confiabilidade do trigger
3. Se você já fez um cadastro e o usuário não apareceu na tabela `users`, veja o arquivo `FIX_USER_SYNC.md` para instruções de correção

## Troubleshooting

### Erro: "Supabase não está configurado"

**Causa**: As variáveis de ambiente não estão definidas ou o servidor não foi reiniciado.

**Solução**:
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se as variáveis começam com `VITE_`
3. Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro: "User already registered"

**Causa**: O email/telefone já está cadastrado no sistema.

**Solução**: Use outro número de telefone ou limpe os dados de teste no Supabase Dashboard.

### Erro: "Email not confirmed"

**Causa**: A confirmação de email está habilitada e o usuário não confirmou o email.

**Solução**: 
- Desabilite a confirmação de email no Dashboard: **Authentication** → **Providers** → **Email** → **Confirm Email** (toggle off) → **Save**
- Ou verifique a caixa de entrada do email usado no cadastro

### Erro: "Could not find the table 'public.users'" ou "404 Not Found" para `/rest/v1/users`

**Causa**: A tabela `users` não existe, não está acessível via API, ou não está no schema correto.

**Solução Rápida**:
1. **Verifique se a tabela existe**: No Supabase Dashboard, vá em **Table Editor** e veja se a tabela `users` aparece
2. **Se não existir**: Execute a migração `supabase/migrations/20251211000000_create_users_table.sql` novamente no SQL Editor
3. **Se existir mas ainda dá erro**: Veja o arquivo `VERIFICAR_TABELA_USERS.md` para diagnóstico completo

**Solução Detalhada**: Veja o arquivo `VERIFICAR_TABELA_USERS.md` para verificação passo a passo.

### Usuário criado mas não aparece na tabela `users`

**Causa**: O trigger não executou ou falhou silenciosamente.

**Solução Rápida**:
1. Execute a migração de correção: `supabase/migrations/20251211000001_fix_users_trigger.sql`
2. Sincronize o usuário existente usando a função:
   ```sql
   SELECT public.sync_user_to_table('ID_DO_USUARIO_AQUI');
   ```
   (Encontre o ID em **Authentication** > **Users**)

**Solução Detalhada**:
Veja o arquivo `FIX_USER_SYNC.md` para instruções completas passo a passo.

### Usuário não aparece em Authentication > Users (cadastro não cria usuário)

**Causa**: O `signUp` não está criando o usuário no `auth.users`.

**Solução**:
1. **Verifique o console do navegador** (F12) - procure por mensagens de diagnóstico
2. **Verifique as variáveis de ambiente** - devem aparecer como "✓ Configurado" no console
3. **Verifique se a confirmação de email está desabilitada** - Authentication → Providers → Email
4. **Veja o arquivo `DIAGNOSTICO_CADASTRO.md`** para um guia completo de diagnóstico

### Verificar se o Supabase está funcionando

Abra o console do navegador (F12) e verifique:
- Se há erros relacionados ao Supabase
- Se as variáveis de ambiente estão sendo carregadas (procure por "DIAGNÓSTICO DE CADASTRO")
- Se as requisições estão sendo feitas para a URL correta do Supabase
- Veja a aba **Network** para verificar requisições HTTP

## Estrutura do Banco de Dados

### Tabela `users`
Armazena informações dos usuários do sistema (admin e usuários normais).

Campos:
- `id` (UUID) - Referência ao `auth.users.id`
- `name` (TEXT) - Nome do usuário
- `phone` (TEXT) - Telefone
- `role` (TEXT) - 'admin' ou 'user'
- `created_at`, `updated_at` - Timestamps

### Tabela `profiles`
Armazena perfis de pessoas gerenciadas (não são contas de login).

### Tabela `products`
Armazena produtos (medicamentos e suplementos) do estoque.

## Próximos Passos

Após configurar:
1. Execute as migrações
2. Desabilite confirmação de email (para desenvolvimento)
3. Reinicie o servidor
4. Acesse a aplicação e faça o primeiro cadastro de admin
