# Como Corrigir Usuário que não Foi Adicionado à Tabela `users`

## ⚠️ IMPORTANTE: Primeiro verifique onde está o problema

1. **Se NÃO há usuário em Authentication > Users**: O cadastro não foi criado. Veja `DIAGNOSTICO_CADASTRO.md`
2. **Se HÁ usuário em Authentication > Users mas NÃO na tabela `users`**: Siga os passos abaixo

---

Se você fez o cadastro, o usuário aparece em **Authentication > Users**, mas não apareceu na tabela `users`, siga estes passos:

## Passo 1: Execute a Migração de Correção

1. Abra o arquivo `supabase/migrations/20251211000001_fix_users_trigger.sql`
2. Copie todo o conteúdo
3. No Supabase Dashboard, vá em **SQL Editor**
4. Cole o conteúdo e clique em **Run**

Esta migração:
- Melhora o trigger para funcionar melhor
- Cria uma função `sync_user_to_table` que pode sincronizar usuários manualmente

## Passo 2: Sincronizar o Usuário Existente

### Opção A: Via SQL Editor (Recomendado)

1. No Supabase Dashboard, vá em **Authentication** > **Users**
2. Encontre o usuário que você criou
3. Copie o **User UID** (o ID do usuário)
4. Vá em **SQL Editor** e execute:

```sql
SELECT public.sync_user_to_table('COLE_O_USER_UID_AQUI');
```

Substitua `COLE_O_USER_UID_AQUI` pelo ID do usuário que você copiou.

### Opção B: Via SQL Direto

Se a função não funcionar, execute diretamente:

```sql
-- Primeiro, veja qual é o ID do usuário
SELECT id, email, raw_user_meta_data FROM auth.users ORDER BY created_at DESC LIMIT 1;

-- Depois, insira manualmente (substitua os valores)
INSERT INTO public.users (id, name, phone, role)
VALUES (
  'ID_DO_USUARIO_AQUI',
  'Nome do Usuário',
  'Telefone',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;
```

## Passo 3: Verificar

1. Vá em **Table Editor** > **users**
2. Verifique se o usuário aparece na lista
3. Se aparecer, está tudo certo!

## Por que isso aconteceu?

O trigger pode ter falhado por:
- Políticas RLS bloqueando a inserção
- Erro silencioso no trigger
- Metadata não sendo passada corretamente

A migração de correção resolve esses problemas para futuros cadastros.

## Prevenir no Futuro

Após executar a migração de correção, os próximos cadastros devem funcionar automaticamente. O trigger foi melhorado para:
- Lidar melhor com erros
- Bypassar RLS quando necessário
- Ter fallbacks caso o metadata não esteja disponível
