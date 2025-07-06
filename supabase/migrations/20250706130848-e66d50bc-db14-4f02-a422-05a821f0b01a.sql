-- Function to generate invitation tokens
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT 'INV-' || upper(substr(md5(random()::text), 1, 8));
$$;

-- Add columns to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'));

ALTER TABLE public.user_roles 
ADD COLUMN assigned_by UUID REFERENCES auth.users(id);

ALTER TABLE public.user_roles 
ADD COLUMN assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now();

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

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;