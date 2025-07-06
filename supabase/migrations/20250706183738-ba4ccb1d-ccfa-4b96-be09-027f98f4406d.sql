-- Create some fake users for testing user management
-- Note: These are fake users for demonstration purposes

-- Insert fake profiles
INSERT INTO public.profiles (user_id, email, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john.investigator@demo.com', 'Dr. John Smith'),
  ('22222222-2222-2222-2222-222222222222', 'maria.sponsor@demo.com', 'Maria Rodriguez'),
  ('33333333-3333-3333-3333-333333333333', 'sarah.investigator@demo.com', 'Dr. Sarah Johnson'),
  ('44444444-4444-4444-4444-444444444444', 'mike.sponsor@demo.com', 'Mike Chen'),
  ('55555555-5555-5555-5555-555555555555', 'anna.participant@demo.com', 'Anna Williams')
ON CONFLICT (user_id) DO NOTHING;

-- Insert corresponding user roles
INSERT INTO public.user_roles (user_id, role, study_id, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'investigator', (SELECT id FROM studies WHERE protocol = 'PARADIGM-CV-2025' LIMIT 1), 'active'),
  ('22222222-2222-2222-2222-222222222222', 'cro_sponsor', NULL, 'active'),
  ('33333333-3333-3333-3333-333333333333', 'investigator', (SELECT id FROM studies WHERE protocol = 'ATLAS-DM2-2025' LIMIT 1), 'active'),
  ('44444444-4444-4444-4444-444444444444', 'cro_sponsor', NULL, 'pending'),
  ('55555555-5555-5555-5555-555555555555', 'participant', (SELECT id FROM studies WHERE protocol = 'PARADIGM-CV-2025' LIMIT 1), 'active')
ON CONFLICT (user_id, role, study_id) DO NOTHING;

-- Insert some fake participants
INSERT INTO public.participants (id, study_id, subject_id, first_name, last_name, email, status) VALUES
  ('55555555-5555-5555-5555-555555555555', (SELECT id FROM studies WHERE protocol = 'PARADIGM-CV-2025' LIMIT 1), 'P001', 'Anna', 'Williams', 'anna.participant@demo.com', 'enrolled'),
  ('66666666-6666-6666-6666-666666666666', (SELECT id FROM studies WHERE protocol = 'ATLAS-DM2-2025' LIMIT 1), 'P002', 'David', 'Brown', 'david.participant@demo.com', 'screening'),
  ('77777777-7777-7777-7777-777777777777', (SELECT id FROM studies WHERE protocol = 'HORIZON-Onc-2025' LIMIT 1), 'P003', 'Lisa', 'Davis', 'lisa.participant@demo.com', 'enrolled')
ON CONFLICT (id) DO NOTHING;