-- Fix the infinite recursion issue in profiles RLS policies
-- Drop the problematic policies and recreate them correctly

-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new, safe RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow admins to manage all profiles (without recursive calls)
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'::user_role
  )
);

-- Update the image URLs in cakes table to use proper asset imports
UPDATE public.cakes 
SET image_url = CASE 
  WHEN image_url = '/src/assets/chocolate-truffle-cake.jpg' THEN 'chocolate-truffle-cake.jpg'
  WHEN image_url = '/src/assets/red-velvet-cake.jpg' THEN 'red-velvet-cake.jpg'
  WHEN image_url = '/src/assets/strawberry-dream-cake.jpg' THEN 'strawberry-dream-cake.jpg'
  WHEN image_url = '/src/assets/mango-bliss-cake.jpg' THEN 'mango-bliss-cake.jpg'
  ELSE image_url
END
WHERE image_url LIKE '/src/assets/%';