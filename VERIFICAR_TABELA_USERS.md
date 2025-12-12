# Como Verificar se a Tabela `users` Existe Corretamente

Se você está vendo o erro `Could not find the table 'public.users'`, siga estes passos:

## Passo 1: Verificar se a Tabela Existe no Supabase

1. No Supabase Dashboard, vá em **Table Editor** (menu lateral)
2. Procure pela tabela `users` na lista
3. Se **NÃO aparecer**, a migração não foi executada corretamente

## Passo 2: Verificar via SQL Editor

1. No Supabase Dashboard, vá em **SQL Editor**
2. Execute esta query:

```sql
SELECT 
    table_name, 
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';
```

**Resultado esperado**: Deve retornar uma linha com `table_name = 'users'` e `table_schema = 'public'`

**Se não retornar nada**: A tabela não existe. Execute a migração novamente.

## Passo 3: Verificar Permissões da Tabela

Execute esta query no SQL Editor:

```sql
SELECT 
    tablename,
    schemaname,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';
```

**Resultado esperado**: Deve retornar a tabela `users`

## Passo 4: Verificar se a Tabela está Exposta via API

O Supabase usa PostgREST para expor tabelas via API. Verifique:

1. No Supabase Dashboard, vá em **Settings** > **API**
2. Role até a seção **Exposed Tables** ou **Table Access**
3. Verifique se `users` está na lista de tabelas expostas

**Se não estiver exposta**: Isso pode ser o problema. A tabela existe mas não está acessível via API.

## Passo 5: Recriar a Tabela (Se Necessário)

Se a tabela não existe ou não está acessível, execute novamente a migração:

1. Abra `supabase/migrations/20251211000000_create_users_table.sql`
2. Copie todo o conteúdo
3. No SQL Editor, cole e execute
4. Verifique se aparece mensagem de sucesso

## Passo 6: Verificar RLS (Row Level Security)

Execute:

```sql
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';
```

**`rowsecurity = true`**: RLS está habilitado (correto)
**`rowsecurity = false`**: RLS não está habilitado (pode ser um problema)

## Passo 7: Verificar Políticas RLS

Execute:

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users';
```

**Resultado esperado**: Deve retornar pelo menos 3 políticas (SELECT, INSERT, UPDATE)

## Problema Comum: Tabela Existe mas não é Acessível

Se a tabela existe no Table Editor mas não é acessível via API:

1. Verifique se está no schema `public` (não `auth` ou outro schema)
2. Verifique se as políticas RLS estão corretas
3. Tente desabilitar temporariamente RLS para testar:

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

**⚠️ ATENÇÃO**: Reabilite RLS depois do teste:

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## Solução: Recriar Tudo do Zero

Se nada funcionar, execute este script completo no SQL Editor:

```sql
-- Remove tudo relacionado à tabela users (CUIDADO!)
DROP TABLE IF EXISTS public.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.sync_user_to_table(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.has_admin() CASCADE;

-- Agora execute novamente a migração completa
-- Copie e cole todo o conteúdo de 20251211000000_create_users_table.sql
-- Depois execute 20251211000001_fix_users_trigger.sql
```
