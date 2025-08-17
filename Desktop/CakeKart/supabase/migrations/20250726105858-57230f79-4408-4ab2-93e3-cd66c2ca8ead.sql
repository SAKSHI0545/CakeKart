-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('customer', 'admin');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cakes table
CREATE TABLE public.cakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  available BOOLEAN DEFAULT true,
  ingredients TEXT[],
  allergens TEXT[],
  preparation_time INTEGER, -- in minutes
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT,
  delivery_phone TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  cake_id UUID NOT NULL REFERENCES public.cakes(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  customizations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  cake_id UUID NOT NULL REFERENCES public.cakes(id),
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, cake_id, order_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- order_update, review_reminder, promotion, etc.
  read BOOLEAN DEFAULT false,
  related_id UUID, -- could reference order_id, review_id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for cakes (public read, admin write)
CREATE POLICY "Anyone can view available cakes" ON public.cakes
  FOR SELECT USING (available = true OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage cakes" ON public.cakes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their orders" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cakes_updated_at
  BEFORE UPDATE ON public.cakes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update cake ratings
CREATE OR REPLACE FUNCTION public.update_cake_rating()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update cake ratings when reviews change
CREATE TRIGGER update_cake_rating_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cake_rating();

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_cakes_category_id ON public.cakes(category_id);
CREATE INDEX idx_cakes_available ON public.cakes(available);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_cake_id ON public.order_items(cake_id);
CREATE INDEX idx_reviews_cake_id ON public.reviews(cake_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
('Birthday Cakes', 'Perfect cakes for birthday celebrations'),
('Wedding Cakes', 'Elegant cakes for your special day'),
('Custom Cakes', 'Personalized cakes made to order'),
('Cupcakes', 'Individual sized treats'),
('Seasonal', 'Holiday and seasonal specialties');

-- Insert sample cakes
INSERT INTO public.cakes (name, description, price, category_id, ingredients, allergens, preparation_time) 
SELECT 
  'Chocolate Truffle Cake',
  'Rich chocolate cake with truffle filling and ganache topping',
  45.99,
  c.id,
  ARRAY['flour', 'chocolate', 'eggs', 'butter', 'sugar', 'cream'],
  ARRAY['gluten', 'dairy', 'eggs'],
  180
FROM public.categories c WHERE c.name = 'Birthday Cakes'
UNION ALL
SELECT 
  'Red Velvet Cake',
  'Classic red velvet with cream cheese frosting',
  39.99,
  c.id,
  ARRAY['flour', 'cocoa', 'eggs', 'butter', 'cream cheese'],
  ARRAY['gluten', 'dairy', 'eggs'],
  150
FROM public.categories c WHERE c.name = 'Birthday Cakes'
UNION ALL
SELECT 
  'Strawberry Dream Cake',
  'Light sponge cake with fresh strawberries and whipped cream',
  42.99,
  c.id,
  ARRAY['flour', 'strawberries', 'eggs', 'cream', 'sugar'],
  ARRAY['gluten', 'dairy', 'eggs'],
  120
FROM public.categories c WHERE c.name = 'Birthday Cakes'
UNION ALL
SELECT 
  'Mango Bliss Cake',
  'Tropical mango flavored cake with mango buttercream',
  38.99,
  c.id,
  ARRAY['flour', 'mango', 'eggs', 'butter', 'sugar'],
  ARRAY['gluten', 'dairy', 'eggs'],
  140
FROM public.categories c WHERE c.name = 'Seasonal';