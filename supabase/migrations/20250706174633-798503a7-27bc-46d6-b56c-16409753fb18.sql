-- Create test users and assign roles for all studies
-- Note: These are test users with predefined UUIDs for development

-- Insert test CRO sponsors
INSERT INTO public.profiles (id, user_id, full_name, email, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Maria Rodriguez', 'cro.sponsor1@studioclinical.com', now(), now()),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Carlos Silva', 'cro.sponsor2@studioclinical.com', now(), now())
ON CONFLICT (user_id) DO NOTHING;

-- Insert test investigators
INSERT INTO public.profiles (id, user_id, full_name, email, created_at, updated_at) VALUES
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Dr. Ana Martinez', 'investigator1@studioclinical.com', now(), now()),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Dr. Pedro Gonzalez', 'investigator2@studioclinical.com', now(), now()),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Dr. Laura Chen', 'investigator3@studioclinical.com', now(), now())
ON CONFLICT (user_id) DO NOTHING;

-- Insert test participants
INSERT INTO public.profiles (id, user_id, full_name, email, created_at, updated_at) VALUES
  ('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Juan Perez', 'participant1@studioclinical.com', now(), now()),
  ('77777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Sofia Lopez', 'participant2@studioclinical.com', now(), now()),
  ('88888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'Miguel Torres', 'participant3@studioclinical.com', now(), now()),
  ('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'Elena Ramirez', 'participant4@studioclinical.com', now(), now())
ON CONFLICT (user_id) DO NOTHING;

-- Assign CRO sponsor roles
INSERT INTO public.user_roles (user_id, role, study_id, status, assigned_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'cro_sponsor', NULL, 'active', now()),
  ('22222222-2222-2222-2222-222222222222', 'cro_sponsor', NULL, 'active', now())
ON CONFLICT (user_id, role, study_id) DO NOTHING;

-- Assign investigator roles to specific studies
INSERT INTO public.user_roles (user_id, role, study_id, status, assigned_at) VALUES
  ('33333333-3333-3333-3333-333333333333', 'investigator', '1', 'active', now()),
  ('44444444-4444-4444-4444-444444444444', 'investigator', '2', 'active', now()),
  ('55555555-5555-5555-5555-555555555555', 'investigator', '3', 'active', now())
ON CONFLICT (user_id, role, study_id) DO NOTHING;

-- Create test participants data
INSERT INTO public.participants (
  id, study_id, subject_id, first_name, last_name, email, 
  date_of_birth, gender, address, city, state, country, zip_code,
  status, enrollment_date, arm, created_at, updated_at
) VALUES
  (gen_random_uuid(), '1', 'PARA-001', 'Juan', 'Perez', 'participant1@studioclinical.com', 
   '1985-03-15', 'Male', 'Calle 123 #45', 'Madrid', 'Madrid', 'Spain', '28001',
   'active', '2024-10-15', 'Treatment A', now(), now()),
  (gen_random_uuid(), '1', 'PARA-002', 'Sofia', 'Lopez', 'participant2@studioclinical.com', 
   '1978-07-22', 'Female', 'Avenida Central 567', 'Barcelona', 'Cataluña', 'Spain', '08001',
   'active', '2024-11-01', 'Treatment B', now(), now()),
  (gen_random_uuid(), '2', 'ATLA-001', 'Miguel', 'Torres', 'participant3@studioclinical.com', 
   '1990-12-08', 'Male', 'Plaza Mayor 89', 'Valencia', 'Valencia', 'Spain', '46001',
   'active', '2025-01-15', 'Control', now(), now()),
  (gen_random_uuid(), '3', 'HORI-001', 'Elena', 'Ramirez', 'participant4@studioclinical.com', 
   '1982-09-30', 'Female', 'Gran Via 234', 'Sevilla', 'Andalucía', 'Spain', '41001',
   'screening', '2024-07-10', 'Experimental', now(), now())
ON CONFLICT (study_id, subject_id) DO NOTHING;

-- Assign participant roles to studies
INSERT INTO public.user_roles (user_id, role, study_id, status, assigned_at) VALUES
  ('66666666-6666-6666-6666-666666666666', 'participant', '1', 'active', now()),
  ('77777777-7777-7777-7777-777777777777', 'participant', '1', 'active', now()),
  ('88888888-8888-8888-8888-888888888888', 'participant', '2', 'active', now()),
  ('99999999-9999-9999-9999-999999999999', 'participant', '3', 'active', now())
ON CONFLICT (user_id, role, study_id) DO NOTHING;

-- Create sample questionnaire responses
INSERT INTO public.questionnaire_responses (
  participant_id, questionnaire_id, title, answers, status, submitted_at, created_at, updated_at
) 
SELECT 
  p.id,
  'daily-symptoms-v2',
  'Daily Symptoms Assessment',
  jsonb_build_object(
    'pain_level', floor(random() * 10 + 1),
    'fatigue_level', floor(random() * 10 + 1),
    'sleep_quality', floor(random() * 5 + 1),
    'medication_taken', CASE WHEN random() > 0.5 THEN true ELSE false END,
    'side_effects', CASE WHEN random() > 0.7 THEN 'Mild nausea' ELSE null END
  ),
  'completed',
  now() - interval '1 day' * floor(random() * 30),
  now() - interval '1 day' * floor(random() * 30),
  now()
FROM public.participants p
WHERE p.status = 'active'
LIMIT 10;

INSERT INTO public.questionnaire_responses (
  participant_id, questionnaire_id, title, answers, status, submitted_at, created_at, updated_at
) 
SELECT 
  p.id,
  'weekly-qol-v1',
  'Weekly Quality of Life',
  jsonb_build_object(
    'overall_wellbeing', floor(random() * 10 + 1),
    'physical_function', floor(random() * 10 + 1),
    'emotional_state', floor(random() * 10 + 1),
    'social_activities', floor(random() * 10 + 1)
  ),
  'completed',
  now() - interval '1 week' * floor(random() * 4),
  now() - interval '1 week' * floor(random() * 4),
  now()
FROM public.participants p
WHERE p.status = 'active'
LIMIT 8;

-- Create user activity logs
INSERT INTO public.user_activity_log (user_id, activity_type, details, created_at) VALUES
  ('33333333-3333-3333-3333-333333333333', 'login', '{"ip": "192.168.1.1", "device": "Chrome/Desktop"}', now() - interval '2 hours'),
  ('33333333-3333-3333-3333-333333333333', 'participant_enrolled', '{"participant_id": "PARA-001", "study_id": "1"}', now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444', 'questionnaire_reviewed', '{"questionnaire_id": "daily-symptoms-v2", "participant_count": 5}', now() - interval '3 hours'),
  ('66666666-6666-6666-6666-666666666666', 'questionnaire_completed', '{"questionnaire_id": "daily-symptoms-v2", "completion_time": "00:03:45"}', now() - interval '1 hour'),
  ('77777777-7777-7777-7777-777777777777', 'consent_signed', '{"consent_version": "v2.0", "document_id": "ICF-PARADIGM-v2"}', now() - interval '5 days');