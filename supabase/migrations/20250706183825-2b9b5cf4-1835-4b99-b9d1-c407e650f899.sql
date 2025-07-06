-- Create some fake user invitations for testing
INSERT INTO public.user_invitations (email, role, study_id, invited_by, full_name, status) VALUES
  ('john.investigator@demo.com', 'investigator', (SELECT id FROM studies WHERE protocol = 'PARADIGM-CV-2025' LIMIT 1), 'f16fbfd3-7cd0-41ff-9da5-c393d76abc8c', 'Dr. John Smith', 'pending'),
  ('maria.sponsor@demo.com', 'cro_sponsor', NULL, 'f16fbfd3-7cd0-41ff-9da5-c393d76abc8c', 'Maria Rodriguez', 'pending'),
  ('sarah.investigator@demo.com', 'investigator', (SELECT id FROM studies WHERE protocol = 'ATLAS-DM2-2025' LIMIT 1), 'f16fbfd3-7cd0-41ff-9da5-c393d76abc8c', 'Dr. Sarah Johnson', 'accepted'),
  ('mike.sponsor@demo.com', 'cro_sponsor', NULL, 'f16fbfd3-7cd0-41ff-9da5-c393d76abc8c', 'Mike Chen', 'expired'),
  ('anna.participant@demo.com', 'participant', (SELECT id FROM studies WHERE protocol = 'PARADIGM-CV-2025' LIMIT 1), 'f16fbfd3-7cd0-41ff-9da5-c393d76abc8c', 'Anna Williams', 'accepted')
ON CONFLICT (email, role) DO NOTHING;