-- Create the feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL
);

-- Enable RLS (Row Level Security) for the table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public (anonymous) users to insert feedback
CREATE POLICY "Allow public insert"
ON public.feedback
FOR INSERT
WITH CHECK (true);

-- Create a policy that allows authenticated users with the 'service_role' or 'admin' role to read all feedback
-- Note: You might want to create a more specific 'admin' role later
CREATE POLICY "Allow admin read access"
ON public.feedback
FOR SELECT
USING (auth.role() = 'service_role');

-- Create a policy that allows authenticated users with the 'service_role' or 'admin' role to update feedback
CREATE POLICY "Allow admin update access"
ON public.feedback
FOR UPDATE
USING (auth.role() = 'service_role');

-- Create a policy that allows authenticated users with the 'service_role' or 'admin' role to delete feedback
CREATE POLICY "Allow admin delete access"
ON public.feedback
FOR DELETE
USING (auth.role() = 'service_role');
