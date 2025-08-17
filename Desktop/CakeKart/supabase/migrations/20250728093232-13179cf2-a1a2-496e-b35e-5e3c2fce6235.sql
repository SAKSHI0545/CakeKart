-- Create storage bucket for cake images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cake-images', 'cake-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

-- Create storage policies for cake images
CREATE POLICY "Anyone can view cake images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cake-images');

CREATE POLICY "Admins can upload cake images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cake-images' AND (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
)));

CREATE POLICY "Admins can update cake images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cake-images' AND (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
)));

CREATE POLICY "Admins can delete cake images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'cake-images' AND (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
)));

-- Add discount fields to cakes table
ALTER TABLE public.cakes 
ADD COLUMN discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

ALTER TABLE public.cakes 
ADD COLUMN discount_start_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.cakes 
ADD COLUMN discount_end_date TIMESTAMP WITH TIME ZONE;

-- Enable real-time for cakes and categories tables
ALTER TABLE public.cakes REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.cakes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;