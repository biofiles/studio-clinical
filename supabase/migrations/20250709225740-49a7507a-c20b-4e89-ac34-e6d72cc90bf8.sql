-- Create enum for consent types
CREATE TYPE public.consent_type AS ENUM (
  'main_icf',
  'pharmacokinetics', 
  'biomarkers',
  'pregnant_partner'
);

-- Create enum for consent signature status
CREATE TYPE public.consent_signature_status AS ENUM (
  'participant_signed',
  'investigator_signed', 
  'complete'
);

-- Create consent_signatures table
CREATE TABLE public.consent_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
  consent_version TEXT NOT NULL DEFAULT '1.0',
  consent_type consent_type NOT NULL DEFAULT 'main_icf',
  
  -- Participant signature fields
  participant_signature_data TEXT,
  participant_full_name TEXT,
  participant_signed_at TIMESTAMP WITH TIME ZONE,
  participant_auth_timestamp TIMESTAMP WITH TIME ZONE,
  participant_ip_address INET,
  
  -- Investigator signature fields  
  investigator_signature_data TEXT,
  investigator_full_name TEXT,
  investigator_signed_at TIMESTAMP WITH TIME ZONE,
  investigator_user_id UUID,
  investigator_auth_timestamp TIMESTAMP WITH TIME ZONE,
  investigator_ip_address INET,
  
  -- Workflow and audit fields
  status consent_signature_status NOT NULL DEFAULT 'participant_signed',
  signature_meaning_acknowledged BOOLEAN NOT NULL DEFAULT false,
  investigator_meaning_acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consent_signatures ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Participants can view their own consent signatures" 
ON public.consent_signatures 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.participants p 
    JOIN public.user_roles ur ON ur.study_id = p.study_id 
    WHERE p.id = consent_signatures.participant_id 
    AND ur.user_id = auth.uid() 
    AND ur.role = 'participant'
  )
);

CREATE POLICY "Participants can create their own consent signatures" 
ON public.consent_signatures 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.participants p 
    JOIN public.user_roles ur ON ur.study_id = p.study_id 
    WHERE p.id = consent_signatures.participant_id 
    AND ur.user_id = auth.uid() 
    AND ur.role = 'participant'
  )
);

CREATE POLICY "Participants can update their own consent signatures" 
ON public.consent_signatures 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.participants p 
    JOIN public.user_roles ur ON ur.study_id = p.study_id 
    WHERE p.id = consent_signatures.participant_id 
    AND ur.user_id = auth.uid() 
    AND ur.role = 'participant'
  )
);

CREATE POLICY "Investigators can view consent signatures in their studies" 
ON public.consent_signatures 
FOR SELECT 
USING (
  has_role(auth.uid(), 'investigator'::app_role, study_id) OR 
  has_role(auth.uid(), 'cro_sponsor'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Investigators can update consent signatures in their studies" 
ON public.consent_signatures 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'investigator'::app_role, study_id) OR 
  has_role(auth.uid(), 'cro_sponsor'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_consent_signatures_updated_at
BEFORE UPDATE ON public.consent_signatures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_consent_signatures_participant_id ON public.consent_signatures(participant_id);
CREATE INDEX idx_consent_signatures_study_id ON public.consent_signatures(study_id);
CREATE INDEX idx_consent_signatures_status ON public.consent_signatures(status);
CREATE INDEX idx_consent_signatures_investigator_user_id ON public.consent_signatures(investigator_user_id);

-- Create function to get pending consent signatures for investigators
CREATE OR REPLACE FUNCTION public.get_pending_consent_signatures(investigator_user_id UUID, check_study_id UUID DEFAULT NULL)
RETURNS TABLE (
  consent_id UUID,
  participant_id UUID,
  participant_name TEXT,
  subject_id TEXT,
  consent_type consent_type,
  participant_signed_at TIMESTAMP WITH TIME ZONE,
  days_pending INTEGER
)
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT 
    cs.id as consent_id,
    cs.participant_id,
    CONCAT(p.first_name, ' ', p.last_name) as participant_name,
    p.subject_id,
    cs.consent_type,
    cs.participant_signed_at,
    EXTRACT(DAY FROM (now() - cs.participant_signed_at))::INTEGER as days_pending
  FROM public.consent_signatures cs
  JOIN public.participants p ON p.id = cs.participant_id
  WHERE cs.status = 'participant_signed'
    AND (check_study_id IS NULL OR cs.study_id = check_study_id)
    AND (
      has_role(investigator_user_id, 'investigator'::app_role, cs.study_id) OR 
      has_role(investigator_user_id, 'cro_sponsor'::app_role) OR 
      has_role(investigator_user_id, 'admin'::app_role)
    )
  ORDER BY cs.participant_signed_at ASC;
$$;