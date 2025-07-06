-- Create preset users and assign roles
-- Insert preset users with their roles in user_roles table

-- First, let's insert the user roles for the preset accounts
-- These will be linked to the actual auth.users when they sign in

-- We'll use specific UUIDs that we'll need to match when creating the actual auth users
-- Participant user role
INSERT INTO public.user_roles (id, user_id, role, study_id) 
VALUES 
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'participant', NULL),
  (gen_random_uuid(), 'b2c3d4e5-f6g7-8901-bcde-f23456789012', 'investigator', NULL),
  (gen_random_uuid(), 'c3d4e5f6-g7h8-9012-cdef-345678901234', 'cro_sponsor', NULL)
ON CONFLICT DO NOTHING;

-- Create a function to handle preset user role assignment
CREATE OR REPLACE FUNCTION public.assign_preset_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Assign roles based on email
  IF NEW.email = 'participant@studioclinical.com' THEN
    INSERT INTO public.user_roles (user_id, role, study_id)
    VALUES (NEW.id, 'participant', NULL)
    ON CONFLICT DO NOTHING;
  ELSIF NEW.email = 'site@studioclinical.com' THEN
    INSERT INTO public.user_roles (user_id, role, study_id)
    VALUES (NEW.id, 'investigator', NULL)
    ON CONFLICT DO NOTHING;
  ELSIF NEW.email = 'sponsor-cro@studioclinical.com' THEN
    INSERT INTO public.user_roles (user_id, role, study_id)
    VALUES (NEW.id, 'cro_sponsor', NULL)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign roles for preset accounts
CREATE TRIGGER on_auth_user_preset_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_preset_role();