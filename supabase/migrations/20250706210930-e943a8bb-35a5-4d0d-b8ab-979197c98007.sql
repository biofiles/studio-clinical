-- Fix RLS policy for profiles table to prevent privilege escalation
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add input validation function for email addresses
CREATE OR REPLACE FUNCTION public.validate_email(email_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email_input ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add function to sanitize text inputs
CREATE OR REPLACE FUNCTION public.sanitize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove dangerous characters and trim whitespace
  RETURN trim(regexp_replace(input_text, '[<>"\'';&]', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update user_invitations table to add email validation
ALTER TABLE public.user_invitations 
ADD CONSTRAINT valid_email_format 
CHECK (validate_email(email));

-- Update participants table to add constraints
ALTER TABLE public.participants 
ADD CONSTRAINT valid_participant_email 
CHECK (email IS NULL OR validate_email(email));

ALTER TABLE public.participants 
ADD CONSTRAINT valid_subject_id 
CHECK (length(trim(subject_id)) >= 1);

-- Enhanced activity logging for security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  event_details JSONB DEFAULT NULL,
  user_id_param UUID DEFAULT auth.uid()
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_activity_log (
    user_id, 
    activity_type, 
    details,
    ip_address
  ) VALUES (
    COALESCE(user_id_param, auth.uid()),
    'SECURITY_' || event_type,
    event_details,
    inet_client_addr()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;