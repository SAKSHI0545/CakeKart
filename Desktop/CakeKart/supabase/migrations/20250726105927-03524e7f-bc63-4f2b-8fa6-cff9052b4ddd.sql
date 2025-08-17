-- Fix security warnings by setting proper search_path for functions

-- Drop and recreate handle_new_user function with proper search_path
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Drop and recreate update_updated_at_column function with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate update_cake_rating function with proper search_path
DROP FUNCTION IF EXISTS public.update_cake_rating();

CREATE OR REPLACE FUNCTION public.update_cake_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.cakes
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE cake_id = COALESCE(NEW.cake_id, OLD.cake_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE cake_id = COALESCE(NEW.cake_id, OLD.cake_id)
    )
  WHERE id = COALESCE(NEW.cake_id, OLD.cake_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;