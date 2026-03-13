
-- Add delivery_proof_url column to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS delivery_proof_url text;

-- Drop the service_area based volunteer policy and replace with one that shows ALL pending donations
DROP POLICY IF EXISTS "Volunteers can view available donations" ON public.donations;

CREATE POLICY "Volunteers can view available donations"
ON public.donations FOR SELECT
USING (
  status = 'pending' AND EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'volunteer'
  )
);

-- Create storage bucket for delivery proof images
INSERT INTO storage.buckets (id, name, public) VALUES ('delivery-proofs', 'delivery-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: anyone authenticated can upload
CREATE POLICY "Authenticated users can upload delivery proofs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'delivery-proofs');

-- Storage RLS: anyone can view delivery proofs (public bucket)
CREATE POLICY "Anyone can view delivery proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'delivery-proofs');
