-- Add onboarding fields to profiles

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_legal_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS age_range TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS country_of_residence TEXT,
  ADD COLUMN IF NOT EXISTS state_of_residence TEXT,
  ADD COLUMN IF NOT EXISTS highest_education_level TEXT,
  ADD COLUMN IF NOT EXISTS employment_status TEXT,
  ADD COLUMN IF NOT EXISTS primary_reason_for_joining TEXT,
  ADD COLUMN IF NOT EXISTS learning_interest_track TEXT,
  ADD COLUMN IF NOT EXISTS current_skill_level TEXT,
  ADD COLUMN IF NOT EXISTS referral_source TEXT,
  ADD COLUMN IF NOT EXISTS career_goal TEXT,
  ADD COLUMN IF NOT EXISTS consent_data_usage BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_receive_communications BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;
