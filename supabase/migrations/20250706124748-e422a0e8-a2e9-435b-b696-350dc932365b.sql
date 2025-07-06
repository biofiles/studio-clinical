-- First, add a unique constraint to prevent duplicate role assignments
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_role_study_unique 
UNIQUE (user_id, role, study_id);

-- Now assign roles to existing test users
INSERT INTO public.user_roles (user_id, role, study_id) VALUES
-- Participant user
('969483c0-86d4-4334-acef-25f71103817a', 'participant', NULL),
-- Investigator user  
('f16fbfd3-7cd0-41ff-9da5-c393d76abc8c', 'investigator', NULL),
-- CRO/Sponsor user
('d0c21cb9-7c6d-4438-9e3b-3a81b75bbf57', 'cro_sponsor', NULL),
-- Admin role for project owner
('61639b54-777e-4883-bc4a-624524cf3e56', 'admin', NULL)
ON CONFLICT (user_id, role, study_id) DO NOTHING;

-- Update the trigger function to automatically assign roles on signup
CREATE OR REPLACE FUNCTION public.assign_preset_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Assign roles based on email
  IF NEW.email = 'participant@studioclinical.com' THEN
    INSERT INTO public.user_roles (user_id, role, study_id)
    VALUES (NEW.id, 'participant', NULL)
    ON CONFLICT (user_id, role, study_id) DO NOTHING;
  ELSIF NEW.email = 'site@studioclinical.com' THEN
    INSERT INTO public.user_roles (user_id, role, study_id)
    VALUES (NEW.id, 'investigator', NULL)
    ON CONFLICT (user_id, role, study_id) DO NOTHING;
  ELSIF NEW.email = 'sponsor-cro@studioclinical.com' THEN
    INSERT INTO public.user_roles (user_id, role, study_id)
    VALUES (NEW.id, 'cro_sponsor', NULL)
    ON CONFLICT (user_id, role, study_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS assign_preset_role_trigger ON auth.users;
CREATE TRIGGER assign_preset_role_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION assign_preset_role();