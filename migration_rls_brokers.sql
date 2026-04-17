-- Enable Admins to insert into the brokers table
CREATE POLICY "Admins can insert brokers" 
ON public.brokers 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Note: If you also need admins to update or delete, you can run these as well:
CREATE POLICY "Admins can update brokers" 
ON public.brokers 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);
