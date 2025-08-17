-- Fix infinite recursion by creating a security definer function
-- Drop the problematic admin policy first
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create the admin policy using the function (avoids recursion)
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');