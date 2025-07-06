-- Function to generate invitation tokens (define first)
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT 'INV-' || upper(substr(md5(random()::text), 1, 8));
$$;

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  user_id UUID,
  activity_type TEXT,
  details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO public.user_activity_log (user_id, activity_type, details)
  VALUES (user_id, activity_type, details);
$$;

-- Add status column to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'));

-- Add assigned_by column to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN assigned_by UUID REFERENCES auth.users(id);

-- Add assigned_at column to user_roles table  
ALTER TABLE public.user_roles 
ADD COLUMN assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add permissions column to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN permissions JSONB DEFAULT '{}';

-- Create user_invitations table
CREATE TABLE public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role app_role NOT NULL,
  study_id UUID REFERENCES public.studies(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  full_name TEXT,
  token TEXT NOT NULL DEFAULT generate_invitation_token(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_invitations
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Create user_activity_log table
CREATE TABLE public.user_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  activity_type TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_activity_log
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_invitations
CREATE POLICY "CRO sponsors and admins can manage invitations"
  ON public.user_invitations FOR ALL
  USING (
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can view invitations they sent"
  ON public.user_invitations FOR SELECT
  USING (invited_by = auth.uid());

-- RLS Policies for user_activity_log
CREATE POLICY "Users can view their own activity"
  ON public.user_activity_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "CRO sponsors and admins can view all activity"
  ON public.user_activity_log FOR SELECT
  USING (
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );