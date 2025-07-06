-- Create table for study results summary signups (Plain Language Summary)
CREATE TABLE public.study_results_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
  study_id UUID REFERENCES public.studies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  signed_up_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.study_results_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "CRO sponsors and admins can view all signups" 
ON public.study_results_signups 
FOR SELECT 
USING (has_role(auth.uid(), 'cro_sponsor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Investigators can view signups in their studies" 
ON public.study_results_signups 
FOR SELECT 
USING (has_role(auth.uid(), 'investigator'::app_role, study_id) OR has_role(auth.uid(), 'cro_sponsor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Participants can manage their own signups" 
ON public.study_results_signups 
FOR ALL 
USING (EXISTS (
  SELECT 1 
  FROM participants p 
  JOIN user_roles ur ON ur.study_id = p.study_id 
  WHERE p.id = study_results_signups.participant_id 
    AND ur.user_id = auth.uid() 
    AND ur.role = 'participant'::app_role
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_study_results_signups_updated_at
BEFORE UPDATE ON public.study_results_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();