-- This script assumes you have already run 004_create_feedback_table.sql
-- It corrects the Row Level Security (RLS) policies to allow any logged-in user
-- to manage the feedback, which is suitable for an admin panel.

-- Drop the old, overly restrictive policies if they exist
DROP POLICY IF EXISTS "Allow admin read access" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin update access" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin delete access" ON public.feedback;

-- Create new policies that allow any authenticated user (i.e., any logged-in admin)
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
