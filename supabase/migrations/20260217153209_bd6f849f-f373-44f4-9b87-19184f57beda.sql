
-- Add clinical_note_id to patient_images for linking attachments to SOAP notes
ALTER TABLE public.patient_images 
ADD COLUMN clinical_note_id uuid REFERENCES public.clinical_notes(id) ON DELETE SET NULL;

CREATE INDEX idx_patient_images_clinical_note ON public.patient_images(clinical_note_id) WHERE clinical_note_id IS NOT NULL;
