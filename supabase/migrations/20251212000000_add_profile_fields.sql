-- Add birth_date, height, and weight fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS height INTEGER, -- Height in centimeters
ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2); -- Weight in kilograms (e.g., 80.50)
