
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_legal_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS date_of_birth text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS age_range text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS gender text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS country_of_residence text DEFAULT '',
  ADD COLUMN IF NOT EXISTS state_of_residence text DEFAULT '',
  ADD COLUMN IF NOT EXISTS highest_education_level text DEFAULT '',
  ADD COLUMN IF NOT EXISTS employment_status text DEFAULT '',
  ADD COLUMN IF NOT EXISTS primary_reason_for_joining text DEFAULT '',
  ADD COLUMN IF NOT EXISTS learning_interest_track text DEFAULT '',
  ADD COLUMN IF NOT EXISTS current_skill_level text DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS referral_source text DEFAULT '',
  ADD COLUMN IF NOT EXISTS career_goal text DEFAULT '',
  ADD COLUMN IF NOT EXISTS consent_data_usage boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_receive_communications boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
