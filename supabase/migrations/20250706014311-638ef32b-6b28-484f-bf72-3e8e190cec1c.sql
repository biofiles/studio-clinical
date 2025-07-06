-- Create clinical research database schema with proper RLS

-- Studies table
CREATE TABLE public.studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  protocol TEXT NOT NULL,
  phase TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'suspended')),
  sponsor TEXT,
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on studies
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;

-- Participants table
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'unknown')),
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'screening' CHECK (status IN ('screening', 'enrolled', 'active', 'completed', 'withdrawn')),
  enrollment_date DATE,
  completion_date DATE,
  arm TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(study_id, subject_id)
);

-- Enable RLS on participants
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Questionnaire responses table
CREATE TABLE public.questionnaire_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  questionnaire_id TEXT NOT NULL,
  title TEXT NOT NULL,
  answers JSONB,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'submitted')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on questionnaire responses
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- User roles table for RBAC
CREATE TYPE public.app_role AS ENUM ('participant', 'investigator', 'cro_sponsor', 'admin');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  study_id UUID REFERENCES public.studies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, study_id)
);

-- Enable RLS on user roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID, check_study_id UUID DEFAULT NULL)
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = check_user_id 
    AND (check_study_id IS NULL OR study_id = check_study_id OR study_id IS NULL)
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1
      WHEN 'cro_sponsor' THEN 2
      WHEN 'investigator' THEN 3
      WHEN 'participant' THEN 4
    END
  LIMIT 1;
$$;

-- Function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(check_user_id UUID, check_role app_role, check_study_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = check_user_id 
      AND role = check_role
      AND (check_study_id IS NULL OR study_id = check_study_id OR study_id IS NULL)
  );
$$;

-- RLS Policies for studies
CREATE POLICY "CRO sponsors and admins can view all studies"
  ON public.studies FOR SELECT
  USING (
    public.has_role(auth.uid(), 'cro_sponsor') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Investigators can view their assigned studies"
  ON public.studies FOR SELECT
  USING (
    public.has_role(auth.uid(), 'investigator', id) OR
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Only CRO sponsors and admins can create studies"
  ON public.studies FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Only CRO sponsors and admins can update studies"
  ON public.studies FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for participants
CREATE POLICY "Participants can view their own data"
  ON public.participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
        AND role = 'participant' 
        AND study_id = participants.study_id
    )
  );

CREATE POLICY "Investigators can view participants in their studies"
  ON public.participants FOR SELECT
  USING (
    public.has_role(auth.uid(), 'investigator', study_id) OR
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Only investigators, CRO sponsors and admins can manage participants"
  ON public.participants FOR ALL
  USING (
    public.has_role(auth.uid(), 'investigator', study_id) OR
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for questionnaire responses
CREATE POLICY "Participants can view and manage their own responses"
  ON public.questionnaire_responses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.participants p
      JOIN public.user_roles ur ON ur.study_id = p.study_id
      WHERE p.id = questionnaire_responses.participant_id
        AND ur.user_id = auth.uid()
        AND ur.role = 'participant'
    )
  );

CREATE POLICY "Investigators can view responses in their studies"
  ON public.questionnaire_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.participants p
      WHERE p.id = questionnaire_responses.participant_id
        AND (
          public.has_role(auth.uid(), 'investigator', p.study_id) OR
          public.has_role(auth.uid(), 'cro_sponsor') OR
          public.has_role(auth.uid(), 'admin')
        )
    )
  );

-- RLS Policies for user roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update triggers for timestamps
CREATE TRIGGER update_studies_updated_at
  BEFORE UPDATE ON public.studies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON public.participants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questionnaire_responses_updated_at
  BEFORE UPDATE ON public.questionnaire_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing (with proper user roles)
INSERT INTO public.studies (name, description, protocol, phase, status, sponsor) VALUES
('COVID-19 Vaccine Study', 'Phase III clinical trial for COVID-19 vaccine efficacy', 'PROTO-001', 'III', 'active', 'PharmaCorpInc'),
('Diabetes Treatment Trial', 'Phase II study for new diabetes medication', 'PROTO-002', 'II', 'active', 'MedResearch LLC'),
('Heart Disease Prevention', 'Phase I safety study for cardiovascular prevention drug', 'PROTO-003', 'I', 'planning', 'CardioTech');