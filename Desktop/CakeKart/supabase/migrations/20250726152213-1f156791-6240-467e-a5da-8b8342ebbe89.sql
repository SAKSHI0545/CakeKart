-- Fix the function by dropping policy first, then recreating everything
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Create the function with proper search path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Recreate the admin policy
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');