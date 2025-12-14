-- ============================================
-- MIGRATION COMPLETA - CRIAR PERFIL
-- ============================================
-- Copie e cole este arquivo inteiro no SQL Editor do Supabase
-- e clique em "Run"
-- ============================================

-- 1. Adicionar campos na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS height INTEGER, -- Height in centimeters
ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2); -- Weight in kilograms (e.g., 80.50)

-- 2. Criar bucket de storage para avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Criar políticas de acesso ao storage
-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;

-- Política: Usuários autenticados podem fazer upload de suas próprias imagens
CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Usuários autenticados podem atualizar suas próprias imagens
CREATE POLICY "Users can update their own profile images"
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

-- Política: Usuários autenticados podem deletar suas próprias imagens
CREATE POLICY "Users can delete their own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Acesso público para visualizar imagens de perfil
CREATE POLICY "Public can view profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- ============================================
-- FIM DA MIGRATION
-- ============================================
-- Verifique se tudo funcionou:
-- 1. Vá em Table Editor > profiles - deve ter os campos birth_date, height, weight
-- 2. Vá em Storage - deve ter o bucket "profiles"
-- ============================================
