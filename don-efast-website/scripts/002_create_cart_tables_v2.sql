-- Create cart_items table to store shopping cart data
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For anonymous users
  service_slug TEXT NOT NULL,
  service_title TEXT NOT NULL,
  package_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "cart_items_select_own" ON public.cart_items;
DROP POLICY IF EXISTS "cart_items_select_session" ON public.cart_items;
DROP POLICY IF EXISTS "cart_items_insert_own" ON public.cart_items;
DROP POLICY IF EXISTS "cart_items_update_own" ON public.cart_items;
DROP POLICY IF EXISTS "cart_items_delete_own" ON public.cart_items;

-- Create policies for cart_items
-- Allow users to view their own cart items (authenticated users)
CREATE POLICY "cart_items_select_own" ON public.cart_items 
  FOR SELECT USING (auth.uid() = user_id);

-- Allow anonymous users to view their cart items by session_id
CREATE POLICY "cart_items_select_session" ON public.cart_items 
  FOR SELECT USING (user_id IS NULL AND session_id IS NOT NULL);

-- Allow users to insert their own cart items
CREATE POLICY "cart_items_insert_own" ON public.cart_items 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND session_id IS NOT NULL));

-- Allow users to update their own cart items
CREATE POLICY "cart_items_update_own" ON public.cart_items 
  FOR UPDATE USING (auth.uid() = user_id OR (user_id IS NULL AND session_id IS NOT NULL));

-- Allow users to delete their own cart items
CREATE POLICY "cart_items_delete_own" ON public.cart_items 
  FOR DELETE USING (auth.uid() = user_id OR (user_id IS NULL AND session_id IS NOT NULL));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON public.cart_items(session_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON public.cart_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
