
-- Create storage bucket for marketing media
INSERT INTO storage.buckets (id, name, public) VALUES ('marketing-media', 'marketing-media', true);

-- Allow admins to upload
CREATE POLICY "Admins can upload marketing media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'marketing-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Allow public read (for message previews)
CREATE POLICY "Marketing media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketing-media');

-- Allow admins to delete
CREATE POLICY "Admins can delete marketing media"
ON storage.objects FOR DELETE
USING (bucket_id = 'marketing-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
