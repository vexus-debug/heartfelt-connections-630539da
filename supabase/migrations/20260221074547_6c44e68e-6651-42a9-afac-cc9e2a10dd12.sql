
-- Marketing campaigns table
CREATE TABLE public.marketing_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'whatsapp', -- 'whatsapp' or 'email'
  status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, sending, sent, failed
  subject TEXT, -- for email campaigns
  message_body TEXT NOT NULL DEFAULT '',
  media_urls TEXT[] DEFAULT '{}',
  template_name TEXT, -- WhatsApp template name
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER NOT NULL DEFAULT 0,
  delivered_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  read_count INTEGER NOT NULL DEFAULT 0,
  target_filter JSONB DEFAULT '{}', -- filters like gender, status, age range etc.
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read marketing_campaigns"
  ON public.marketing_campaigns FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert marketing_campaigns"
  ON public.marketing_campaigns FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update marketing_campaigns"
  ON public.marketing_campaigns FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete marketing_campaigns"
  ON public.marketing_campaigns FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Individual message delivery log
CREATE TABLE public.marketing_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  recipient_phone TEXT,
  recipient_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, delivered, read, failed
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read marketing_messages"
  ON public.marketing_messages FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert marketing_messages"
  ON public.marketing_messages FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update marketing_messages"
  ON public.marketing_messages FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Message templates for reusable content
CREATE TABLE public.marketing_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  subject TEXT, -- for email
  body TEXT NOT NULL DEFAULT '',
  media_urls TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'promotional', -- promotional, appointment_reminder, follow_up, seasonal
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read marketing_templates"
  ON public.marketing_templates FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert marketing_templates"
  ON public.marketing_templates FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update marketing_templates"
  ON public.marketing_templates FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete marketing_templates"
  ON public.marketing_templates FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON public.marketing_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketing_templates_updated_at
  BEFORE UPDATE ON public.marketing_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
