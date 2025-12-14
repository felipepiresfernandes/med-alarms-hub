# Como Executar as Migrations no Supabase

## Opção 1: Executar no SQL Editor do Supabase (Recomendado)

### Passo 1: Adicionar campos na tabela profiles

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Cole o seguinte SQL e clique em **Run**:

```sql
-- Add birth_date, height, and weight fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS height INTEGER, -- Height in centimeters
ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2); -- Weight in kilograms (e.g., 80.50)
```

### Passo 2: Criar bucket de storage e políticas

1. Ainda no **SQL Editor**, crie uma nova query
2. Cole o seguinte SQL e clique em **Run**:

```sql
-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload their own profile images
CREATE POLICY IF NOT EXISTS "Users can upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to update their own profile images
CREATE POLICY IF NOT EXISTS "Users can update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to delete their own profile images
CREATE POLICY IF NOT EXISTS "Users can delete their own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow public read access to profile images
CREATE POLICY IF NOT EXISTS "Public can view profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles');
```

### Passo 3: Verificar se funcionou

1. Vá em **Table Editor** e verifique se a tabela `profiles` tem os novos campos: `birth_date`, `height`, `weight`
2. Vá em **Storage** e verifique se o bucket `profiles` foi criado

## Opção 2: Usar o CLI do Supabase (Terminal)

Se você tem o Supabase CLI instalado, pode executar no terminal:

```bash
supabase migration up
```

Mas isso requer que você esteja conectado ao projeto com `supabase link`.

## Verificação

Após executar as migrations, você pode verificar se tudo está correto:

1. **Verificar tabela profiles:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'profiles';
   ```

2. **Verificar bucket:**
   - Vá em **Storage** no dashboard
   - Deve aparecer o bucket `profiles`

3. **Verificar políticas:**
   - Vá em **Storage** > **Policies**
   - Deve aparecer as 4 políticas criadas
