
-- 1. Create the table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL
);

-- 2. Enable RLS (Row Level Security) on the table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 3. Drop any old policies to avoid conflicts during re-running this script
DROP POLICY IF EXISTS "Allow public insert" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin read access" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin update access" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin delete access" ON public.feedback;
DROP POLICY IF EXISTS "Allow authenticated users to read feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow authenticated users to update feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow authenticated users to delete feedback" ON public.feedback;

-- 4. Create a policy that allows ANYONE to submit feedback
CREATE POLICY "Allow public insert"
ON public.feedback
FOR INSERT
WITH CHECK (true);

-- 5. Create policies that allow any LOGGED-IN user (i.e., an admin) to read, update, and delete feedback
CREATE POLICY "Allow authenticated users to read feedback"
ON public.feedback
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update feedback"
ON public.feedback
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete feedback"
ON public.feedback
FOR DELETE
USING (auth.role() = 'authenticated');
