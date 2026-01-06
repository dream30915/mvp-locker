ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Allow admins to update other profiles (for promoting/demoting)
CREATE POLICY "Admins can update other profiles" ON public.profiles
FOR UPDATE USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- Allow admins to see all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
