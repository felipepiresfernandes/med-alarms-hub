-- Fix: Improve the handle_new_user function to handle errors better
-- and ensure it works even when RLS policies might block

-- Drop and recreate the function with better error handling
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Recreate with better error handling and logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
  user_phone TEXT;
  user_role TEXT;
BEGIN
  -- Extract metadata with fallbacks
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', '');
  user_phone := NEW.raw_user_meta_data->>'phone';
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'admin');
  
  -- If name is empty, try to get from email or use a default
  IF user_name = '' OR user_name IS NULL THEN
    user_name := COALESCE(split_part(NEW.email, '@', 1), 'User');
  END IF;
  
  -- Insert into users table
  -- Using SECURITY DEFINER bypasses RLS, so this should work
  INSERT INTO public.users (id, name, phone, role)
  VALUES (
    NEW.id,
    user_name,
    user_phone,
    user_role
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Error creating user record: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Also create a function that can be called manually to fix existing users
CREATE OR REPLACE FUNCTION public.sync_user_to_table(user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  auth_user RECORD;
  user_name TEXT;
  user_phone TEXT;
  user_role TEXT;
BEGIN
  -- Get user from auth.users
  SELECT 
    id,
    email,
    raw_user_meta_data
  INTO auth_user
  FROM auth.users
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Extract metadata
  user_name := COALESCE(auth_user.raw_user_meta_data->>'name', '');
  user_phone := auth_user.raw_user_meta_data->>'phone';
  user_role := COALESCE(auth_user.raw_user_meta_data->>'role', 'admin');
  
  -- If name is empty, use email prefix
  IF user_name = '' OR user_name IS NULL THEN
    user_name := COALESCE(split_part(auth_user.email, '@', 1), 'User');
  END IF;
  
  -- Insert or update
  INSERT INTO public.users (id, name, phone, role)
  VALUES (
    user_id,
    user_name,
    user_phone,
    user_role
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error syncing user: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.sync_user_to_table(UUID) TO authenticated, anon;
